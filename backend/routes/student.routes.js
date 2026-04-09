import express from "express"
import studentController from "../controller/student.controller.js"

const router = express.Router()

router.get("/", studentController.getStudents)
router.get("/search", studentController.searchStudents)
router.get("/:id", studentController.getStudent)
router.post("/", studentController.createStudent)
router.put("/:id", studentController.updateStudent)
router.patch("/:id", studentController.deleteStudent)


export default router