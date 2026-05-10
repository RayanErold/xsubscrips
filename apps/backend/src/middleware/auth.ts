import { Request, Response, NextFunction } from "express";
import { supabase } from "../lib/supabase";
import { logger } from "../lib/logger";

// In-memory cache for auth results to reduce latency
// Token -> { user, expiresAt }
const authCache = new Map<string, { user: any; expiresAt: number }>();
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

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

    // Check cache first
    const cached = authCache.get(token);
    if (cached && cached.expiresAt > Date.now()) {
      req.user = cached.user;
      return next();
    }

    // Verify the token with Supabase
    const { data: { user }, error } = await supabase.auth.getUser(token);

    if (error || !user) {
      return res.status(401).json({ error: "Unauthorized: Invalid token" });
    }

    const userData = {
      id: user.id,
      email: user.email,
    };

    // Cache the result
    authCache.set(token, {
      user: userData,
      expiresAt: Date.now() + CACHE_TTL,
    });

    // Cleanup cache periodically
    if (authCache.size > 1000) {
      const now = Date.now();
      for (const [key, val] of authCache.entries()) {
        if (val.expiresAt < now) authCache.delete(key);
      }
    }

    // Attach user to the request object
    req.user = userData;

    next();
  } catch (error) {
    logger.error({ error }, "Auth middleware error");
    res.status(500).json({ error: "Internal server error during authentication" });
  }
};
