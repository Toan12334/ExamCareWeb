import express from "express"
import questionController from "../controller/question.controller.js"

const router = express.Router()
router.get("/", questionController.getQuestions)
router.post("/",questionController.createQuestion)
router.get("/:id", questionController.findQuestionById)
router.put("/:id",questionController.updateQuestionById)
router.delete("/:id",questionController.handleDeleteQuestion)
router.get("/:id/analytics", questionController.getQuestionAnalytics);
export default router