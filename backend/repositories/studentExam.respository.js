import prisma from "../config/db.js";

class StudentExamRepository {
  async startExam(studentId, examId) {
    const sql = `
      DECLARE @StudentId INT = @P1; 
      DECLARE @ExamId INT = @P2;    

      DECLARE @StudentExamId INT;
      DECLARE @Duration INT;
      DECLARE @ExpireAt DATETIME2(7);
      DECLARE @CurrentTime DATETIME2(7) = SYSUTCDATETIME();
      DECLARE @JsonResult NVARCHAR(MAX);

      BEGIN TRY
          BEGIN TRANSACTION;

          SELECT @Duration = Duration 
          FROM Exams 
          WHERE ExamId = @ExamId AND IsActive = 1;

          IF @Duration IS NULL 
              THROW 50001, N'Bài thi không tồn tại hoặc đã bị khóa.', 1;

          SELECT TOP 1 
              @StudentExamId = StudentExamId, 
              @ExpireAt = ExpireAt
          FROM StudentExams
          WHERE StudentId = @StudentId 
            AND ExamId = @ExamId 
            AND Status = 'InProgress'
          ORDER BY CreatedAt DESC;

          IF @StudentExamId IS NOT NULL
          BEGIN
              IF @ExpireAt < @CurrentTime
              BEGIN
                  UPDATE StudentExams 
                  SET Status = 'Expired', UpdatedAt = @CurrentTime 
                  WHERE StudentExamId = @StudentExamId;

                  THROW 50002, N'Phiên làm bài trước đó đã hết hạn.', 1;
              END
          END
          ELSE
          BEGIN
              SET @ExpireAt = DATEADD(MINUTE, @Duration, @CurrentTime);
              
              DECLARE @NextAttemptNo INT;
              SELECT @NextAttemptNo = ISNULL(MAX(AttemptNo), 0) + 1 
              FROM StudentExams 
              WHERE StudentId = @StudentId AND ExamId = @ExamId;

              INSERT INTO StudentExams (
                  StudentId, ExamId, Status, ExpireAt, AttemptNo, CreatedAt, IsAutoSubmitted
              )
              VALUES (
                  @StudentId, @ExamId, 'InProgress', @ExpireAt, @NextAttemptNo, @CurrentTime, 0
              );

              SET @StudentExamId = SCOPE_IDENTITY();
          END

          SET @JsonResult = (
              SELECT 
                  se.StudentExamId,
                  se.Status,
                  se.ExpireAt,
                  se.AttemptNo,
                  e.ExamId,
                  e.ExamName,
                  e.Duration,
                  JSON_QUERY((
                      SELECT 
                          eq.Part,
                          eq.QuestionOrder,
                          q.QuestionId,
                          q.TypeId,
                          q.QuestionContent,
                          CASE 
                              WHEN q.TypeId = 3 THEN CAST('' AS NVARCHAR(MAX))
                              ELSE NULL
                          END AS StudentAnswerText,
                          JSON_QUERY((
                              SELECT 
                                  qi.ImageId, 
                                  qi.ImageUrl, 
                                  qi.Caption, 
                                  qi.DisplayOrder
                              FROM QuestionImages qi
                              WHERE qi.QuestionId = q.QuestionId
                              ORDER BY qi.DisplayOrder
                              FOR JSON PATH
                          )) AS Images,
                          JSON_QUERY((
                              SELECT 
                                  qo.OptionId, 
                                  qo.OptionLabel, 
                                  qo.OptionContent
                              FROM QuestionOptions qo
                              WHERE qo.QuestionId = q.QuestionId
                              FOR JSON PATH
                          )) AS Options,
                          JSON_QUERY((
                              SELECT 
                                  tfs.StatementId, 
                                  tfs.StatementLabel, 
                                  tfs.StatementContent
                              FROM TrueFalseStatements tfs
                              WHERE tfs.QuestionId = q.QuestionId
                              FOR JSON PATH
                          )) AS TrueFalseStatements
                      FROM ExamQuestions eq
                      INNER JOIN Questions q ON eq.QuestionId = q.QuestionId
                      WHERE eq.ExamId = e.ExamId
                      ORDER BY eq.Part, eq.QuestionOrder
                      FOR JSON PATH
                  )) AS Questions
              FROM StudentExams se
              INNER JOIN Exams e ON se.ExamId = e.ExamId
              WHERE se.StudentExamId = @StudentExamId
              FOR JSON PATH, WITHOUT_ARRAY_WRAPPER
          );

          COMMIT TRANSACTION;

          SELECT @JsonResult AS JsonResult;
      END TRY
      BEGIN CATCH
          IF @@TRANCOUNT > 0 ROLLBACK TRANSACTION;
          THROW;
      END CATCH
    `;

    const result = await prisma.$queryRawUnsafe(sql, studentId, examId);

    if (!result || result.length === 0) {
      return null;
    }

    const jsonString = result[0]?.JsonResult;

    if (!jsonString) {
      return null;
    }

    try {
      return JSON.parse(jsonString);
    } catch (error) {
      throw new Error("Không parse được dữ liệu JSON từ database.");
    }
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