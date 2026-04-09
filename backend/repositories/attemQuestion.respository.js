import prisma from "../config/db.js";

class AttemptQuestionRepository {
  async insertManyFull(attemptQuestions) {
    try {
      const normalizeDate = (value) => {
        if (!value) return null;
        const d = new Date(value);
        return Number.isNaN(d.getTime()) ? null : d;
      };

      const normalizeNullableString = (value) => {
        if (value === undefined || value === null || value === "") return null;
        return value;
      };

      const result = await prisma.$transaction(
        attemptQuestions.map((item) =>
          prisma.attemptQuestions.create({
            data: {
              StudentExamId: item.StudentExamId,
              QuestionId: item.QuestionId,
              StartTime: normalizeDate(item.StartTime),
              EndTime: normalizeDate(item.EndTime),
              TimeSpent: item.TimeSpent ?? 0,
              AnswerChangedCount: item.AnswerChangedCount ?? 0,
              IsCorrect: item.IsCorrect ?? false,

              ...(item.CurrentAnswer
                ? {
                    StudentAnswers: {
                      create: {
                        SelectedOption: normalizeNullableString(
                          item.CurrentAnswer.SelectedOption
                        ),
                        ShortAnswer: normalizeNullableString(
                          item.CurrentAnswer.ShortAnswer
                        ),
                        CreatedAt:
                          normalizeDate(item.CurrentAnswer.CreatedAt) ??
                          new Date(),
                      },
                    },
                  }
                : {}),

              ...(Array.isArray(item.AnswerLogs) && item.AnswerLogs.length > 0
                ? {
                    AnswerLogs: {
                      create: item.AnswerLogs.map((log) => ({
                        ActionType: log.ActionType,
                        SelectedOption: normalizeNullableString(
                          log.SelectedOption
                        ),
                        CreatedAt: normalizeDate(log.CreatedAt) ?? new Date(),
                      })),
                    },
                  }
                : {}),
            },
            include: {
              StudentAnswers: true,
              AnswerLogs: true,
            },
          })
        )
      );

      return result;
    } catch (error) {
      console.error("Error insertManyFull AttemptQuestions:", error);
      throw error;
    }
  }


  async updateManyResult(items = []) {
    try {
      const result = await prisma.$transaction(
        items.map((item) =>
          prisma.attemptQuestions.update({
            where: {
              AttemptQuestionId: item.AttemptQuestionId,
            },
            data: {
              IsCorrect: item.IsCorrect
            },
          })
        )
      );
  
      return result;
    } catch (error) {
      console.error("Error updateManyResult AttemptQuestions:", error);
      throw error;
    }
  }
}

export default new AttemptQuestionRepository();