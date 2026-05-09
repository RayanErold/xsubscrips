import { Resend } from "resend";
import { db, subscriptionsTable, billingHistoryTable, usersTable } from "@workspace/db";
import { eq, and } from "drizzle-orm";
import { logger } from "./logger";
import { format, addDays, addMonths, addWeeks, addYears, parseISO, isSameDay } from "date-fns";

// ---------------------------------------------------------------------------
// Date advancement
// ---------------------------------------------------------------------------

/**
 * Given the current nextBillingDate and billing cycle, returns the next one.
 */
function computeNextBillingDate(current: Date, billingCycle: string): Date {
  switch (billingCycle) {
    case "yearly":
      return addYears(current, 1);
    case "weekly":
      return addWeeks(current, 1);
    case "monthly":
    default:
      return addMonths(current, 1);
  }
}

/**
 * Advances nextBillingDate by one billing cycle and logs the new charge
 * to billing_history.
 */
async function advanceNextBillingDate(
  sub: typeof subscriptionsTable.$inferSelect,
): Promise<void> {
  const current = parseISO(sub.nextBillingDate);
  const next = computeNextBillingDate(current, sub.billingCycle);
  const nextStr = format(next, "yyyy-MM-dd");

  logger.info(
    { subId: sub.id, name: sub.name, from: sub.nextBillingDate, to: nextStr },
    "Advancing nextBillingDate",
  );

  await db
    .update(subscriptionsTable)
    .set({ nextBillingDate: nextStr })
    .where(eq(subscriptionsTable.id, sub.id));

  // Log the upcoming charge in billing history
  await db.insert(billingHistoryTable).values({
    subscriptionId: sub.id,
    userId: sub.userId,
    billingDate: nextStr,
    amount: sub.price as unknown as string,
    currency: sub.currency,
    status: "paid",
  });
}

// ---------------------------------------------------------------------------
// Main cron entry point
// ---------------------------------------------------------------------------

/**
 * Main function to check and send reminders for all users.
 * This should be called by a cron job once a day.
 *
 * Logic:
 *  - If today == nextBillingDate   → advance the date + log history + send email
 *  - If today == reminderDate      → send reminder email only (no advance yet)
 */
export async function processDailyReminders() {
  logger.info("Starting daily reminder processing...");

  try {
    const allSubscriptions = await db
      .select({
        subscription: subscriptionsTable,
        userEmail: usersTable.email,
      })
      .from(subscriptionsTable)
      .leftJoin(usersTable, eq(subscriptionsTable.userId, usersTable.id))
      .where(eq(subscriptionsTable.status, "active"));

    const today = new Date();
    let sentCount = 0;

    for (const item of allSubscriptions) {
      const { subscription: sub, userEmail } = item;
      if (!userEmail) continue;

      const nextBilling = parseISO(sub.nextBillingDate);

      // ── Billing day: advance date + send confirmation email ────────────
      if (isSameDay(today, nextBilling)) {
        await advanceNextBillingDate(sub);
        await sendReminderEmail(sub, userEmail, "charged");
        sentCount++;
        continue;
      }

      // ── Reminder day: send warning email only ─────────────────────────
      if (sub.reminderDaysBefore) {
        const reminderDate = addDays(nextBilling, -sub.reminderDaysBefore);
        if (isSameDay(today, reminderDate)) {
          await sendReminderEmail(sub, userEmail, "upcoming");
          sentCount++;
        }
      }
    }

    logger.info({ sentCount }, "Finished processing daily reminders");
    return sentCount;
  } catch (error) {
    logger.error({ error }, "Failed to process daily reminders");
    throw error;
  }
}

// ---------------------------------------------------------------------------
// Email sender
// ---------------------------------------------------------------------------

type EmailMode = "upcoming" | "charged";

async function sendReminderEmail(
  subscription: typeof subscriptionsTable.$inferSelect,
  userEmail: string,
  mode: EmailMode,
) {
  const price = parseFloat(subscription.price as unknown as string).toFixed(2);
  const formattedDate = format(
    parseISO(subscription.nextBillingDate),
    "MMMM do, yyyy",
  );

  const isCharged = mode === "charged";
  const subject = isCharged
    ? `Renewal processed: ${subscription.name}`
    : `Upcoming Renewal: ${subscription.name}`;

  const headingColor = isCharged ? "#059669" : "#7c3aed";
  const heading = isCharged ? "Renewal Processed" : "Upcoming Renewal Alert";
  const intro = isCharged
    ? `Your subscription for <strong>${subscription.name}</strong> has renewed today.`
    : `Your subscription for <strong>${subscription.name}</strong> is renewing soon.`;

  logger.info(
    { subId: subscription.id, name: subscription.name, to: userEmail, mode },
    `Sending ${mode} email for ${subscription.name} ($${price}) to ${userEmail}`,
  );

  if (!process.env.RESEND_API_KEY) {
    logger.warn("RESEND_API_KEY not found. Skipping email delivery.");
    return;
  }

  const resend = new Resend(process.env.RESEND_API_KEY);

  try {
    await resend.emails.send({
      from: "Xsubscrips <onboarding@resend.dev>",
      to: userEmail,
      subject,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
          <h2 style="color: ${headingColor};">${heading}</h2>
          <p>Hi there,</p>
          <p>${intro}</p>
          <div style="background: #f9f9f9; padding: 15px; border-radius: 8px; margin: 20px 0;">
            <p style="margin: 5px 0;"><strong>Amount:</strong> ${subscription.currency} ${price}</p>
            <p style="margin: 5px 0;"><strong>${isCharged ? "Renewed On" : "Renewal Date"}:</strong> ${formattedDate}</p>
            <p style="margin: 5px 0;"><strong>Category:</strong> ${subscription.category}</p>
          </div>
          ${
            !isCharged
              ? `<p>If you no longer use this service, remember to cancel it before the renewal date to avoid being charged.</p>`
              : ""
          }
          <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;" />
          <p style="font-size: 12px; color: #666;">This is an automated message from Xsubscrips.</p>
        </div>
      `,
    });
  } catch (err) {
    logger.error({ err, subId: subscription.id }, "Failed to send email via Resend");
  }
}
