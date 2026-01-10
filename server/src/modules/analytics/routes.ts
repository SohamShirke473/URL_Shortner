import { Router } from "express";
import { getAnalyticsHandler } from "./controller";

const router = Router();

router.get("/analytics/:id", getAnalyticsHandler);

export default router;