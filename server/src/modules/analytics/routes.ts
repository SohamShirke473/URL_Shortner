import { Router } from "express";
import { getAnalyticsHandler, getAllAnalyticsHandler } from "./controller";
import { validate } from "../../lib/validate";
import { AnalyticsIdParamSchema } from "../../lib/schemas";

const router = Router();

router.get("/analytics/:id", validate({ params: AnalyticsIdParamSchema }), getAnalyticsHandler);
router.get("/analytics", getAllAnalyticsHandler);

export default router;