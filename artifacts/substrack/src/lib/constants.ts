import { z } from "zod";

export const CATEGORIES = [
  "Entertainment",
  "Productivity",
  "Music",
  "Video",
  "Gaming",
  "Fitness",
  "News",
  "Education",
  "Cloud",
  "Other",
] as const;

export const CURRENCIES = ["USD", "EUR", "GBP", "CAD", "AUD", "JPY"] as const;

export const BILLING_CYCLES = ["monthly", "yearly", "weekly"] as const;
export const STATUSES = ["active", "paused", "cancelled"] as const;

export const subscriptionFormSchema = z.object({
  name: z.string().min(1, "Name is required"),
  category: z.string().min(1, "Category is required"),
  price: z.coerce.number().min(0, "Price must be greater than or equal to 0"),
  currency: z.string().default("USD"),
  billingCycle: z.enum(["monthly", "yearly", "weekly"]),
  startDate: z.string().min(1, "Start date is required"),
  nextBillingDate: z.string().min(1, "Next billing date is required"),
  hasTrial: z.boolean().default(false),
  trialEndDate: z.string().nullable().optional(),
  reminderDaysBefore: z.coerce.number().nullable().optional(),
  notes: z.string().nullable().optional(),
  status: z.enum(["active", "paused", "cancelled"]).default("active"),
});

export type SubscriptionFormValues = z.infer<typeof subscriptionFormSchema>;
