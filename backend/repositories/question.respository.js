import prisma from "../config/db.js"
import { Prisma } from "@prisma/client"
class QuestionRepository {
  async findAll({
    keyword = null,
    topicId = null,
    difficultyId = null,
    typeId = null,
    skillId = null,
    page = 1,
    pageSize = 10
  }) {
    // 1. Ép kiểu phân trang an toàn
    const limit = Number(pageSize) || 10;
    const currentPage = Number(page) || 1;
    const offset = (currentPage - 1) * limit;

    const conditions = [];

    // 2. Ép kiểu và kiểm tra điều kiện (Thêm check kiểu string cho keyword để chống lỗi Object)
    if (keyword && typeof keyword === 'string' && keyword.trim() !== '') {
      conditions.push(Prisma.sql`q."QuestionContent" ILIKE ${'%' + keyword.trim() + '%'}`);
    }

    if (topicId && !isNaN(Number(topicId))) {
      conditions.push(Prisma.sql`q."TopicId" = ${Number(topicId)}`);
    }

    if (difficultyId && !isNaN(Number(difficultyId))) {
      conditions.push(Prisma.sql`q."DifficultyId" = ${Number(difficultyId)}`);
    }

    if (typeId && !isNaN(Number(typeId))) {
      conditions.push(Prisma.sql`q."TypeId" = ${Number(typeId)}`);
    }

    if (skillId && !isNaN(Number(skillId))) {
      conditions.push(Prisma.sql`qs."SkillId" = ${Number(skillId)}`);
    }

    // 3. Nối điều kiện chuẩn Prisma (Dùng ' AND ' thay vì Prisma.sql)
    const whereClause =
      conditions.length > 0
        ? Prisma.sql`WHERE ${Prisma.join(conditions, ' AND ')}`
        : Prisma.empty;

    // 4. Truy vấn lấy dữ liệu (Đã fix lỗi BigInt với ::int và ::float)
    // Chú ý: Dùng dấu backtick (`) ngay sát $queryRaw, tuyệt đối không có ngoặc đơn ()
    const data = await prisma.$queryRaw`
      SELECT 
        q."QuestionId",
        q."QuestionContent" AS "QuestionPreview",
        t."TopicName",
        qt."TypeName",
        d."LevelName" AS "Difficulty",
        COALESCE(STRING_AGG(DISTINCT s."SkillName", ', '), '') AS "Skills",
        q."CreatedAt",
        COUNT(DISTINCT aq."AttemptQuestionId")::int AS "TotalAttempts",
        CAST(
          CASE 
            WHEN COUNT(DISTINCT aq."AttemptQuestionId") = 0 THEN 0
            ELSE 
              SUM(CASE WHEN aq."IsCorrect" = true THEN 1 ELSE 0 END) * 100.0
              / COUNT(DISTINCT aq."AttemptQuestionId")
          END
        AS DECIMAL(5,2))::float AS "Accuracy"
      FROM "Questions" q
      LEFT JOIN "Topics" t ON q."TopicId" = t."TopicId"
      LEFT JOIN "QuestionTypes" qt ON q."TypeId" = qt."TypeId"
      LEFT JOIN "DifficultyLevels" d ON q."DifficultyId" = d."DifficultyId"
      LEFT JOIN "QuestionSkills" qs ON q."QuestionId" = qs."QuestionId"
      LEFT JOIN "Skills" s ON qs."SkillId" = s."SkillId"
      LEFT JOIN "AttemptQuestions" aq ON q."QuestionId" = aq."QuestionId"
      ${whereClause}
      GROUP BY 
        q."QuestionId",
        q."QuestionContent",
        t."TopicName",
        qt."TypeName",
        d."LevelName",
        q."CreatedAt"
      ORDER BY q."CreatedAt" DESC
      LIMIT ${limit} OFFSET ${offset}
    `;

    // 5. Truy vấn đếm tổng số bản ghi (Dùng ::int để ép kiểu an toàn)
    const totalResult = await prisma.$queryRaw`
      SELECT COUNT(DISTINCT q."QuestionId")::int AS "total"
      FROM "Questions" q
      LEFT JOIN "QuestionSkills" qs ON q."QuestionId" = qs."QuestionId"
      ${whereClause}
    `;

    // 6. Xử lý kết quả trả về
    const total = totalResult.length > 0 ? totalResult[0].total : 0;

    return {
      data,
      total,
      page: currentPage,
      pageSize: limit,
      totalPages: Math.ceil(total / limit)
    };
  }


    // QuestionRepository.js
    async create(data) {
        return await prisma.$transaction(async (tx) => {
            // --- 1. LƯU BẢNG QUESTIONS ---
            const question = await tx.questions.create({
                data: {
                    TopicId: data.TopicId,
                    DifficultyId: data.DifficultyId,
                    TypeId: data.TypeId,
                    QuestionContent: data.QuestionContent,
                    CreatedAt: new Date()
                }
            });

            const questionId = question.QuestionId;

            // --- 2. LƯU SKILLS ---
            if (data.SkillIds?.length > 0) {
                await tx.questionSkills.createMany({
                    data: data.SkillIds.map(id => ({
                        QuestionId: questionId,
                        SkillId: Number(id)
                    }))
                });
            }

            // --- 3. LƯU IMAGES ---
            if (data.Images?.length > 0) {
                await tx.questionImages.createMany({
                    data: data.Images.map((img, index) => ({
                        QuestionId: questionId,
                        ImageUrl: img.url ?? img.ImageUrl,
                        DisplayOrder: img.displayOrder ?? (index + 1)
                    }))
                });
            }

            // --- 4. LƯU ĐÁP ÁN THEO TYPEID ---

            // 🟢 Type 1: Trắc nghiệm (Bảng QuestionOptions)
            if (data.TypeId === 1) {
                await tx.questionOptions.createMany({
                    data: data.Options.map((opt, index) => ({
                        QuestionId: questionId,
                        OptionLabel: opt.label ?? String.fromCharCode(65 + index), // A, B, C...
                        OptionContent: opt.content ?? "",
                        IsCorrect: Boolean(opt.isCorrect)
                    }))
                });
            }

            // 🟡 Type 2: Đúng / Sai (Bảng TrueFalseStatements)
            else if (data.TypeId === 2) {
                await tx.trueFalseStatements.createMany({
                    data: data.TrueFalseStatements.map((st, index) => ({
                        QuestionId: questionId,
                        StatementLabel: st.label ?? (index + 1).toString(),
                        StatementContent: st.content ?? "",
                        IsCorrect: Boolean(st.isCorrect)
                    }))
                });
            }

            // 🔵 Type 3: Trả lời ngắn (Bảng ShortAnswers - Theo ảnh 2)
            else if (data.TypeId === 3) {
                await tx.shortAnswers.create({
                    data: {
                        QuestionId: questionId,
                        CorrectAnswer: String(data.CorrectAnswer).trim() // Dùng đúng tên cột CorrectAnswer
                    }
                });
            }

            return questionId;
        }, {
            timeout: 15000
        });
    }



    async findQuestionById(id) {
        const question = await prisma.questions.findUnique({
            where: {
                QuestionId: Number(id)
            },
            include: {
                QuestionSkills: true,
                QuestionImages: {
                    orderBy: { DisplayOrder: 'asc' }
                },
                QuestionOptions: {
                    orderBy: { OptionLabel: 'asc' }
                },
                TrueFalseStatements: {
                    orderBy: { StatementLabel: 'asc' }
                },
                ShortAnswers: true
            }
        });

        if (!question) {
            return null;
        }

        const result = {
            QuestionId: question.QuestionId,
            TopicId: question.TopicId,
            DifficultyId: question.DifficultyId,
            TypeId: question.TypeId,
            Content: question.QuestionContent,
            CreatedAt: question.CreatedAt,
            SkillIds: question.QuestionSkills.map(x => x.SkillId),
            Images: question.QuestionImages.map(img => ({
                url: img.ImageUrl,
                displayOrder: img.DisplayOrder
            }))
        };

        if (question.TypeId === 1) {
            result.Options = question.QuestionOptions.map(opt => ({
                label: opt.OptionLabel,
                content: opt.OptionContent,
                isCorrect: opt.IsCorrect
            }));
        } else if (question.TypeId === 2) {
            result.TrueFalseStatements = question.TrueFalseStatements.map(st => ({
                label: st.StatementLabel,
                content: st.StatementContent,
                isCorrect: st.IsCorrect
            }));
        } else if (question.TypeId === 3) {
            result.CorrectAnswer = question.ShortAnswers?.[0]?.CorrectAnswer ?? null;
        }

        return result;
    }



    async updateQuestionById(id, data) {
        return await prisma.$transaction(async (tx) => {
            const questionId = Number(id);

            const existingQuestion = await tx.questions.findUnique({
                where: {
                    QuestionId: questionId
                }
            });

            if (!existingQuestion) {
                throw new Error('Question not found');
            }

            await tx.questions.update({
                where: {
                    QuestionId: questionId
                },
                data: {
                    TopicId: data.TopicId,
                    DifficultyId: data.DifficultyId,
                    TypeId: data.TypeId,
                    QuestionContent: data.QuestionContent
                }
            });

            await tx.questionSkills.deleteMany({
                where: { QuestionId: questionId }
            });

            await tx.questionImages.deleteMany({
                where: { QuestionId: questionId }
            });

            await tx.questionOptions.deleteMany({
                where: { QuestionId: questionId }
            });

            await tx.trueFalseStatements.deleteMany({
                where: { QuestionId: questionId }
            });

            await tx.shortAnswers.deleteMany({
                where: { QuestionId: questionId }
            });

            if (data.SkillIds?.length > 0) {
                await tx.questionSkills.createMany({
                    data: data.SkillIds.map((skillId) => ({
                        QuestionId: questionId,
                        SkillId: Number(skillId)
                    }))
                });
            }

            if (data.Images?.length > 0) {
                await tx.questionImages.createMany({
                    data: data.Images.map((img, index) => ({
                        QuestionId: questionId,
                        ImageUrl: img.url ?? img.ImageUrl,
                        DisplayOrder: img.displayOrder ?? (index + 1)
                    }))
                });
            }

            if (data.TypeId === 1) {
                if (data.Options?.length > 0) {
                    await tx.questionOptions.createMany({
                        data: data.Options.map((opt, index) => ({
                            QuestionId: questionId,
                            OptionLabel: opt.label ?? String.fromCharCode(65 + index),
                            OptionContent: opt.content ?? "",
                            IsCorrect: Boolean(opt.isCorrect)
                        }))
                    });
                }
            } else if (data.TypeId === 2) {
                if (data.TrueFalseStatements?.length > 0) {
                    await tx.trueFalseStatements.createMany({
                        data: data.TrueFalseStatements.map((st, index) => ({
                            QuestionId: questionId,
                            StatementLabel: st.label ?? (index + 1).toString(),
                            StatementContent: st.content ?? "",
                            IsCorrect: Boolean(st.isCorrect)
                        }))
                    });
                }
            } else if (data.TypeId === 3) {
                await tx.shortAnswers.create({
                    data: {
                        QuestionId: questionId,
                        CorrectAnswer: String(data.CorrectAnswer ?? "").trim()
                    }
                });
            }

            const question = await tx.questions.findUnique({
                where: {
                    QuestionId: questionId
                },
                include: {
                    QuestionSkills: true,
                    QuestionImages: {
                        orderBy: { DisplayOrder: 'asc' }
                    },
                    QuestionOptions: {
                        orderBy: { OptionLabel: 'asc' }
                    },
                    TrueFalseStatements: {
                        orderBy: { StatementLabel: 'asc' }
                    },
                    ShortAnswers: true
                }
            });

            return {
                QuestionId: question.QuestionId,
                TopicId: question.TopicId,
                DifficultyId: question.DifficultyId,
                TypeId: question.TypeId,
                QuestionContent: question.QuestionContent,
                CreatedAt: question.CreatedAt,
                SkillIds: question.QuestionSkills.map(x => x.SkillId),
                Images: question.QuestionImages.map(img => ({
                    url: img.ImageUrl,
                    displayOrder: img.DisplayOrder
                })),
                ...(question.TypeId === 1 && {
                    Options: question.QuestionOptions.map(opt => ({
                        label: opt.OptionLabel,
                        content: opt.OptionContent,
                        isCorrect: opt.IsCorrect
                    }))
                }),
                ...(question.TypeId === 2 && {
                    TrueFalseStatements: question.TrueFalseStatements.map(st => ({
                        label: st.StatementLabel,
                        content: st.StatementContent,
                        isCorrect: st.IsCorrect
                    }))
                }),
                ...(question.TypeId === 3 && {
                    CorrectAnswer: question.ShortAnswers?.[0]?.CorrectAnswer ?? null
                })
            };
        }, {
            timeout: 15000
        });
    }



    async deleteQuestionById(id) {
        // Tìm câu hỏi dựa trên id
        const question = await prisma.questions.findUnique({
            where: {
                QuestionId: Number(id)
            },
            include: {
                QuestionSkills: true,
                QuestionImages: true,
                QuestionOptions: true,
                TrueFalseStatements: true,
                ShortAnswers: true
            }
        });
    
        // Nếu không tìm thấy câu hỏi, trả về null
        if (!question) {
            return null;
        }
    
        // Xóa liên kết và các dữ liệu liên quan
        await prisma.questionSkills.deleteMany({
            where: { QuestionId: Number(id) }
        });
    
        await prisma.questionImages.deleteMany({
            where: { QuestionId: Number(id) }
        });
    
        await prisma.questionOptions.deleteMany({
            where: { QuestionId: Number(id) }
        });
    
        await prisma.trueFalseStatements.deleteMany({
            where: { QuestionId: Number(id) }
        });
    
        await prisma.shortAnswers.deleteMany({
            where: { QuestionId: Number(id) }
        });
    
        // Cuối cùng xóa câu hỏi
        const deletedQuestion = await prisma.questions.delete({
            where: { QuestionId: Number(id) }
        });
    
        // Trả về câu hỏi đã xóa hoặc thông tin cần thiết
        return deletedQuestion;
    }


    async getQuestionAnalytics(questionId) {
        const id = Number(questionId)
    
        const generalResult = await prisma.$queryRaw`
          SELECT 
            q."QuestionId",
            q."QuestionContent",
            q."Explanation",
            q."TypeId",
            t."TopicName",
            d."LevelName" AS "Difficulty",
            (
              SELECT STRING_AGG(s."SkillName", ', ')
              FROM "QuestionSkills" qs
              JOIN "Skills" s ON qs."SkillId" = s."SkillId"
              WHERE qs."QuestionId" = q."QuestionId"
            ) AS "Skills",
            (
              SELECT COUNT(aq."AttemptQuestionId")
              FROM "AttemptQuestions" aq
              WHERE aq."QuestionId" = q."QuestionId"
            ) AS "TotalAttempts",
            (
              SELECT CAST(AVG(aq."TimeSpent"::numeric) AS DECIMAL(10,2))
              FROM "AttemptQuestions" aq
              WHERE aq."QuestionId" = q."QuestionId"
            ) AS "AvgTimeSpentSeconds",
            (
              SELECT CAST(AVG(aq."AnswerChangedCount"::numeric) AS DECIMAL(10,2))
              FROM "AttemptQuestions" aq
              WHERE aq."QuestionId" = q."QuestionId"
            ) AS "AvgAnswerChanged",
            (
              SELECT CAST(
                (SUM(CASE WHEN aq."IsCorrect" = true THEN 1 ELSE 0 END) * 100.0)
                / NULLIF(COUNT(aq."AttemptQuestionId"), 0)
                AS DECIMAL(5,2)
              )
              FROM "AttemptQuestions" aq
              WHERE aq."QuestionId" = q."QuestionId"
            ) AS "AccuracyPercentage"
          FROM "Questions" q
          LEFT JOIN "Topics" t ON q."TopicId" = t."TopicId"
          LEFT JOIN "DifficultyLevels" d ON q."DifficultyId" = d."DifficultyId"
          WHERE q."QuestionId" = ${id}
        `
    
        const general = generalResult[0]
    
        const images = await prisma.$queryRaw`
          SELECT 
            "ImageUrl",
            "Caption",
            "DisplayOrder"
          FROM "QuestionImages"
          WHERE "QuestionId" = ${id}
          ORDER BY "DisplayOrder"
        `
    
        let details = null
    
        if (general?.TypeId === 1) {
          details = await prisma.$queryRaw`
            WITH "TotalAttempts" AS (
              SELECT COUNT("AttemptQuestionId") AS "TotalCnt"
              FROM "AttemptQuestions"
              WHERE "QuestionId" = ${id}
            )
            SELECT 
              qo."OptionLabel",
              qo."OptionContent",
              qo."IsCorrect",
              COUNT(sa."Id") AS "SelectionCount",
              CAST(
                COUNT(sa."Id") * 100.0 / NULLIF((SELECT "TotalCnt" FROM "TotalAttempts"), 0)
                AS DECIMAL(5,2)
              ) AS "SelectionPercentage"
            FROM "QuestionOptions" qo
            LEFT JOIN "AttemptQuestions" aq ON aq."QuestionId" = qo."QuestionId"
            LEFT JOIN "StudentAnswers" sa
              ON sa."AttemptQuestionId" = aq."AttemptQuestionId"
              AND sa."SelectedOption" = qo."OptionLabel"
            WHERE qo."QuestionId" = ${id}
            GROUP BY qo."OptionLabel", qo."OptionContent", qo."IsCorrect"
            ORDER BY qo."OptionLabel"
          `
        } else if (general?.TypeId === 2) {
          details = await prisma.$queryRaw`
            SELECT 
              "StatementLabel",
              "StatementContent",
              "IsCorrect"
            FROM "TrueFalseStatements"
            WHERE "QuestionId" = ${id}
            ORDER BY "StatementLabel"
          `
        } else if (general?.TypeId === 3) {
          const correctAnswer = await prisma.$queryRaw`
            SELECT "CorrectAnswer"
            FROM "ShortAnswers"
            WHERE "QuestionId" = ${id}
          `
    
          const topWrong = await prisma.$queryRaw`
            WITH "TotalAttempts" AS (
              SELECT COUNT("AttemptQuestionId") AS "TotalCnt"
              FROM "AttemptQuestions"
              WHERE "QuestionId" = ${id}
            )
            SELECT
              sa."ShortAnswer" AS "SubmittedAnswer",
              COUNT(sa."Id") AS "Frequency",
              CAST(
                COUNT(sa."Id") * 100.0 / NULLIF((SELECT "TotalCnt" FROM "TotalAttempts"), 0)
                AS DECIMAL(5,2)
              ) AS "Percentage"
            FROM "AttemptQuestions" aq
            JOIN "StudentAnswers" sa
              ON aq."AttemptQuestionId" = sa."AttemptQuestionId"
            WHERE aq."QuestionId" = ${id}
              AND aq."IsCorrect" = false
              AND sa."ShortAnswer" IS NOT NULL
            GROUP BY sa."ShortAnswer"
            ORDER BY "Frequency" DESC
            LIMIT 5
          `
    
          details = {
            correctAnswer: correctAnswer?.[0]?.CorrectAnswer ?? null,
            topWrong
          }
        }
    
        return {
          ...general,
          Images: images,
          Details: details
        }
      }

}






export default new QuestionRepository()