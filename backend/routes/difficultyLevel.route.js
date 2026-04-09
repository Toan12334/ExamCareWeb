// routes/difficultyLevel.route.js
import express from "express";
import difficultyLevelController from "../controller/difficultyLevel.controller.js";

const router = express.Router();

router.get("/", difficultyLevelController.getAll);
router.get("/:id", difficultyLevelController.getById);
router.post("/", difficultyLevelController.create);
router.put("/:id", difficultyLevelController.update);
router.delete("/:id", difficultyLevelController.delete);

export default router;