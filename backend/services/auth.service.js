import studentRepository from "../repositories/student.repository.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({
  path: path.join(__dirname, "../../.env"),
});

const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN;

class AuthService {
  async login(email, password) {
    try {
      const student = await studentRepository.findByEmail(email);
      if (!student || student.is_deleted) {
        return null;
      }

      const isMatch = await bcrypt.compare(password, student.Password);

      if (!isMatch) {
        return null;
      }
      const accessToken = jwt.sign(
        {
          id: student.StudentId,
          email: student.Email,
          fullname: student.FullName,
        },
        JWT_SECRET,
        { expiresIn: JWT_EXPIRES_IN || "300m" }
      );

      return accessToken;
    } catch (error) {
      console.error("Error in AuthService.login:", error.message);
      throw error;
    }
  }
  test = async () => {
    const checkLogin = await this.login("q@gmail.com", "123456");
  
    if (checkLogin) {
      console.log("Đăng nhập thành công, token:", checkLogin);
    } else {
      console.log("Đăng nhập thất bại");
    }
  };
   
}

const authService = new AuthService();
authService.test();

export default new AuthService();