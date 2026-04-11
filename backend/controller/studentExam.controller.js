import studentExamService from "../services/studentExam.service.js";
class StudentExamController {


  async getStudentExamList(req, res) {
    try {
      const result = await studentExamService.getStudentExamList(req.query);

      return res.status(200).json({
        success: true,
        message: "Lấy danh sách bài thi thành công",
        ...result
      });
    } catch (error) {
      console.error("getStudentExamList error:", error);

      return res.status(500).json({
        success: false,
        message: "Lỗi server",
        error: error.message
      });
    }
  }

    startExam = async (req, res) => {
      try {
        const { studentId, examId } = req.body;
  
        const data = await studentExamService.startExam(studentId, examId);
  
        return res.status(200).json({
          success: true,
          message: "Bắt đầu bài thi thành công.",
          data,
        });
      } catch (error) {
        return res.status(400).json({
          success: false,
          message: error.message || "Đã xảy ra lỗi.",
        });
      }
    };

    submitAttempt = async (req, res) => {
      try {
        const attempts = req.body; // nhận List<AttemptQuestion>
      
        console.log("📥 Received attempts:", attempts.length);
        
        if (!Array.isArray(attempts)) {
          return res.status(400).json({
            success: false,
            message: "Dữ liệu phải là mảng AttemptQuestion",
          });
        }
  
        // Gọi service xử lý
     const result = await studentExamService.submitAttempt(attempts);      
        return res.status(200).json({
          success: true,
          message: "Nộp bài thành công",
          data: result,
        });
  
      } catch (error) {
        console.error("❌ submitAttempt error:", error);
        return res.status(500).json({
          success: false,
          message: error.message || "Đã xảy ra lỗi server",
        });
      }
    };
  }

export default new StudentExamController();