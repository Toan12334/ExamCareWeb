import express from "express";
import examController from "../controller/exam.controller.js"; // Adjust the path as needed

const router = express.Router();
router.post("/", examController.createExam);
router.get("/", examController.getAllExams);
router.get("/:id", examController.getExamDetailById);
router.put("/:id", examController.updateExamWithQuestions);
router.delete("/:id", examController.deleteExam);
router.patch("/:id/status", examController.updateExamStatus);
router.patch("/:id/random-code", examController.randomExamCode);
export default router;