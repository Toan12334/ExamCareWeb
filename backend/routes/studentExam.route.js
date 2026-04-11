    import express from "express";
    import studentExamController from "../controller/studentExam.controller.js";

    const router = express.Router();
    router.get("/student-exams", studentExamController.getStudentExamList);
    router.post("/start-exam",studentExamController.startExam);
    router.post("/submit-attempt", studentExamController.submitAttempt);
    export default router;