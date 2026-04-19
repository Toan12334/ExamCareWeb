import express from "express"
import cors from "cors"
import path from "path"
import { fileURLToPath } from 'url'
import studentRoutes from "./routes/student.routes.js"
import topicRoutes from "./routes/topic.routes.js"
import skillRoutes from "./routes/skill.routes.js"
import questionRoutes from "./routes/question.route.js"
import questionTypeRoutes from "./routes/questionType.route.js"
import difficultyLevelRoutes from "./routes/difficultyLevel.route.js"
import upLoadRoutes from "./routes/upload.route.js"
import routeExam from "./routes/exam.route.js"
import studentExamRoute from "./routes/studentExam.route.js"

// --- FIX LỖI BIGINT ---
BigInt.prototype.toJSON = function () {
  return this.toString(); 
};

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express()

// 👇👇👇 CẤU HÌNH CORS MỚI 👇👇👇
const allowedOrigins = [
  'http://localhost:5173', // Cổng mặc định của Vite
  'http://localhost:3000', // Cổng mặc định của React thuần
  'https://web-cua-ban.onrender.com' // Thay bằng URL thật của bạn trên Render
];

app.use(cors({
  origin: function (origin, callback) {
    // Cho phép các yêu cầu không có origin (như Postman) hoặc nằm trong danh sách trắng
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Chặn bởi CORS: Origin này không được phép!'));
    }
  },
  credentials: true // Nếu bạn có dùng Cookie hay Token ở Header
}));
// 👆👆👆 ====================== 👆👆👆

app.use(express.json())

// --- CÁC ROUTE API ---
app.use("/api/students", studentRoutes)
app.use("/api/topics", topicRoutes)
app.use("/api/skills", skillRoutes)
app.use("/api/questions", questionRoutes)
app.use("/api/question-type", questionTypeRoutes)
app.use("/api/difficulty-level", difficultyLevelRoutes)
app.use("/api/upload", upLoadRoutes)
app.use("/api/exams", routeExam)
app.use("/api/student-exam", studentExamRoute)

// --- PHỤC VỤ FRONTEND ---
app.use(express.static(path.join(__dirname, "public")));

// Route này giúp Render vẫn chạy được Frontend khi deploy
app.get(/^\/(?!api).*/, (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

export default app