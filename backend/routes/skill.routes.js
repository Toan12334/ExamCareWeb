import express from "express"
import skillController from "../controller/skill.controller.js"

const router = express.Router()
router.get("/overview", (req, res) => skillController.getSkillsOverview(req, res))
router.get("/", (req, res) => skillController.getAllSkills(req, res))
router.get("/search/filter", (req, res) => skillController.searchAndFilter(req, res))
router.get("/:id", (req, res) => skillController.getSkill(req, res))
router.post("/", (req, res) => skillController.createSkill(req, res))
router.put("/:id", (req, res) => skillController.updateSkill(req, res))
router.delete("/:id", (req, res) => skillController.deleteSkill(req, res))
export default router   