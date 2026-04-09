import prisma from "../config/db.js";

class QuestionOptionRepository {
    
    async getQuestionOptionByQuestionId(questionId) {
        try {
            const options = await prisma.questionOptions.findMany({
                where: {
                    QuestionId: questionId
                },
                orderBy: {
                    OptionLabel: "asc" // optional: sắp xếp A, B, C, D
                }
            });

            return options;
        } catch (error) {
            console.error("Error getQuestionOptionByQuestionId:", error);
            throw error;
        }
    }


    async findIsCorrectByQuestionLabel(questionId, optionLabel) {
        try {
            const option = await prisma.questionOptions.findFirst({
                where: {
                    QuestionId: questionId,
                    OptionLabel: optionLabel
                }
            });

            if (!option) return null;

            return option.IsCorrect; // true / false
        } catch (error) {
            console.error("Error findIsCorrectByQuestionLabel:", error);
            throw error;
        }
    }

}

export default new QuestionOptionRepository();