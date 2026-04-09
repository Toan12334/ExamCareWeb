// routes/questionType.route.js
import express from "express";
import questionTypeController from "../controller/questionType.controller.js";

const router = express.Router();

router.get("/", questionTypeController.getAll);
router.get("/:id", questionTypeController.getById);
router.post("/", questionTypeController.create);
router.put("/:id", questionTypeController.update);
router.delete("/:id", questionTypeController.delete);

export default router;