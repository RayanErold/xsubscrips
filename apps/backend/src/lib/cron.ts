import cron from "node-cron";
import { processDailyReminders } from "./notifications";
import { logger } from "./logger";

/**
 * Initializes all background scheduled tasks.
 */
export function initCronJobs() {
  // Run every day at 9:00 AM
  // Format: 'minute hour day-of-month month day-of-week'
  cron.schedule("0 9 * * *", async () => {
    logger.info("🕒 Running scheduled daily reminders task...");
    try {
      const sentCount = await processDailyReminders();
      logger.info({ sentCount }, "🕒 Scheduled reminders task completed successfully.");
    } catch (error) {
      logger.error({ error }, "❌ Scheduled reminders task failed.");
    }
  });

  logger.info("⏰ Background cron jobs initialized (Daily at 9:00 AM)");
}
