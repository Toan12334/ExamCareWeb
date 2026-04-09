import skillService from "../services/skill.service.js"

class SkillController {

  async getSkillsOverview(req, res) {
    try {
      const { page, pageSize } = req.query

      const result = await skillService.getSkillsOverview({
        page,
        pageSize
      })

      return res.json(result)
    } catch (error) {
      console.error("Get Skills Overview Error:", error)
      return res.status(500).json({
        message: "Internal server error"
      })
    }
  }



  async searchAndFilter(req, res) {
    try {
      const { keyword, topicId, page, pageSize } = req.query

      const result = await skillService.searchAndFilter({
        keyword,
        topicId,
        page,
        pageSize
      })

      res.json(result)
    } catch (error) {
      res.status(500).json({ message: error.message })
    }
  }


  async getAllSkills(req, res) {
    try {
      const skills = await skillService.getAllSkills()
      res.json(skills)
    } catch (error) {
      res.status(500).json({ message: error.message })
    }
  }

  
  async getSkill(req, res) {
    try {
      const { id } = req.params

      const skill = await skillService.getSkill(id)

      res.json(skill)
    } catch (error) {
      res.status(404).json({ message: error.message })
    }
  }


  async createSkill(req, res) {
    try {
      const skill = await skillService.createSkill(req.body)

      res.status(201).json(skill)
    } catch (error) {
      res.status(400).json({ message: error.message })
    }
  }

  async updateSkill(req, res) {
    try {
      const { id } = req.params

      const skill = await skillService.updateSkill(id, req.body)

      res.json(skill)
    } catch (error) {
      res.status(400).json({ message: error.message })
    }
  }

  async deleteSkill(req, res) {
    try {
      const { id } = req.params

      await skillService.deleteSkill(id)

      res.json({ message: "Delete success" })
    } catch (error) {
      res.status(400).json({ message: error.message })
    }
  }

}

export default new SkillController()