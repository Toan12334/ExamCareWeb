import express from "express"
import topicController from "../controller/topic.controller.js"

const router = express.Router()

router.get("/search", topicController.searchTopicByName)
router.get("/count", topicController.getTopicsWithQuestionCount)

router.get("/", topicController.getTopics)

router.get("/:id", topicController.getTopic)

router.post("/", topicController.createTopic)

router.put("/:id", topicController.updateTopic)

router.delete("/:id", topicController.deleteTopic)

export default router