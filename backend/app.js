import express from "express"
import cors from "cors"
import path from "path" // 1. Thêm import path
import { fileURLToPath } from 'url' // 2. Thêm cái này để lấy đường dẫn
import studentRoutes from "./routes/student.routes.js"
import topicRoutes from "./routes/topic.routes.js"
import skillRoutes from "./routes/skill.routes.js"
import questionRoutes from "./routes/question.route.js"
import questionTypeRoutes from "./routes/questionType.route.js"
import difficultyLevelRoutes from "./routes/difficultyLevel.route.js"
import upLoadRoutes from "./routes/upload.route.js"
import routeExam from "./routes/exam.route.js"
import studentExamRoute from  "./routes/studentExam.route.js"

// 👇👇👇 THÊM FIX LỖI BIGINT Ở ĐÂY 👇👇👇
BigInt.prototype.toJSON = function () {
  return this.toString(); 
};
// 👆👆👆 ============================== 👆👆👆

// 3. Khai báo __dirname (vì bạn dùng ES Modules - import)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express()

app.use(cors()) 
app.use(express.json())

// --- PHẦN API GIỮ NGUYÊN ---
app.use("/api/students", studentRoutes)
app.use("/api/topics", topicRoutes)
app.use("/api/skills", skillRoutes)
app.use("/api/questions",questionRoutes)
app.use("/api/question-type",questionTypeRoutes)
app.use("/api/difficulty-level",difficultyLevelRoutes)
app.use("/api/upload",upLoadRoutes)
app.use("/api/exams",routeExam)
app.use("/api/student-exam",studentExamRoute)

// --- PHẦN QUAN TRỌNG ĐỂ HIỆN REACT ---

// 4. Phục vụ các file tĩnh từ thư mục public (nơi bạn đã dán code React)
app.use(express.static(path.join(__dirname, "public")));

// 5. XÓA HOẶC ĐỔI TÊN app.get("/") CŨ:
// Thay vì res.send("API is running..."), hãy để nó phục vụ React
app.get(/^\/(?!api).*/, (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

export default app