import studentRepository from "../repositories/student.repository.js";
import examService from "./exam.service.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import path from "path";
import bcrypt from "bcrypt";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({
  path: path.join(__dirname, "../../.env"),
});

const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN;

class AuthService {
    async loginExam(examCode,email, password) {
        try {
          const exam = await examService.getExamByExamCode(examCode);
          if(exam.IsActive === false){
            console.log("Bài thi chưa được mở");
            return null;
          }
          const student = await studentRepository.findByEmail(email);
          if (!student) {
            return null;
          }
          const isMatch = await bcrypt.compare(password, student.Password);
      
          if (!isMatch) {
            console.log("Sai mật khẩu");
            return null;
          }
      
          const accessToken = jwt.sign(
            {
              id: student.StudentId,
              examId: exam.ExamId,
              email: student.Email,
              username: student.FullName,
            },
            JWT_SECRET,
            { expiresIn: JWT_EXPIRES_IN || "300m" }
          );
      console.log("Đăng nhập thành công, accessToken:", accessToken);
          return accessToken;
        } catch (error) {
          console.error("Error in AuthService.login:", error.message);
          throw error;
        }

    }


   
}


export default new AuthService();