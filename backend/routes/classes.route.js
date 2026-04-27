import express from "express";
import classController from "../controller/calsses.controller.js";

const router = express.Router();


router.get("/", classController.getAllClasses);
router.get("/:id", classController.getClassById);
router.put("/:id", classController.updateClass);
router.delete("/:id", classController.deleteClass);
router.post("/", classController.createClass);

export default router;