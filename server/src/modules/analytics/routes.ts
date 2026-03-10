import { Router } from "express";
import { getAnalyticsHandler, getAllAnalyticsHandler, triggerSyncHandler } from "./controller";
import { validate } from "../../lib/validate";
import { AnalyticsIdParamSchema } from "../../lib/schemas";

const router = Router();

router.get("/analytics/:id", validate({ params: AnalyticsIdParamSchema }), getAnalyticsHandler);
router.get("/analytics", getAllAnalyticsHandler);
router.post("/analytics/sync", triggerSyncHandler);

export default router;