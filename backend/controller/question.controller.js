import questionService from "../services/question.service.js"

class QuestionController {
  async getQuestions(req, res) {
    try {
      const {
        keyword,
        topicId,
        difficultyId,
        typeId,
        skillId,
        page,
        pageSize
      } = req.query

      const result = await questionService.getQuestions({
        keyword,
        topicId,
        difficultyId,
        typeId,
        skillId,
        page,
        pageSize
      })

      return res.status(200).json({
        success: true,
        message: "Get questions successfully",
        data: result
      })

    } catch (error) {
      console.error("Error getQuestions:", error)

      return res.status(500).json({
        success: false,
        message: "Internal server error"
      })
    }
  }

  //create 
  async createQuestion(req, res) {
    try {
      const body = req.body

      const result = await questionService.createQuestion(body)

      return res.status(201).json({
        success: true,
        message: result.message,
        data: {
          questionId: result.questionId
        }
      })

    } catch (error) {
      console.error("Error createQuestion:", error)

      return res.status(400).json({
        success: false,
        message: error.message || "Create question failed"
      })
    }
  }


  async findQuestionById(req, res) {
    try {
      const { id } = req.params;
      const question = await questionService.findQuestionById(id);
      return res.status(200).json({
        success: true,
        message: 'Get question successfully',
        data: question
      });
    } catch (error) {
      return res.status(400).json({
        success: false,
        message: error.message
      });
    }
  }

  async updateQuestionById(req, res) {
    try {
      const { id } = req.params;
      const result = await questionService.updateQuestionById(id, req.body);

      return res.status(200).json({
        success: true,
        message: 'Update question successfully',
        data: result
      });
    } catch (error) {
      return res.status(400).json({
        success: false,
        message: error.message
      });
    }
  }


  async handleDeleteQuestion(req, res) {
    const { id } = req.params;  // Giả sử ID được truyền qua params

    try {
      const result = await questionService.deleteQuestionById(id);
      res.status(200).json(result); // Trả về thông tin câu hỏi đã xóa
    } catch (error) {
      res.status(500).json({ message: error.message });
    }

  }

  //get question anaLyst
  async getQuestionAnalytics(req, res) {
    try {
      const { id } = req.params;

      const result = await questionService.getQuestionAnalytics(id);

      return res.status(200).json({
        success: true,
        data: result
      });

    } catch (error) {
      return res.status(400).json({
        success: false,
        message: error.message || "Internal server error"
      });
    }
  }

}



export default new QuestionController()