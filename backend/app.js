import express from "express"
import cors from "cors"
import studentRoutes from "./routes/student.routes.js"
import topicRoutes from "./routes/topic.routes.js"
import skillRoutes from "./routes/skill.routes.js"
import questionRoutes from "./routes/question.route.js"
import questionTypeRoutes from "./routes/questionType.route.js"
import difficultyLevelRoutes from "./routes/difficultyLevel.route.js"
import upLoadRoutes from "./routes/upload.route.js"
import routeExam from "./routes/exam.route.js"
import studentExamRoute from  "./routes/studentExam.route.js"
const app = express()

app.use(cors()) 
app.use(express.json())

app.use("/api/students", studentRoutes)
app.use("/api/topics", topicRoutes)
app.use("/api/skills", skillRoutes)
app.use("/api/questions",questionRoutes)
app.use("/api/question-type",questionTypeRoutes)
app.use("/api/difficulty-level",difficultyLevelRoutes)
app.use("/api/upload",upLoadRoutes)
app.use("/api/exams",routeExam)
app.use("/api/student-exam",studentExamRoute)
app.get("/", (req, res) => {
  res.send("API is running...")
})

export default app