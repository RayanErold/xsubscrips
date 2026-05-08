import {
  pgTable,
  serial,
  text,
  numeric,
  boolean,
  date,
  timestamp,
  integer,
  uuid,
} from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const subscriptionsTable = pgTable("subscriptions", {
  id: serial("id").primaryKey(),
  userId: uuid("user_id").notNull(),
  name: text("name").notNull(),
  category: text("category").notNull(),
  price: numeric("price", { precision: 10, scale: 2 }).notNull(),
  currency: text("currency").notNull().default("USD"),
  billingCycle: text("billing_cycle").notNull().default("monthly"),
  startDate: date("start_date").notNull(),
  nextBillingDate: date("next_billing_date").notNull(),
  hasTrial: boolean("has_trial").notNull().default(false),
  trialEndDate: date("trial_end_date"),
  reminderDaysBefore: integer("reminder_days_before"),
  notes: text("notes"),
  status: text("status").notNull().default("active"),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export const billingHistoryTable = pgTable("billing_history", {
  id: serial("id").primaryKey(),
  subscriptionId: integer("subscription_id")
    .notNull()
    .references(() => subscriptionsTable.id, { onDelete: "cascade" }),
  userId: uuid("user_id").notNull(),
  billingDate: date("billing_date").notNull(),
  amount: numeric("amount", { precision: 10, scale: 2 }).notNull(),
  currency: text("currency").notNull().default("USD"),
  receiptUrl: text("receipt_url"),
  status: text("status").notNull().default("paid"),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export const insertSubscriptionSchema = createInsertSchema(
  subscriptionsTable,
).omit({ id: true, createdAt: true });

export const insertBillingHistorySchema = createInsertSchema(
  billingHistoryTable,
).omit({ id: true, createdAt: true });

export type InsertSubscription = z.infer<typeof insertSubscriptionSchema>;
export type Subscription = typeof subscriptionsTable.$inferSelect;
export type BillingHistory = typeof billingHistoryTable.$inferSelect;
