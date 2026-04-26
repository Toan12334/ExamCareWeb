import express from "express";
import classController from "../controller/calsses.controller.js";

const router = express.Router();

router.post("/", classController.createClassHandler);
router.get("/", classController.getAllClasses);
router.get("/:id", classController.getClassById);
router.put("/:id", classController.updateClass);
router.delete("/:id", classController.deleteClass);

export default router;