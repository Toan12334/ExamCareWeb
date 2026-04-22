import authController from  "../controller/auth.controller.js";
import authMiddleware from "../middlewares/authMiddleware.js";
import express from "express";

const router = express.Router();
router.post("/login-exam", authController.loginExamController);

export default router;