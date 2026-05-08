import { Router, type IRouter } from "express";
import healthRouter from "./health";
import subscriptionsRouter from "./subscriptions";
import aiRouter from "./ai";
import adminRouter from "./admin";
import { requireAuth } from "../middleware/auth";

const router: IRouter = Router();

router.use(healthRouter);
router.use(adminRouter);

// Protect all subscription, AI, and dashboard routes
router.use(requireAuth);
router.use(subscriptionsRouter);
router.use(aiRouter);

export default router;
