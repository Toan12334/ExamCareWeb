import examRepository from "../repositories/exam.respository.js";

class ExamService {


  async getAllExams(queryParams = {}) {
    try {
      const page = Number(queryParams.page) || 1;
      const limit = Number(queryParams.limit) || 10;
      const search = queryParams.search?.trim() || "";

      if (page <= 0) {
        throw new Error("Page must be greater than 0");
      }

      if (limit <= 0) {
        throw new Error("Limit must be greater than 0");
      }

      const exams = await examRepository.getAllExams({
        page,
        limit,
        search,
      });

      return exams;
    } catch (error) {
      console.error("Error in ExamService.getAllExams:", error.message);
      throw error;
    }
  }

  async getExamById(examId) {
    try {
      if (!examId) throw new Error("Exam ID is required");

      const exam = await examRepository.getExamById(examId);

      if (!exam) {
        throw new Error(`Exam with ID ${examId} not found`);
      }

      return exam;
    } catch (error) {
      console.error("Error in ExamService.getExamById:", error.message);
      throw error;
    }
  }

  async updateExamWithQuestions(examId, payload) {
    if (!examId) {
      throw new Error("Thiếu examId");
    }
  
    if (!payload.examName) {
      throw new Error("Thiếu examName");
    }
  
    if (!payload.duration) {
      throw new Error("Thiếu duration");
    }
  
    if (!Array.isArray(payload.questions)) {
      throw new Error("questions không hợp lệ");
    }
  
    return await examRepository.updateExamWithQuestions(examId, {
      examName: payload.examName,
      duration: Number(payload.duration),
      questions: payload.questions,
    });
  }

  
  async deleteExam(examId) {
    try {
      if (!examId) throw new Error("Exam ID is required");

      const existingExam = await examRepository.getExamById(examId);
      if (!existingExam) {
        throw new Error(`Cannot delete: Exam with ID ${examId} not found`);
      }

      const deletedExam = await examRepository.deleteExam(examId);
      return deletedExam;
    } catch (error) {
      console.error("Error in ExamService.deleteExam:", error.message);
      throw error;
    }
  }


  async createExam(examData) {
    try {
      const { examName, duration, questions } = examData;
  
      if (!examName || !String(examName).trim()) {
        throw new Error("ExamName is required");
      }
  
      if (Number(duration) <= 0) {
        throw new Error("Duration must be greater than 0");
      }
  
      if (!Array.isArray(questions) || questions.length === 0) {
        throw new Error("Questions are required");
      }
  
      const newExam = await examRepository.createExamWithQuestions({
        examName: String(examName).trim(),
        duration: Number(duration),
        questions,
      });
  
      return newExam;
    } catch (error) {
      console.error("Error in ExamService.createExam:", error.message);
      throw error;
    }
  }


  async getExamDetail(examId) {
    if (!examId || Number(examId) <= 0) {
      throw new Error("examId không hợp lệ");
    }

    const examDetail = await examRepository.getExamDetail(examId);

    if (!examDetail) {
      throw new Error("Không tìm thấy chi tiết bài thi");
    }

    return examDetail;
  }


  async updateExamStatus(examId, isActive) {
    try {
      const exam = await examRepository.getExamById(examId);
  
      if (!exam) {
        throw new Error("Không tìm thấy bài thi");
      }
  
      const updatedExam = await examRepository.updateExamStatus(examId, isActive);
  
      return updatedExam;
    } catch (error) {
      console.error("Error in ExamService.updateExamStatus:", error);
      throw error;
    }
  }

  async getExamByExamCode(examCode) {
    try {
      if (!examCode || String(examCode).trim() === "") {
        throw new Error("Exam code is required");
      }
  
      const exam = await examRepository.getExamByExamCode(String(examCode).trim());
  
      if (!exam) {
        throw new Error("No exam found with the provided code");
      }
  
      return exam;
    } catch (error) {
      console.error("Error in ExamService.getExamIdByExamCode:", error);
      throw error;
    }
  }

   async ranDomUpdateExamCode(examId) {
    try {
      const exam = await examRepository.getExamById(examId);
  
      if (!exam) {
        throw new Error("Không tìm thấy bài thi");
      }
  
      const updatedExam = await examRepository.ranDomAndUpAndUtateExamCode(examId);
      return updatedExam;
    } catch (error) {
      console.error("Error in ExamService.ranDomUpdateExamCode:", error);
      throw error;
    }
}
}

export default new ExamService();