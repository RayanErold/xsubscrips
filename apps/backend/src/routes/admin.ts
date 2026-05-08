import { Router, type Response } from "express";
import { processDailyReminders } from "../lib/notifications";
import { logger } from "../lib/logger";

const router = Router();

/**
 * Endpoint to manually trigger the daily reminder check.
 * In production, this should be protected by an Admin API Key.
 */
router.post("/admin/trigger-reminders", async (req, res: Response) => {
  try {
    const sentCount = await processDailyReminders();
    res.json({ 
      success: true, 
      message: `Processed reminders successfully.`,
      emailsSent: sentCount 
    });
  } catch (error) {
    logger.error({ error }, "Failed to trigger reminders");
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
