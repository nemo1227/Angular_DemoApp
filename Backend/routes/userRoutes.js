import { Router } from "express";
const router = Router();
import { register, login, forgotPassword, resetPassword } from "../controllers/userController.js";

router.post("/register", register);
router.post("/login", login);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);

export default router;
