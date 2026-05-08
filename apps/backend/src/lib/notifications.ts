import { Resend } from "resend";
import { db, subscriptionsTable, usersTable } from "@workspace/db";
import { eq } from "drizzle-orm";
import { logger } from "./logger";
import { format, addDays, parseISO, isSameDay } from "date-fns";

/**
 * Main function to check and send reminders for all users.
 * This should be called by a cron job once a day.
 */
export async function processDailyReminders() {
  logger.info("Starting daily reminder processing...");
  
  try {
    // 1. Fetch all active subscriptions with reminders set, joining with users to get email
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
      
      if (!sub.reminderDaysBefore || !userEmail) continue;

      const nextBilling = parseISO(sub.nextBillingDate);
      const reminderDate = addDays(nextBilling, -sub.reminderDaysBefore);

      // Check if today is the day to send the reminder
      if (isSameDay(today, reminderDate)) {
        await sendReminderEmail(sub, userEmail);
        sentCount++;
      }
    }

    logger.info({ sentCount }, "Finished processing daily reminders");
    return sentCount;
  } catch (error) {
    logger.error({ error }, "Failed to process daily reminders");
    throw error;
  }
}

async function sendReminderEmail(subscription: typeof subscriptionsTable.$inferSelect, userEmail: string) {
  const price = parseFloat(subscription.price as unknown as string).toFixed(2);
  
  logger.info(
    { subId: subscription.id, name: subscription.name, to: userEmail },
    `Sending reminder for ${subscription.name} ($${price}) to ${userEmail}`
  );

  // If RESEND_API_KEY is present, we send a real email
  if (process.env.RESEND_API_KEY) {
    const resend = new Resend(process.env.RESEND_API_KEY);
    
    try {
      await resend.emails.send({
        from: "SubsTrack <onboarding@resend.dev>",
        to: userEmail,
        subject: `Upcoming Renewal: ${subscription.name}`,
        html: `
          <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
            <h2 style="color: #7c3aed;">Upcoming Renewal Alert</h2>
            <p>Hi there,</p>
            <p>Your subscription for <strong>${subscription.name}</strong> is renewing soon.</p>
            <div style="background: #f9f9f9; padding: 15px; border-radius: 8px; margin: 20px 0;">
              <p style="margin: 5px 0;"><strong>Amount:</strong> ${subscription.currency} ${price}</p>
              <p style="margin: 5px 0;"><strong>Renewal Date:</strong> ${format(parseISO(subscription.nextBillingDate), "MMMM do, yyyy")}</p>
              <p style="margin: 5px 0;"><strong>Category:</strong> ${subscription.category}</p>
            </div>
            <p>If you no longer use this service, remember to cancel it before the renewal date to avoid being charged.</p>
            <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;" />
            <p style="font-size: 12px; color: #666;">This is an automated reminder from SubsTrack.</p>
          </div>
        `,
      });
    } catch (err) {
      logger.error({ err, subId: subscription.id }, "Failed to send email via Resend");
    }
  } else {
    logger.warn("RESEND_API_KEY not found. Skipping email delivery and logging to console only.");
  }
}
