import questionRepository from "../repositories/question.respository.js"

class QuestionService {

  async getQuestions(query) {
    const {
      keyword,
      topicId,
      difficultyId,
      typeId,
      skillId,
      page = 1,
      pageSize = 10
    } = query
    const safePage = Number(page) > 0 ? Number(page) : 1
    const safePageSize = Number(pageSize) > 0 ? Number(pageSize) : 10

    const result = await questionRepository.findAll({
      keyword,
      topicId,
      difficultyId,
      typeId,
      skillId,
      page: safePage,
      pageSize: safePageSize
    })

    return result
  }



  // ================= CREATE QUESTION =================
  // QuestionService.js
  async createQuestion(body) {
    const {
      TopicId,
      DifficultyId,
      TypeId,
      Content,
      SkillIds = [],
      Images = [],
      Options = [],
      TrueFalseStatements = [],
      ShortAnswer // Hứng từ Postman/Frontend
    } = body;

    // 1. VALIDATE CHUNG
    if (!TopicId || !DifficultyId || !TypeId || !Content) {
      throw new Error("Missing required fields: TopicId, DifficultyId, TypeId, or Content");
    }

    // 2. VALIDATE THEO LOẠI
    if (TypeId === 1) { // Trắc nghiệm
      if (!Options || Options.length < 2) throw new Error("Multiple choice must have at least 2 options");
      if (!Options.some(o => o.isCorrect)) throw new Error("Must have at least 1 correct answer");
    }
    else if (TypeId === 2) { // Đúng/Sai
      if (!TrueFalseStatements || TrueFalseStatements.length === 0) throw new Error("True/False must have statements");
    }
    else if (TypeId === 3) { // Trả lời ngắn
      // Check kỹ tránh lỗi "Short answer is required"
      if (ShortAnswer === undefined || ShortAnswer === null || String(ShortAnswer).trim() === "") {
        throw new Error("Short answer is required");
      }
    }

    // 3. GỌI REPOSITORY (Map tên biến sang chuẩn Database)
    const questionId = await questionRepository.create({
      TopicId: Number(TopicId),
      DifficultyId: Number(DifficultyId),
      TypeId: Number(TypeId),
      QuestionContent: Content,
      SkillIds,
      Images,
      Options,
      TrueFalseStatements,
      CorrectAnswer: ShortAnswer // Đổi tên ở đây để Repo dùng luôn
    });

    return {
      success: true,
      message: "Create question successfully",
      questionId
    };
  }


  async findQuestionById(id) {
    if (!id || isNaN(Number(id))) {
      throw new Error('Invalid question id');
    }
    const question = await questionRepository.findQuestionById(Number(id));
    if (!question) {
      throw new Error('Question not found');
    }
    return question;
  }


  async updateQuestionById(id, data) {
    const questionId = Number(id);

    if (!id || isNaN(questionId) || questionId <= 0) {
      throw new Error('Invalid question id');
    }

    if (!data || typeof data !== 'object') {
      throw new Error('Invalid request data');
    }

    if (!data.TopicId || !data.DifficultyId || !data.TypeId || !data.QuestionContent?.trim()) {
      throw new Error('Missing required fields');
    }

    if (![1, 2, 3].includes(Number(data.TypeId))) {
      throw new Error('Invalid question type');
    }

    if (Number(data.TypeId) === 1) {
      if (!Array.isArray(data.Options) || data.Options.length === 0) {
        throw new Error('Options are required for multiple choice questions');
      }
    }

    if (Number(data.TypeId) === 2) {
      if (!Array.isArray(data.TrueFalseStatements) || data.TrueFalseStatements.length === 0) {
        throw new Error('TrueFalseStatements are required for true/false questions');
      }
    }

    if (Number(data.TypeId) === 3) {
      if (!String(data.CorrectAnswer ?? '').trim()) {
        throw new Error('ShortAnswer is required for short answer questions');
      }
    }

    const updatedQuestion = await questionRepository.updateQuestionById(questionId, data);

    if (!updatedQuestion) {
      throw new Error('Question not found');
    }

    return updatedQuestion;
  }



   // Xóa câu hỏi theo ID
   async deleteQuestionById(id) {
    // Kiểm tra tính hợp lệ của ID
    const questionId = Number(id);
    if (!id || isNaN(questionId) || questionId <= 0) {
      throw new Error('Invalid question id');
    }

    // Tìm câu hỏi để chắc chắn rằng câu hỏi tồn tại trước khi xóa
    const question = await questionRepository.findQuestionById(questionId);
    if (!question) {
      throw new Error('Question not found');
    }

    // Gọi repository để xóa câu hỏi và các liên kết liên quan
    const deletedQuestion = await questionRepository.deleteQuestionById(questionId);

    if (!deletedQuestion) {
      throw new Error('Failed to delete question');
    }

    // Trả về kết quả sau khi xóa thành công
    return {
      success: true,
      message: 'Question deleted successfully',
      questionId: deletedQuestion.QuestionId
    };
  }


  async getQuestionAnalytics(id) {
    const questionId = Number(id);
  
    if (!id || isNaN(questionId) || questionId <= 0) {
      throw new Error("Invalid question id");
    }
  
    const analytics = await questionRepository.getQuestionAnalytics(questionId);
  
    if (!analytics) {
      throw new Error("Question not found");
    }
  
    return analytics;
  }
  
}

export default new QuestionService()