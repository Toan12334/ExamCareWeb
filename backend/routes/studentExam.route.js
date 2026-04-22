    import express from "express";
    import studentExamController from "../controller/studentExam.controller.js";
    import authMiddleware from "../middlewares/authMiddleware.js";
    const router = express.Router();
    router.get("/", studentExamController.getStudentExamList);
    router.get("/detail/:studentId/:studentExamId", studentExamController.getStudentExamDetailFromAI);
    router.post("/start-exam",authMiddleware,studentExamController.startExam);
    router.post("/submit-attempt", studentExamController.submitAttempt);
    export default router;