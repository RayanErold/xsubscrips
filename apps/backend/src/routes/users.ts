import { Router } from "express";
import { db, usersTable } from "@workspace/db";
import { eq } from "drizzle-orm";
import { logger } from "../lib/logger";

const router = Router();

// Get current user settings (Find or Create)
router.get("/user/settings", async (req, res) => {
  const userId = (req as any).user.id;
  const userEmail = (req as any).user.email;

  try {
    let [user] = await db
      .select()
      .from(usersTable)
      .where(eq(usersTable.id, userId));

    // If user doesn't exist in our DB yet, create them
    if (!user) {
      logger.info({ userId, userEmail }, "New user detected, creating database record");
      [user] = await db
        .insert(usersTable)
        .values({
          id: userId,
          email: userEmail || "",
          fullName: userEmail ? userEmail.split("@")[0] : "New User",
          createdAt: new Date(),
          updatedAt: new Date(),
        })
        .returning();
    }

    res.json(user);
  } catch (error) {
    logger.error({ error, userId }, "Failed to fetch or create user settings");
    res.status(500).json({ error: "Internal server error" });
  }
});

// Update user settings
router.patch("/user/settings", async (req, res) => {
  const userId = (req as any).user.id;
  const body = req.body;

  const { fullName, trialReminders, renewalReminders, weeklySummary, emailDigest, currency } = body;

  try {
    const [updatedUser] = await db
      .update(usersTable)
      .set({
        fullName: fullName !== undefined ? fullName : undefined,
        trialReminders: trialReminders !== undefined ? trialReminders : undefined,
        renewalReminders: renewalReminders !== undefined ? renewalReminders : undefined,
        weeklySummary: weeklySummary !== undefined ? weeklySummary : undefined,
        emailDigest: emailDigest !== undefined ? emailDigest : undefined,
        currency: currency !== undefined ? currency : undefined,
        updatedAt: new Date(),
      })
      .where(eq(usersTable.id, userId))
      .returning();

    if (!updatedUser) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json(updatedUser);
  } catch (error) {
    logger.error({ error, userId }, "Failed to update user settings");
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
