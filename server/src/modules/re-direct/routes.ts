import { Router } from "express";
import { redirectHandler } from "./controller"
const router = Router();

router.get("/:shortCode", redirectHandler);


export default router;
