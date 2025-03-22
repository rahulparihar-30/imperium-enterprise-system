import express from "express";
import { register, login, requestPasswordReset, resetPassword, updateProfile } from "../controllers/authController.js";
import { authenticate } from "../../middleware/auth.js";

const authRouter = express.Router();

authRouter.post("/register", register);
authRouter.post("/login", login);
authRouter.post("/forgot-password", requestPasswordReset);
authRouter.post("/reset-password", resetPassword);
authRouter.put("/profile", authenticate, updateProfile);

export default authRouter;
