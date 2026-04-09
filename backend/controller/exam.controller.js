import examService from "../services/exam.service.js";

class ExamController {

  // GET /exams?page=1&limit=10&search=math
  async getAllExams(req, res) {
    try {
      const result = await examService.getAllExams(req.query);

      return res.status(200).json({
        success: true,
        message: "Exams retrieved successfully",
        ...result,
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: error.message || "Failed to retrieve exams",
      });
    }
  }

  // GET /exams/:id
  async getExamById(req, res) {
    try {
      const { id } = req.params;
      const exam = await examService.getExamById(id);

      return res.status(200).json({
        success: true,
        message: "Exam retrieved successfully",
        data: exam,
      });
    } catch (error) {
      if (error.message.includes("not found")) {
        return res.status(404).json({
          success: false,
          message: error.message,
        });
      }

      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  }

  // PUT /exams/:id
  async updateExamWithQuestions(req, res) {
    try {
      const { id } = req.params;

      const result = await examService.updateExamWithQuestions(id, req.body);

      return res.status(200).json({
        success: true,
        message: "Cập nhật đề thi thành công",
        data: result,
      });
    } catch (error) {
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  }

  // DELETE /exams/:id
  async deleteExam(req, res) {
    try {
      const { id } = req.params;

      await examService.deleteExam(id);

      return res.status(200).json({
        success: true,
        message: `Exam with ID ${id} deleted successfully`,
      });
    } catch (error) {
      if (error.message.includes("not found")) {
        return res.status(404).json({
          success: false,
          message: error.message,
        });
      }

      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  }


  async createExam(req, res) {
    try {
      const result = await examService.createExam(req.body);
  
      return res.status(201).json({
        message: "Tạo đề thi thành công",
        data: result,
      });
    } catch (error) {
      console.error("Error in ExamController.createExam:", error.message);
  
      return res.status(400).json({
        message: error.message || "Tạo đề thi thất bại",
      });
    }
  }


  async getExamDetailById(req, res) {
    try {
      const { id } = req.params;
      const result = await examService.getExamDetail(id);

      return res.status(200).json({
        success: true,
        data: result,
      });
    } catch (error) {
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  }


  async updateExamStatus(req, res) {
    try {
      const { id } = req.params;
      const { isActive } = req.body;
  
      if (typeof isActive !== "boolean") {
        return res.status(400).json({
          success: false,
          message: "Trường isActive phải là boolean",
        });
      }
  
      const updatedExam = await examService.updateExamStatus(id, isActive);
  
      return res.status(200).json({
        success: true,
        message: "Cập nhật trạng thái bài thi thành công",
        data: updatedExam,
      });
    } catch (error) {
      console.error("Error in ExamController.updateExamStatus:", error);
  
      return res.status(500).json({
        success: false,
        message: error.message || "Lỗi server",
      });
    }
  }
}

export default new ExamController();