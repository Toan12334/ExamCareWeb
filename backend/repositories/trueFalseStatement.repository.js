import prisma from "../config/db.js";

class TrueFalseStatementRepository {

    // Lấy tất cả statement theo QuestionId
    async getStatementByQuestionId(questionId) {
        try {
            const statements = await prisma.trueFalseStatements.findMany({
                where: {
                    QuestionId: questionId
                },
                orderBy: {
                    StatementId: "asc"
                }
            });

            return statements;
        } catch (error) {
            console.error("Error getByQuestionId:", error);
            throw error;
        }
    }

    // Lấy tất cả statement đúng (ít dùng nhưng có thể cần)
    async getCorrectStatementsByQuestionId(questionId) {
        try {
            return await prisma.trueFalseStatements.findMany({
                where: {
                    QuestionId: questionId,
                    IsCorrect: true
                }
            });
        } catch (error) {
            console.error("Error getCorrectStatementsByQuestionId:", error);
            throw error;
        }
    }

    // PRO: lấy nhiều question cùng lúc (tối ưu chấm bài)
    async getByQuestionIds(questionIds) {
        try {
            return await prisma.trueFalseStatements.findMany({
                where: {
                    questionId: {
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

export default new TrueFalseStatementRepository();