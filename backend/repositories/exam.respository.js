import prisma from "../config/db.js";

class ExamRepository {
  async createExam(examData) {
    return await prisma.exams.create({
      data: examData,
    });
  }

  async getAllExams({ page = 1, limit = 10, search = "" } = {}) {
    const currentPage = Math.max(1, Number(page) || 1);
    const pageSize = Math.max(1, Number(limit) || 10);
    const skip = (currentPage - 1) * pageSize;

    const where = search
      ? {
        ExamName: {
          contains: search,
        },
      }
      : {};

    const [exams, total] = await Promise.all([
      prisma.exams.findMany({
        where,
        skip,
        take: pageSize,
        orderBy: {
          CreatedAt: "desc",
        },
      }),
      prisma.exams.count({ where }),
    ]);

    return {
      data: exams,
      pagination: {
        total,
        page: currentPage,
        limit: pageSize,
        totalPages: Math.ceil(total / pageSize),
        hasNextPage: currentPage * pageSize < total,
        hasPreviousPage: currentPage > 1,
      },
    };
  }

  async getExamById(examId) {
    return await prisma.exams.findUnique({
      where: {
        ExamId: Number(examId),
      },
    });
  }

  async updateExamWithQuestions(examId, payload) {
    const { examName, duration, questions } = payload;
  
    return await prisma.$transaction(async (tx) => {
      // 1. check tồn tại
      const existingExam = await tx.exams.findUnique({
        where: {
          ExamId: Number(examId),
        },
      });
  
      if (!existingExam) {
        throw new Error("Không tìm thấy bài thi");
      }
  
      // 2. update exam
      const updatedExam = await tx.exams.update({
        where: {
          ExamId: Number(examId),
        },
        data: {
          ExamName: examName,
          Duration: duration,
        },
      });
  
      // 3. xoá toàn bộ câu hỏi cũ
      await tx.examQuestions.deleteMany({
        where: {
          ExamId: Number(examId),
        },
      });
  
      // 4. insert lại theo payload
      if (questions?.length) {
        await tx.examQuestions.createMany({
          data: questions.map((q) => ({
            ExamId: Number(examId),
            QuestionId: q.questionId,
            Part: q.part,
            QuestionOrder: q.questionOrder,
          })),
        });
      }
  
      return updatedExam;
    });
  }



  async createExamWithQuestions({ examName, duration, questions }) {
    return await prisma.$transaction(async (tx) => {
      // 1. Tạo exam
      const exam = await tx.exams.create({
        data: {
          ExamName: examName,
          Duration: duration,
          CreatedAt: new Date(),
        },
      });

      if (questions && questions.length > 0) {
        await tx.examQuestions.createMany({
          data: questions.map((q) => ({
            ExamId: exam.ExamId,
            QuestionId: q.questionId,
            Part: q.part,
            QuestionOrder: q.questionOrder,
          })),
        });
      }

      return exam;
    });
  }

  async getExamDetail(examId) {
    const exam = await prisma.exams.findUnique({
      where: {
        ExamId: Number(examId),
      },
      include: {
        ExamQuestions: {
          orderBy: [{ Part: "asc" }, { QuestionOrder: "asc" }],
          include: {
            Questions: {
              include: {
                QuestionTypes: true,
                DifficultyLevels: true,
                Topics: true,
                QuestionSkills: {
                  include: {
                    Skills: true,
                  },
                },
              },
            },
          },
        },
      },
    });
  
    if (!exam) {
      return null;
    }
  
    return {
      examName: exam.ExamName,
      duration: exam.Duration,
      questions: exam.ExamQuestions.map((eq) => ({
        id: eq.Id,
        part: eq.Part,
        questionOrder: eq.QuestionOrder,
        QuestionId: eq.Questions?.QuestionId,
        QuestionPreview: eq.Questions?.QuestionContent,
        explanation: eq.Questions?.Explanation,
        TypeName: eq.Questions?.QuestionTypes?.TypeName || null,
        Difficulty: eq.Questions?.DifficultyLevels?.LevelName || null,
        TopicName: eq.Questions?.Topics?.TopicName || null,
        Skills:
          eq.Questions?.QuestionSkills?.map((qs) => qs.Skills?.SkillName)
            .filter(Boolean)
            .join(", ") || "",
      })),
    };
  }


  async updateExamStatus(examId, isActive) {
    return await prisma.exams.update({
      where: {
        ExamId: Number(examId),
      },
      data: {
        IsActive: isActive,
      },
    });
  }
}





export default new ExamRepository();