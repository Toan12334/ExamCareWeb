import { Routes, Route } from "react-router-dom"
import { ROUTES } from "../constants/routes"
import TopicPage from "../pages/question-bank/TopicPage"
import SkillPage from "../pages/question-bank/SkillPage"
import DifficultyPage from "../pages/question-bank/DifficultyPage"
import QuestionPage from "../pages/question-bank/QuestionPage"
import { StudentManagePage } from "../pages/StudentManagePage"
import Layout from "../layouts/Layout"
import ExamManagePage from "../pages/exam/ExamManagePage"
import QuestionForm from "../components/form/question_form/QuestionForm"
import ExamBuilderRedesign from "../components/form/exam_question_form/ExamQuestionForm"
import StudentExamPage from "../pages/StudentExamPage"
import HomePage from "../pages/HomePage"
export default function AppRouter() {
    return (
        <Routes>
            <Route path={ROUTES.HOME} element={<HomePage />} />
            <Route element={<Layout />}>
                <Route path={ROUTES.QUESTION_BANK.TOPICS} element={<TopicPage />} />
                <Route path={ROUTES.QUESTION_BANK.SKILLS} element={<SkillPage />} />
                <Route path={ROUTES.QUESTION_BANK.DIFFICULTIES} element={<DifficultyPage />} />
                <Route path={ROUTES.QUESTION_BANK.QUESTIONS} element={<QuestionPage />} />
                <Route path={ROUTES.QUESTION_BANK.CREATEQUESTION} element={<QuestionForm/>}/>
                <Route path={ROUTES.QUESTION_BANK.EDITQUESTION} element={<QuestionForm/>}/>
                <Route path={ROUTES.EXAM_MANAGE.EXAM_PAPER} element={<ExamManagePage />} />
                <Route path={ROUTES.EXAM_MANAGE.CREATE_EXAM} element={<ExamBuilderRedesign />} />
                <Route path={ROUTES.EXAM_MANAGE.EDIT_EXAM} element={<ExamBuilderRedesign />} />
                <Route path={ROUTES.EXAM_MANAGE.STUDENT_EXAM} element={<StudentExamPage />} />
                <Route path={ROUTES.USER_MANAGER.MANAGER} element={<StudentManagePage />} />

            </Route>
        </Routes>
    )
}