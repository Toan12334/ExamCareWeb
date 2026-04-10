import prisma from "../config/db.js";

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
}

export default new StudentExamRepository();