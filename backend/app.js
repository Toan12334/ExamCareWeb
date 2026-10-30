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
import routeAuth from "./routes/auth.route.js"
import calssRoutes from "./routes/classes.route.js"

// --- FIX LỖI BIGINT ---
BigInt.prototype.toJSON = function () {
  return this.toString(); 
};

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express()

// --- CẤU HÌNH CORS ---
const clientUrl = process.env.CLIENT_URL;
const allowedOrigins = [
  'http://localhost:5173', // Vite dev server
  'http://localhost:3000', // React dev server
  ...(clientUrl ? [clientUrl.replace(/\/$/, '')] : []),
];

app.use(cors({
  origin: function (origin, callback) {
    // Cho phép các yêu cầu không có origin (Postman, server-to-server, curl)
    if (!origin) return callback(null, true);

    try {
      const hostname = new URL(origin).hostname;
      const isAllowed =
        allowedOrigins.includes(origin) ||
        hostname.endsWith('.vercel.app') ||
        hostname === 'localhost';

      if (isAllowed) {
        callback(null, true);
      } else {
        callback(new Error(`Chặn bởi CORS: Origin ${origin} không được phép!`));
      }
    } catch {
      callback(new Error('Chặn bởi CORS: Origin không hợp lệ!'));
    }
  },
  credentials: true
}));

app.use(express.json())

// --- HEALTH CHECK ---
app.get("/", (req, res) => {
  res.json({ status: "ok", message: "ExamCare Backend API is running!" });
});

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
app.use("/api/auth", routeAuth)
app.use("/api/classes", calssRoutes)

export default app
