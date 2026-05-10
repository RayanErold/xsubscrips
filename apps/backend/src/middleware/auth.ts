import { Request, Response, NextFunction } from "express";
import { supabase } from "../lib/supabase";
import { logger } from "../lib/logger";

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
    // This is an external API call, but necessary for token validation
    const { data: { user }, error } = await supabase.auth.getUser(token);

    if (error || !user) {
      return res.status(401).json({ error: "Unauthorized: Invalid token" });
    }

    // Attach user to the request object
    req.user = {
      id: user.id,
      email: user.email,
    };

    next();
  } catch (error) {
    logger.error({ error }, "Auth middleware error");
    res.status(500).json({ error: "Internal server error during authentication" });
  }
};
