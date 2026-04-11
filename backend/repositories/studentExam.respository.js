import prisma from "../config/db.js";
import { Prisma } from "@prisma/client"
class StudentExamRepository {
  async startExam(studentId, examId) {
    return await prisma.$transaction(async (tx) => {
      const currentTimeResult = await tx.$queryRaw`
        SELECT NOW() AS now
      `;
      const currentTime = currentTimeResult[0].now;

      const examRows = await tx.$queryRaw`
        SELECT "Duration" AS duration
        FROM "Exams"
        WHERE "ExamId" = ${examId}
          AND "IsActive" = true
        LIMIT 1
      `;

      if (examRows.length === 0) {
        throw new Error("Bài thi không tồn tại hoặc đã bị khóa.");
      }

      const duration = examRows[0].duration;

      const existingRows = await tx.$queryRaw`
        SELECT
          "StudentExamId" AS "studentExamId",
          "ExpireAt" AS "expireAt"
        FROM "StudentExams"
        WHERE "StudentId" = ${studentId}
          AND "ExamId" = ${examId}
          AND "Status" = 'InProgress'
        ORDER BY "CreatedAt" DESC
        LIMIT 1
        FOR UPDATE
      `;

      let studentExamId;

      if (existingRows.length > 0) {
        const existing = existingRows[0];

        if (new Date(existing.expireAt) < new Date(currentTime)) {
          await tx.$executeRaw`
            UPDATE "StudentExams"
            SET
              "Status" = 'Expired',
              "UpdatedAt" = ${currentTime}
            WHERE "StudentExamId" = ${existing.studentExamId}
          `;

          throw new Error("Phiên làm bài trước đó đã hết hạn.");
        }

        studentExamId = existing.studentExamId;
      } else {
        const attemptRows = await tx.$queryRaw`
          SELECT COALESCE(MAX("AttemptNo"), 0) + 1 AS "nextAttemptNo"
          FROM "StudentExams"
          WHERE "StudentId" = ${studentId}
            AND "ExamId" = ${examId}
        `;

        const nextAttemptNo = Number(attemptRows[0].nextAttemptNo);
        const expireAt = new Date(new Date(currentTime).getTime() + duration * 60 * 1000);

        const insertRows = await tx.$queryRaw`
          INSERT INTO "StudentExams" (
            "StudentId",
            "ExamId",
            "Status",
            "ExpireAt",
            "AttemptNo",
            "CreatedAt",
            "IsAutoSubmitted"
          )
          VALUES (
            ${studentId},
            ${examId},
            'InProgress',
            ${expireAt},
            ${nextAttemptNo},
            ${currentTime},
            false
          )
          RETURNING "StudentExamId" AS "studentExamId"
        `;

        studentExamId = insertRows[0].studentExamId;
      }

      const result = await tx.$queryRaw`
        SELECT jsonb_build_object(
          'StudentExamId', se."StudentExamId",
          'Status', se."Status",
          'ExpireAt', se."ExpireAt",
          'AttemptNo', se."AttemptNo",
          'ExamId', e."ExamId",
          'ExamName', e."ExamName",
          'Duration', e."Duration",
          'Questions',
            COALESCE((
              SELECT jsonb_agg(
                jsonb_build_object(
                  'Part', eq."Part",
                  'QuestionOrder', eq."QuestionOrder",
                  'QuestionId', q."QuestionId",
                  'TypeId', q."TypeId",
                  'QuestionContent', q."QuestionContent",
                  'StudentAnswerText',
                    CASE
                      WHEN q."TypeId" = 3 THEN ''
                      ELSE NULL
                    END,
                  'Images',
                    COALESCE((
                      SELECT jsonb_agg(
                        jsonb_build_object(
                          'ImageId', qi."ImageId",
                          'ImageUrl', qi."ImageUrl",
                          'Caption', qi."Caption",
                          'DisplayOrder', qi."DisplayOrder"
                        )
                        ORDER BY qi."DisplayOrder"
                      )
                      FROM "QuestionImages" qi
                      WHERE qi."QuestionId" = q."QuestionId"
                    ), '[]'::jsonb),
                  'Options',
                    COALESCE((
                      SELECT jsonb_agg(
                        jsonb_build_object(
                          'OptionId', qo."OptionId",
                          'OptionLabel', qo."OptionLabel",
                          'OptionContent', qo."OptionContent"
                        )
                        ORDER BY qo."OptionId"
                      )
                      FROM "QuestionOptions" qo
                      WHERE qo."QuestionId" = q."QuestionId"
                    ), '[]'::jsonb),
                  'TrueFalseStatements',
                    COALESCE((
                      SELECT jsonb_agg(
                        jsonb_build_object(
                          'StatementId', tfs."StatementId",
                          'StatementLabel', tfs."StatementLabel",
                          'StatementContent', tfs."StatementContent"
                        )
                        ORDER BY tfs."StatementId"
                      )
                      FROM "TrueFalseStatements" tfs
                      WHERE tfs."QuestionId" = q."QuestionId"
                    ), '[]'::jsonb)
                )
                ORDER BY eq."Part", eq."QuestionOrder"
              )
              FROM "ExamQuestions" eq
              INNER JOIN "Questions" q
                ON eq."QuestionId" = q."QuestionId"
              WHERE eq."ExamId" = e."ExamId"
            ), '[]'::jsonb)
        ) AS jsonresult
        FROM "StudentExams" se
        INNER JOIN "Exams" e
          ON se."ExamId" = e."ExamId"
        WHERE se."StudentExamId" = ${studentExamId}
        LIMIT 1
      `;

      if (!result || result.length === 0) {
        return null;
      }

      return result[0].jsonresult || null;
    });
  }




  async updateScore(studentExamId, score) {
    try {
      const result = await prisma.studentExams.update({
        where: {
          StudentExamId: studentExamId,
        },
        data: {
          Score: score,
          UpdatedAt: new Date(),
        },
      });

      return result;
    } catch (error) {
      console.error("Error updating score:", error);
      throw error;
    }
  }

  // Update Status
  async updateStatus(studentExamId, status) {
    try {
      const result = await prisma.studentExams.update({
        where: {
          StudentExamId: studentExamId,
        },
        data: {
          Status: status,
          UpdatedAt: new Date(),
        },
      });

      return result;
    } catch (error) {
      console.error("Error updating status:", error);
      throw error;
    }
  }

  // Update Score + Status
  async updateScoreAndStatus(studentExamId, score, status) {
    try {
      const result = await prisma.studentExams.update({
        where: {
          StudentExamId: studentExamId,
        },
        data: {
          Score: score,
          Status: status,
          UpdatedAt: new Date(),
        },
      });

      return result;
    } catch (error) {
      console.error("Error updating score & status:", error);
      throw error;
    }
  }



  async getStudentExamList(params = {}) {
    const {
      page = 1,
      limit = 10,
      search = "",
      fullName = "",
      examName = "",
      status = "",
      scoreMin,
      scoreMax,
      sortBy = "CreatedAt",
      sortOrder = "desc"
    } = params;

    const pageNumber = Math.max(Number(page) || 1, 1);
    const pageSize = Math.max(Number(limit) || 10, 1);
    const offset = (pageNumber - 1) * pageSize;

    const whereConditions = [
      Prisma.sql`s."is_deleted" = false`
    ];

    if (search && String(search).trim() !== "") {
      const keyword = `%${String(search).trim()}%`;
      whereConditions.push(
        Prisma.sql`(
          s."FullName" ILIKE ${keyword}
          OR e."ExamName" ILIKE ${keyword}
          OR CAST(se."Status" AS TEXT) ILIKE ${keyword}
          OR CAST(se."Score" AS TEXT) ILIKE ${keyword}
        )`
      );
    }

    if (fullName && String(fullName).trim() !== "") {
      whereConditions.push(
        Prisma.sql`s."FullName" ILIKE ${`%${String(fullName).trim()}%`}`
      );
    }

    if (examName && String(examName).trim() !== "") {
      whereConditions.push(
        Prisma.sql`e."ExamName" ILIKE ${`%${String(examName).trim()}%`}`
      );
    }

    if (status && String(status).trim() !== "") {
      whereConditions.push(
        Prisma.sql`CAST(se."Status" AS TEXT) ILIKE ${`%${String(status).trim()}%`}`
      );
    }

    if (scoreMin !== undefined && scoreMin !== null && scoreMin !== "") {
      whereConditions.push(
        Prisma.sql`se."Score" >= ${Number(scoreMin)}`
      );
    }

    if (scoreMax !== undefined && scoreMax !== null && scoreMax !== "") {
      whereConditions.push(
        Prisma.sql`se."Score" <= ${Number(scoreMax)}`
      );
    }

    const allowedSortFields = {
      StudentExamId: Prisma.sql`se."StudentExamId"`,
      FullName: Prisma.sql`s."FullName"`,
      ExamName: Prisma.sql`e."ExamName"`,
      TimeTotal: Prisma.sql`(EXTRACT(EPOCH FROM (se."UpdatedAt" - se."CreatedAt"))::INT)`,
      Score: Prisma.sql`se."Score"`,
      Status: Prisma.sql`se."Status"`,
      CreatedAt: Prisma.sql`se."CreatedAt"`,
      UpdatedAt: Prisma.sql`se."UpdatedAt"`
    };

    const orderField =
      allowedSortFields[sortBy] || allowedSortFields.CreatedAt;

    const orderDirection =
      String(sortOrder).toLowerCase() === "asc"
        ? Prisma.sql`ASC`
        : Prisma.sql`DESC`;

    const whereClause = Prisma.sql`WHERE ${Prisma.join(whereConditions, " AND ")}`;

    const dataQuery = Prisma.sql`
      SELECT
        se."StudentExamId" AS "StudentExamId",
         s."StudentId"     AS "StudentId",
        s."FullName"       AS "FullName",
        e."ExamName"       AS "ExamName",
        EXTRACT(EPOCH FROM (se."UpdatedAt" - se."CreatedAt"))::INT AS "TimeTotal",
        se."Score"         AS "Score",
        se."Status"        AS "Status",
        se."CreatedAt"     AS "CreatedAt",
        se."UpdatedAt"     AS "UpdatedAt"
      FROM "StudentExams" se
      INNER JOIN "Students" s
        ON s."StudentId" = se."StudentId"
      INNER JOIN "Exams" e
        ON e."ExamId" = se."ExamId"
      ${whereClause}
      ORDER BY ${orderField} ${orderDirection}
      LIMIT ${pageSize}
      OFFSET ${offset}
    `;

    const countQuery = Prisma.sql`
      SELECT COUNT(*)::INT AS "total"
      FROM "StudentExams" se
      INNER JOIN "Students" s
        ON s."StudentId" = se."StudentId"
      INNER JOIN "Exams" e
        ON e."ExamId" = se."ExamId"
      ${whereClause}
    `;

    const [data, totalResult] = await Promise.all([
      prisma.$queryRaw(dataQuery),
      prisma.$queryRaw(countQuery)
    ]);

    const total = totalResult?.[0]?.total || 0;

    return {
      data,
      pagination: {
        page: pageNumber,
        limit: pageSize,
        total,
        totalPages: Math.ceil(total / pageSize)
      }
    };
  }



  /// detail exam 
  async getStudentExamDetail(studentId, studentExamId) {
    const result = await prisma.$queryRaw`
      SELECT jsonb_build_object(
        'StudentId', s."StudentId",
        'FullName', s."FullName",
        'Email', s."Email",
        'ClassName', c."ClassName",
        'ExamDetails', (
          SELECT jsonb_build_object(
            'StudentExamId', se."StudentExamId",
            'ExamName', e."ExamName",
            'AttemptNo', se."AttemptNo",
            'Score', se."Score",
            'Status', se."Status",
            'IsAutoSubmitted', se."IsAutoSubmitted",
            'StartTime', se."CreatedAt",
            'SubmitTime', se."SubmittedAt",
            'DurationMinutes',
              CASE
                WHEN se."SubmittedAt" IS NOT NULL
                THEN FLOOR(EXTRACT(EPOCH FROM (se."SubmittedAt" - se."CreatedAt")) / 60)
                ELSE NULL
              END,
            'BehaviorLogs', (
              SELECT COALESCE(
                jsonb_agg(
                  jsonb_build_object(
                    'EventType', ebl."EventType",
                    'EventTime', ebl."EventTime"
                  )
                  ORDER BY ebl."EventTime" ASC
                ),
                '[]'::jsonb
              )
              FROM "ExamBehaviorLogs" ebl
              WHERE ebl."StudentExamId" = se."StudentExamId"
            ),
            'QuestionAttempts', (
              SELECT COALESCE(
                jsonb_agg(
                  jsonb_build_object(
                    'QuestionId', q."QuestionId",
                    'TopicName', t."TopicName",
                    'QuestionSkills', (
                      SELECT COALESCE(
                        jsonb_agg(
                          jsonb_build_object(
                            'SkillName', sk."SkillName"
                          )
                        ),
                        '[]'::jsonb
                      )
                      FROM "QuestionSkills" qs
                      JOIN "Skills" sk
                        ON qs."SkillId" = sk."SkillId"
                      WHERE qs."QuestionId" = q."QuestionId"
                    ),
                    'Difficulty', dl."LevelName",
                    'QuestionType', qt."TypeName",
                    'TimeSpentSeconds', aq."TimeSpent",
                    'AnswerChangedCount', aq."AnswerChangedCount",
                    'IsCorrect', aq."IsCorrect",
                    'FinalSelectedOption', sa."SelectedOption",
                    'FinalShortAnswer', sa."ShortAnswer",
                    'ActionLogs', (
                      SELECT COALESCE(
                        jsonb_agg(
                          jsonb_build_object(
                            'ActionType', al."ActionType",
                            'SelectedOption', al."SelectedOption",
                            'ActionTime', al."CreatedAt"
                          )
                          ORDER BY al."CreatedAt" ASC
                        ),
                        '[]'::jsonb
                      )
                      FROM "AnswerLogs" al
                      WHERE al."AttemptQuestionId" = aq."AttemptQuestionId"
                    )
                  )
                ),
                '[]'::jsonb
              )
              FROM "AttemptQuestions" aq
              JOIN "Questions" q
                ON aq."QuestionId" = q."QuestionId"
              LEFT JOIN "Topics" t
                ON q."TopicId" = t."TopicId"
              LEFT JOIN "DifficultyLevels" dl
                ON q."DifficultyId" = dl."DifficultyId"
              LEFT JOIN "QuestionTypes" qt
                ON q."TypeId" = qt."TypeId"
              LEFT JOIN "StudentAnswers" sa
                ON aq."AttemptQuestionId" = sa."AttemptQuestionId"
              WHERE aq."StudentExamId" = se."StudentExamId"
            )
          )
          FROM "StudentExams" se
          JOIN "Exams" e
            ON se."ExamId" = e."ExamId"
          WHERE se."StudentExamId" = ${Number(studentExamId)}
            AND se."StudentId" = s."StudentId"
        )
      ) AS result
      FROM "Students" s
      LEFT JOIN "Classes" c
        ON s."ClassId" = c."ClassId"
      WHERE s."StudentId" = ${Number(studentId)}
        AND s."is_deleted" = false
      LIMIT 1
    `;
  
    return result?.[0]?.result || null;
  }
}

export default new StudentExamRepository();