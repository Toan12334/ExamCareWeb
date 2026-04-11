import studentExamRepository from "../repositories/studentExam.respository.js";
import attemQuestionRespository from "../repositories/attemQuestion.respository.js";
import questionRespository from "../repositories/question.respository.js";
import questionOptionRepository from "../repositories/questionOption.respository.js";
import trueFalseStatementRepository from "../repositories/trueFalseStatement.repository.js";
import shortAnswerRepository from "../repositories/shortAnswer.repository.js";
import handle from "../utils/handle.js";
import openAIService from "./openAI.service.js";
class StudentExamService {

  formatTimeTotal(seconds) {
    const totalSeconds = Number(seconds) || 0;

    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const secs = totalSeconds % 60;

    if (hours > 0) {
      return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
    }

    return `${String(minutes).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
  }

  async getStudentExamList(query) {
    const result = await studentExamRepository.getStudentExamList(query);

    return {
      data: result.data.map((item) => ({
        StudentExamId: item.StudentExamId,
        FullName: item.FullName,
        ExamName: item.ExamName,
        TimeTotal: this.formatTimeTotal(item.TimeTotal),
        Score: item.Score,
        Status: item.Status,
        CreatedAt: item.CreatedAt,
        UpdatedAt: item.UpdatedAt
      })),
      pagination: result.pagination
    };
  }

  async startExam(studentId, examId) {
    if (!studentId || !examId) {
      throw new Error("studentId và examId là bắt buộc.");
    }

    const studentIdNumber = Number(studentId);
    const examIdNumber = Number(examId);

    if (Number.isNaN(studentIdNumber) || Number.isNaN(examIdNumber)) {
      throw new Error("studentId hoặc examId không hợp lệ.");
    }

    const result = await studentExamRepository.startExam(
      studentIdNumber,
      examIdNumber
    );

    if (!result) {
      throw new Error("Không lấy được dữ liệu bài thi.");
    }

    return result;
  }

  async submitAttempt(attempts) {
    if (!Array.isArray(attempts)) {
      throw new Error("Dữ liệu gửi lên phải là mảng attempts");
    }

    console.log("Processing attempts...");
    console.log("Total:", attempts.length);

    try {
      const result = await attemQuestionRespository.insertManyFull(attempts);

      const grade = await this.gradingAttemptQuestionMathForm(attempts);
      console.log("Grade:", grade);

      const isCorrectUpdates = await this.buildAttemptQuestionCorrectResult(
        attempts,
        result
      );

      await attemQuestionRespository.updateManyResult(isCorrectUpdates);
      console.log("Insert success:", result.length);

      await studentExamRepository.updateScoreAndStatus(attempts[0].StudentExamId,grade,"Submited");
      console.log("submited")
      return {
        success: true,
        total: result.length,
        grade,
        data: result,
      };
    } catch (error) {
      console.error("Submit attempt failed:", error);

      return {
        success: false,
        message: "Insert thất bại",
      };
    }
  }
  async buildAttemptQuestionCorrectResult(attempts = [], insertedAttempts = []) {
    const updates = [];

    for (let i = 0; i < attempts.length; i++) {
      const item = attempts[i];
      const insertedItem = insertedAttempts[i];

      const question = await questionRespository.findQuestionById(item.QuestionId);

      let isCorrect = false;

      switch (question.TypeId) {
        case 1: {
          const studentAnswerOptionLabel = item?.CurrentAnswer?.SelectedOption;

          if (!studentAnswerOptionLabel) {
            isCorrect = false;
            break;
          }

          const correctOption =
            await questionOptionRepository.findIsCorrectByQuestionLabel(
              question.QuestionId,
              studentAnswerOptionLabel
            );

          isCorrect = !!correctOption;
          break;
        }

        case 2: {
          const studentAnswerTrueFalseString =
            item?.CurrentAnswer?.SelectedOption || "";

          const studentAnswers = handle.getStatements(
            studentAnswerTrueFalseString
          );

          const statementByQuestionId =
            await trueFalseStatementRepository.getStatementByQuestionId(
              question.QuestionId
            );

          const compareResult = handle.compareTrueFalseAnswers(
            studentAnswers,
            statementByQuestionId
          );

          const numberCorrect = compareResult?.correctCount ?? 0;
          const totalStatements = statementByQuestionId?.length ?? 0;

          // đúng hết mới true, sai 1 ý cũng false
          isCorrect =
            totalStatements > 0 && numberCorrect === totalStatements;
          break;
        }

        case 3: {
          const shortAnswer =
            await shortAnswerRepository.getShortAnswerByQuestionId(
              question.QuestionId
            );

          const shortCorrect = (shortAnswer?.CorrectAnswer || "").trim();
          const studentAnswerShort = (
            item?.CurrentAnswer?.ShortAnswer || ""
          ).trim();

          isCorrect =
            shortCorrect !== "" && shortCorrect === studentAnswerShort;
          break;
        }

        default:
          isCorrect = false;
          break;
      }

      updates.push({
        AttemptQuestionId: insertedItem.AttemptQuestionId,
        IsCorrect: isCorrect,
      });
    }

    return updates;
  }

  async gradingAttemptQuestionMathForm(attempts = []) {
    let mark = 0;

    for (const item of attempts) {
      const question = await questionRespository.findQuestionById(item.QuestionId);

      switch (question.TypeId) {
        case 1: {
          const studentAnserOptionLable = item?.CurrentAnswer?.SelectedOption;

          if (!studentAnserOptionLable) {
            mark += 0;
            break;
          }

          const isCorect =
            await questionOptionRepository.findIsCorrectByQuestionLabel(
              question.QuestionId,
              studentAnserOptionLable
            );

          if (isCorect) {
            mark += 0.25;
          } else {
            mark += 0;
          }
          break;
        }

        case 2: {
          const studentAnwerTrueFalseString =
            item?.CurrentAnswer?.SelectedOption || "";

          const studentAnswert = handle.getStatements(
            studentAnwerTrueFalseString
          );

          const statementByQuestionId =
            await trueFalseStatementRepository.getStatementByQuestionId(
              question.QuestionId
            );

          const result = handle.compareTrueFalseAnswers(
            studentAnswert,
            statementByQuestionId
          );

          const numberCorrect = result?.correctCount ?? 0;

          if (numberCorrect === 0) {
            mark += 0;
          } else if (numberCorrect === 1) {
            mark += 0.1;
          } else if (numberCorrect === 2) {
            mark += 0.25;
          } else if (numberCorrect === 3) {
            mark += 0.5;
          } else {
            mark += 1;
          }
          break;
        }

        case 3: {
          const shortAnswer =
            await shortAnswerRepository.getShortAnswerByQuestionId(
              question.QuestionId
            );

          const shortCorrect = (shortAnswer?.CorrectAnswer || "").trim();
          const studentAnswerShort = (
            item?.CurrentAnswer?.ShortAnswer || ""
          ).trim();

          if (shortCorrect !== "" && shortCorrect === studentAnswerShort) {
            mark += 0.5;
          } else {
            mark += 0;
          }
          break;
        }

        default:
          mark += 0;
          break;
      }
    }

    return mark;
  }


  async getStudentExamDetail(studentId, studentExamId) {
    if (!studentId || isNaN(Number(studentId))) {
      throw new Error("studentId không hợp lệ");
    }

    if (!studentExamId || isNaN(Number(studentExamId))) {
      throw new Error("studentExamId không hợp lệ");
    }

    const result = await studentExamRepository.getStudentExamDetail(
      Number(studentId),
      Number(studentExamId)
    );
    

    if (!result) {
      throw new Error("Không tìm thấy thông tin bài thi của học sinh");
    }
    else{
      const aiRespond = await openAIService.analyzeExamProcess({ examData: result });
      return aiRespond;
    }

   
  }
}

export default new StudentExamService();