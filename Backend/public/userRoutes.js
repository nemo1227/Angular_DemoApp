import { Router } from "express";
const router = Router();
import { register, login, forgotPassword } from "../controllers/userController.js";

router.post("/register", register);
router.post("/login", login);
router.post("/forgot-password", forgotPassword);

export default router;
