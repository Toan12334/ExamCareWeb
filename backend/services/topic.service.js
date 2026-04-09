import topicRepository from "../repositories/topic.repository.js"

class TopicService {

  async getTopics() {
    return await topicRepository.getAll()
  }

  async getTopic(id) {
    const topic = await topicRepository.getById(id)

    if (!topic) {
      throw new Error("Topic not found")
    }

    return topic
  }

  async createTopic(data) {

    if (!data.TopicName || data.TopicName.trim() === "") {
      throw new Error("Topic name is required")
    }
  
    const topicName = data.TopicName.trim()
  
    const existedTopic = await topicRepository.getByName(topicName)
  
    if (existedTopic) {
      throw new Error("Topic name already exists")
    }
  
    return await topicRepository.create({
      TopicName: topicName
    })
  }
  async updateTopic(id, data) {

    const topic = await topicRepository.getById(id)
  
    if (!topic) {
      throw new Error("Topic not found")
    }
  
    if (!data.TopicName || data.TopicName.trim() === "") {
      throw new Error("Topic name is required")
    }
  
    const topicName = data.TopicName.trim()
  
    const existedTopic = await topicRepository.getByName(topicName)
  
    if (existedTopic && existedTopic.TopicId !== Number(id)) {
      throw new Error("Topic name already exists")
    }
  
    return await topicRepository.update(id, {
      TopicName: topicName
    })
  }

  async deleteTopic(id) {

    const topic = await topicRepository.getById(id)

    if (!topic) {
      throw new Error("Topic not found")
    }

    return await topicRepository.delete(id)
  }

  async getTopicsWithQuestionCount() {
    const topics = await topicRepository.getTopicsWithQuestionCount()
  
    return topics.map(t => ({
      TopicId: t.TopicId,
      TopicName: t.TopicName,
      QuestionCount: t._count.Questions
    }))
  }

  async searchTopics(keyword) {
    let topics = []
    if (!keyword || keyword.trim() === "") {
      topics = await topicRepository.getTopicsWithQuestionCount()
    } else {
      const cleanKeyword = keyword.trim()
      topics = await topicRepository.searchByName(cleanKeyword)
    }
    return topics.map(t => ({
      TopicId: t.TopicId,
      TopicName: t.TopicName,
      QuestionCount: t._count?.Questions || 0
    }))
  }


}



export default new TopicService()