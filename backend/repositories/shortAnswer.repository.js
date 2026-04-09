import prisma from "../config/db.js";

class ShortAnswerRepository {

    // Lấy tất cả đáp án của 1 câu hỏi
    async getShortAnswerByQuestionId(questionId) {
        try {
          const answer = await prisma.shortAnswers.findFirst({
            where: {
              QuestionId: questionId
            }
          });
      
          return answer;
        } catch (error) {
          console.error("Error getByQuestionId:", error);
          throw error;
        }
      }

    // PRO: lấy nhiều question cùng lúc (tối ưu chấm bài)
    async getByQuestionIds(questionIds) {
        try {
            return await prisma.shortAnswers.findMany({
                where: {
                    QuestionId: {
                        in: questionIds
                    }
                }
            });
        } catch (error) {
            console.error("Error getByQuestionIds:", error);
            throw error;
        }
    }

}

export default new ShortAnswerRepository();