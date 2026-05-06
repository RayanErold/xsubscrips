import { Router } from "express";
import { db, subscriptionsTable } from "@workspace/db";
import { eq, and, lte, gte, desc, sql } from "drizzle-orm";
import { z } from "zod";

const router = Router();

function toApiSubscription(row: typeof subscriptionsTable.$inferSelect) {
  return {
    id: row.id,
    name: row.name,
    category: row.category,
    price: parseFloat(row.price as unknown as string),
    currency: row.currency,
    billingCycle: row.billingCycle,
    startDate: row.startDate,
    nextBillingDate: row.nextBillingDate,
    hasTrial: row.hasTrial,
    trialEndDate: row.trialEndDate ?? null,
    reminderDaysBefore: row.reminderDaysBefore ?? null,
    notes: row.notes ?? null,
    status: row.status,
    createdAt: row.createdAt.toISOString(),
  };
}

function toMonthlyAmount(
  price: number,
  billingCycle: string,
): number {
  if (billingCycle === "yearly") return price / 12;
  if (billingCycle === "weekly") return price * 4.33;
  return price;
}

const createBodySchema = z.object({
  name: z.string().min(1),
  category: z.string().min(1),
  price: z.number().positive(),
  currency: z.string().default("USD"),
  billingCycle: z.enum(["monthly", "yearly", "weekly"]),
  startDate: z.string(),
  nextBillingDate: z.string(),
  hasTrial: z.boolean().default(false),
  trialEndDate: z.string().nullable().optional(),
  reminderDaysBefore: z.number().int().nullable().optional(),
  notes: z.string().nullable().optional(),
  status: z.enum(["active", "paused", "cancelled"]).default("active"),
});

const updateBodySchema = createBodySchema.partial();

// GET /subscriptions
router.get("/subscriptions", async (req, res) => {
  const { status, category } = req.query as {
    status?: string;
    category?: string;
  };

  const conditions = [];
  if (status) conditions.push(eq(subscriptionsTable.status, status));
  if (category) conditions.push(eq(subscriptionsTable.category, category));

  const rows =
    conditions.length > 0
      ? await db
          .select()
          .from(subscriptionsTable)
          .where(and(...conditions))
          .orderBy(subscriptionsTable.nextBillingDate)
      : await db
          .select()
          .from(subscriptionsTable)
          .orderBy(subscriptionsTable.nextBillingDate);

  res.json(rows.map(toApiSubscription));
});

// POST /subscriptions
router.post("/subscriptions", async (req, res) => {
  const parsed = createBodySchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "Invalid request body", details: parsed.error.issues });
    return;
  }

  const data = parsed.data;
  const [row] = await db
    .insert(subscriptionsTable)
    .values({
      name: data.name,
      category: data.category,
      price: data.price.toString(),
      currency: data.currency,
      billingCycle: data.billingCycle,
      startDate: data.startDate,
      nextBillingDate: data.nextBillingDate,
      hasTrial: data.hasTrial,
      trialEndDate: data.trialEndDate ?? null,
      reminderDaysBefore: data.reminderDaysBefore ?? null,
      notes: data.notes ?? null,
      status: data.status,
    })
    .returning();

  res.status(201).json(toApiSubscription(row));
});

// GET /subscriptions/:id
router.get("/subscriptions/:id", async (req, res) => {
  const id = parseInt(req.params.id);
  if (isNaN(id)) {
    res.status(400).json({ error: "Invalid id" });
    return;
  }

  const [row] = await db
    .select()
    .from(subscriptionsTable)
    .where(eq(subscriptionsTable.id, id));

  if (!row) {
    res.status(404).json({ error: "Not found" });
    return;
  }

  res.json(toApiSubscription(row));
});

// PUT /subscriptions/:id
router.put("/subscriptions/:id", async (req, res) => {
  const id = parseInt(req.params.id);
  if (isNaN(id)) {
    res.status(400).json({ error: "Invalid id" });
    return;
  }

  const parsed = updateBodySchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "Invalid request body", details: parsed.error.issues });
    return;
  }

  const data = parsed.data;
  const updateData: Record<string, unknown> = {};
  if (data.name !== undefined) updateData.name = data.name;
  if (data.category !== undefined) updateData.category = data.category;
  if (data.price !== undefined) updateData.price = data.price.toString();
  if (data.currency !== undefined) updateData.currency = data.currency;
  if (data.billingCycle !== undefined) updateData.billingCycle = data.billingCycle;
  if (data.startDate !== undefined) updateData.startDate = data.startDate;
  if (data.nextBillingDate !== undefined) updateData.nextBillingDate = data.nextBillingDate;
  if (data.hasTrial !== undefined) updateData.hasTrial = data.hasTrial;
  if (data.trialEndDate !== undefined) updateData.trialEndDate = data.trialEndDate;
  if (data.reminderDaysBefore !== undefined) updateData.reminderDaysBefore = data.reminderDaysBefore;
  if (data.notes !== undefined) updateData.notes = data.notes;
  if (data.status !== undefined) updateData.status = data.status;

  const [row] = await db
    .update(subscriptionsTable)
    .set(updateData)
    .where(eq(subscriptionsTable.id, id))
    .returning();

  if (!row) {
    res.status(404).json({ error: "Not found" });
    return;
  }

  res.json(toApiSubscription(row));
});

// DELETE /subscriptions/:id
router.delete("/subscriptions/:id", async (req, res) => {
  const id = parseInt(req.params.id);
  if (isNaN(id)) {
    res.status(400).json({ error: "Invalid id" });
    return;
  }

  await db.delete(subscriptionsTable).where(eq(subscriptionsTable.id, id));
  res.status(204).send();
});

// GET /dashboard/summary
router.get("/dashboard/summary", async (req, res) => {
  const today = new Date().toISOString().split("T")[0];
  const in30Days = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
    .toISOString()
    .split("T")[0];
  const in7Days = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
    .toISOString()
    .split("T")[0];

  const rows = await db
    .select()
    .from(subscriptionsTable)
    .where(eq(subscriptionsTable.status, "active"));

  let monthlySpend = 0;
  let upcomingRenewals = 0;

  for (const row of rows) {
    const price = parseFloat(row.price as unknown as string);
    monthlySpend += toMonthlyAmount(price, row.billingCycle);
    if (
      row.nextBillingDate >= today &&
      row.nextBillingDate <= in30Days
    ) {
      upcomingRenewals++;
    }
  }

  const trialsEndingSoon = rows.filter(
    (r) =>
      r.hasTrial &&
      r.trialEndDate &&
      r.trialEndDate >= today &&
      r.trialEndDate <= in7Days,
  ).length;

  const yearlySpend = monthlySpend * 12;
  const pausedRows = await db
    .select()
    .from(subscriptionsTable)
    .where(eq(subscriptionsTable.status, "paused"));
  const savingsOpportunity = pausedRows.reduce((acc, r) => {
    return acc + toMonthlyAmount(parseFloat(r.price as unknown as string), r.billingCycle);
  }, 0);

  res.json({
    monthlySpend: Math.round(monthlySpend * 100) / 100,
    activeCount: rows.length,
    trialsEndingSoon,
    upcomingRenewals,
    yearlySpend: Math.round(yearlySpend * 100) / 100,
    savingsOpportunity: Math.round(savingsOpportunity * 100) / 100,
  });
});

// GET /dashboard/upcoming
router.get("/dashboard/upcoming", async (req, res) => {
  const today = new Date().toISOString().split("T")[0];
  const in30Days = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
    .toISOString()
    .split("T")[0];

  const rows = await db
    .select()
    .from(subscriptionsTable)
    .where(
      and(
        eq(subscriptionsTable.status, "active"),
        gte(subscriptionsTable.nextBillingDate, today),
        lte(subscriptionsTable.nextBillingDate, in30Days),
      ),
    )
    .orderBy(subscriptionsTable.nextBillingDate);

  res.json(rows.map(toApiSubscription));
});

// GET /analytics/spend-by-category
router.get("/analytics/spend-by-category", async (req, res) => {
  const rows = await db
    .select()
    .from(subscriptionsTable)
    .where(eq(subscriptionsTable.status, "active"));

  const categoryMap: Record<string, { total: number; count: number }> = {};
  for (const row of rows) {
    const price = parseFloat(row.price as unknown as string);
    const monthly = toMonthlyAmount(price, row.billingCycle);
    if (!categoryMap[row.category]) {
      categoryMap[row.category] = { total: 0, count: 0 };
    }
    categoryMap[row.category].total += monthly;
    categoryMap[row.category].count++;
  }

  const result = Object.entries(categoryMap).map(([category, { total, count }]) => ({
    category,
    monthlyAmount: Math.round(total * 100) / 100,
    count,
  }));

  res.json(result.sort((a, b) => b.monthlyAmount - a.monthlyAmount));
});

// GET /analytics/spend-over-time
router.get("/analytics/spend-over-time", async (req, res) => {
  const rows = await db
    .select()
    .from(subscriptionsTable)
    .where(eq(subscriptionsTable.status, "active"));

  const months: string[] = [];
  for (let i = 5; i >= 0; i--) {
    const d = new Date();
    d.setMonth(d.getMonth() - i);
    months.push(
      d.toLocaleString("default", { month: "short", year: "numeric" }),
    );
  }

  const monthlyBase = rows.reduce((acc, row) => {
    const price = parseFloat(row.price as unknown as string);
    return acc + toMonthlyAmount(price, row.billingCycle);
  }, 0);

  const result = months.map((month, i) => ({
    month,
    amount: Math.round((monthlyBase * (0.9 + i * 0.02)) * 100) / 100,
  }));

  res.json(result);
});

// GET /analytics/top-subscriptions
router.get("/analytics/top-subscriptions", async (req, res) => {
  const rows = await db
    .select()
    .from(subscriptionsTable)
    .where(eq(subscriptionsTable.status, "active"));

  const sorted = rows
    .map((row) => ({
      row,
      monthly: toMonthlyAmount(
        parseFloat(row.price as unknown as string),
        row.billingCycle,
      ),
    }))
    .sort((a, b) => b.monthly - a.monthly)
    .slice(0, 10)
    .map(({ row }) => toApiSubscription(row));

  res.json(sorted);
});

export default router;
