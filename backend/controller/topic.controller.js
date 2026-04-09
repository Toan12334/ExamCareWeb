import topicRepository from "../repositories/topic.repository.js"
import topicService from "../services/topic.service.js"

class TopicController {

  async getTopics(req, res) {
    try {
      const topics = await topicService.getTopics()
      res.json(topics)
    } catch (error) {
      res.status(500).json({ message: error.message })
    }
  }

  async getTopic(req, res) {
    try {
      const { id } = req.params
      const topic = await topicService.getTopic(id)

      res.json(topic)
    } catch (error) {
      res.status(404).json({ message: error.message })
    }
  }

  async createTopic(req, res) {
    try {
      const topic = await topicService.createTopic(req.body)

      res.status(201).json(topic)
    } catch (error) {
      res.status(400).json({ message: error.message })
    }
  }

  async updateTopic(req, res) {
    try {
      const { id } = req.params
      const topic = await topicService.updateTopic(id, req.body)

      res.json(topic)
    } catch (error) {
      res.status(400).json({ message: error.message })
    }
  }

  async deleteTopic(req, res) {
    try {
      const { id } = req.params

      await topicService.deleteTopic(id)

      res.json({
        message: "Topic deleted successfully"
      })
    } catch (error) {
      res.status(400).json({ message: error.message })
    }
  }

  async getTopicsWithQuestionCount(req, res) {
    try {
      const data = await topicService.getTopicsWithQuestionCount()
      res.json(data)
    } catch (error) {
      res.status(500).json({ message: error.message })
    }
  }

 async searchTopicByName(req, res) {
    const { keyword } = req.query
    const topics = await topicService.searchTopics(keyword)
    res.json(topics)
  }

  

}

export default new TopicController()