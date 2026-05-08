import { Request, Response, NextFunction } from "express";
import { supabase } from "../lib/supabase";
import { db, usersTable } from "@workspace/db";
import { sql } from "drizzle-orm";

export interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    email?: string;
  };
}

export const requireAuth = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ error: "Missing or invalid authorization header" });
    }

    const token = authHeader.split(" ")[1];

    // Verify the token with Supabase
    const { data: { user }, error } = await supabase.auth.getUser(token);

    if (error || !user) {
      return res.status(401).json({ error: "Unauthorized: Invalid token" });
    }

    // Attach user to the request object
    req.user = {
      id: user.id,
      email: user.email,
    };

    // Sync user to our public.users table for notifications
    if (user.email) {
      try {
        await db.insert(usersTable)
          .values({
            id: user.id,
            email: user.email,
            updatedAt: new Date(),
          })
          .onConflictDoUpdate({
            target: usersTable.id,
            set: { 
              email: user.email,
              updatedAt: new Date(),
            }
          });
      } catch (dbError) {
        // Log but don't block the request if user sync fails
        console.error("Failed to sync user to public table:", dbError);
      }
    }

    next();
  } catch (error) {
    console.error("Auth middleware error:", error);
    res.status(500).json({ error: "Internal server error during authentication" });
  }
};
