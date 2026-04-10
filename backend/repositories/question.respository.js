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
    const offset = (page - 1) * pageSize
    const conditions = []

    if (keyword) {
      conditions.push(
        Prisma.sql`q."QuestionContent" ILIKE ${`%${keyword}%`}`
      )
    }

    if (topicId) {
      conditions.push(
        Prisma.sql`q."TopicId" = ${Number(topicId)}`
      )
    }

    if (difficultyId) {
      conditions.push(
        Prisma.sql`q."DifficultyId" = ${Number(difficultyId)}`
      )
    }

    if (typeId) {
      conditions.push(
        Prisma.sql`q."TypeId" = ${Number(typeId)}`
      )
    }

    if (skillId) {
      conditions.push(
        Prisma.sql`qs."SkillId" = ${Number(skillId)}`
      )
    }

    const whereClause =
      conditions.length > 0
        ? Prisma.sql`WHERE ${Prisma.join(conditions, Prisma.sql` AND `)}`
        : Prisma.sql``

    const data = await prisma.$queryRaw`
      SELECT 
        q."QuestionId",
        q."QuestionContent" AS "QuestionPreview",
        t."TopicName",
        qt."TypeName",
        d."LevelName" AS "Difficulty",
        COALESCE(STRING_AGG(DISTINCT s."SkillName", ', '), '') AS "Skills",
        q."CreatedAt",
        COUNT(DISTINCT aq."AttemptQuestionId") AS "TotalAttempts",
        CAST(
          CASE 
            WHEN COUNT(DISTINCT aq."AttemptQuestionId") = 0 THEN 0
            ELSE 
              SUM(CASE WHEN aq."IsCorrect" = true THEN 1 ELSE 0 END) * 100.0
              / COUNT(DISTINCT aq."AttemptQuestionId")
          END
        AS DECIMAL(5,2)) AS "Accuracy"
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
      LIMIT ${pageSize} OFFSET ${offset}
    `

    const totalResult = await prisma.$queryRaw`
      SELECT COUNT(DISTINCT q."QuestionId")::int AS "total"
      FROM "Questions" q
      LEFT JOIN "QuestionSkills" qs ON q."QuestionId" = qs."QuestionId"
      ${whereClause}
    `

    const total = totalResult[0]?.total || 0

    return {
      data,
      total,
      page,
      pageSize,
      totalPages: Math.ceil(total / pageSize)
    }
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