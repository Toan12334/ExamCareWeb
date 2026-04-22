import authService from "../services/auth.service.js";

class AuthController{
    async loginExamController  (req, res) {
        try {
          const { examCode, email, password } = req.body;
      
          const token = await authService.loginExam(examCode, email, password);
      
          if (!token) {
            return res.status(401).json({
              message: "Sai thông tin hoặc bài thi chưa mở",
            });
          }
      
          return res.status(200).json({
            message: "Đăng nhập thành công",
            accessToken: token,
          });
        } catch (error) {
          console.error("LoginExamController error:", error.message);
          return res.status(500).json({
            message: "Server error",
          });
        }
      };
}

export default new AuthController()