import { Router } from "express";
import { registerController, loginController, getMeController } from "./controller";
import { validate } from "../../lib/validate";
import { RegisterSchema, LoginSchema } from "../../lib/schemas";
import { authMiddleware } from "./middleware";

const router = Router();

router.post("/register", validate({ body: RegisterSchema }), registerController);
router.post("/login", validate({ body: LoginSchema }), loginController);
router.get("/me", authMiddleware, getMeController);

export default router;