import skillRepository from "../repositories/skill.repository.js"



class SkillService {
  async getSkillsOverview({ page = 1, pageSize = 10 }) {

    page = Number(page) || 1
    pageSize = Number(pageSize) || 10

    if (page < 1) page = 1
    if (pageSize < 1) pageSize = 10

    const result = await skillRepository.getSkillsOverview({ page, pageSize })

    return {
      data: result.data.map(item => ({
        ...item,
        AvgAccuracy: Number(item.AvgAccuracy)
      })),
      total: result.total,
      page,
      pageSize,
      totalPages: Math.ceil(result.total / pageSize)
    }
  }

  async getAllSkills() {
    return await skillRepository.getAll()
  }

  async getSkill(id) {
    if (!id) {
      throw new Error("SkillId is required")
    }

    const skill = await skillRepository.getById(id)

    if (!skill) {
      throw new Error("Skill not found")
    }

    return skill
  }


  async createSkill(data) {

    if (!data.SkillName || data.SkillName.trim() === "") {
      throw new Error("Skill name is required")
    }

    if (!data.TopicId) {
      throw new Error("TopicId is required")
    }

    return await skillRepository.create({
      SkillName: data.SkillName.trim(),
      TopicId: data.TopicId
    })
  }


  async updateSkill(id, data) {

    if (!id) {
      throw new Error("SkillId is required")
    }

    const existing = await skillRepository.getById(id)

    if (!existing) {
      throw new Error("Skill not found")
    }

    if (!data.SkillName || data.SkillName.trim() === "") {
      throw new Error("Skill name is required")
    }

    if (!data.TopicId) {
      throw new Error("TopicId is required")
    }

    return await skillRepository.update(id, {
      SkillName: data.SkillName.trim(),
      TopicId: data.TopicId
    })
  }


  async deleteSkill(id) {

    if (!id) {
      throw new Error("SkillId is required")
    }

    const existing = await skillRepository.getById(id)

    if (!existing) {
      throw new Error("Skill not found")
    }

    return await skillRepository.delete(id)
  }


  async searchSkills(keyword) {

    if (!keyword || keyword.trim() === "") {
      return await this.getAllSkills()
    }

    return await skillRepository.searchByName(keyword.trim())
  }

 
  async filterSkillsByTopic(topicId) {

    if (!topicId) {
      throw new Error("TopicId is required")
    }

    return await skillRepository.filterByTopic(topicId)
  }

  async searchAndFilter(query) {
    let { keyword = "", topicId, page = 1, pageSize = 10 } = query
  
    page = Number(page) || 1
    pageSize = Number(pageSize) || 10
  
    if (page < 1) page = 1
    if (pageSize < 1) pageSize = 10
  
    const result = await skillRepository.searchAndFilter({
      keyword: keyword?.trim(),
      topicId,
      page,
      pageSize
    })
  
    return {
      data: result.data.map(item => ({
        ...item,
        AvgAccuracy: Number(item.AvgAccuracy) 
      })),
      total: result.total,
      page,
      pageSize,
      totalPages: Math.ceil(result.total / pageSize)
    }
  }
}

export default new SkillService()