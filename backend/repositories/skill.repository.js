import prisma from "../config/db.js"
import { Prisma } from "@prisma/client"

class SkillRepository {
  async searchAndFilter({ keyword = "", topicId, page = 1, pageSize = 10 }) {
    const offset = (page - 1) * pageSize

    const conditions = []

    if (keyword) {
      conditions.push(Prisma.sql`s."SkillName" ILIKE ${"%" + keyword + "%"}`)
    }

    if (topicId) {
      conditions.push(Prisma.sql`s."TopicId" = ${Number(topicId)}`)
    }

    const whereClause =
      conditions.length > 0
        ? Prisma.sql`WHERE ${Prisma.join(conditions, " AND ")}`
        : Prisma.sql``

    const data = await prisma.$queryRaw`
      SELECT 
        s."SkillId",
        s."SkillName",
        s."TopicId",
        t."TopicName",
        COUNT(CASE WHEN dl."LevelName" = 'Easy' THEN 1 END) AS "EasyCount",
        COUNT(CASE WHEN dl."LevelName" = 'Medium' THEN 1 END) AS "MediumCount",
        COUNT(CASE WHEN dl."LevelName" = 'Hard' THEN 1 END) AS "HardCount",
        COUNT(q."QuestionId") AS "TotalQuestions",
        COALESCE(CAST(AVG(asr."Accuracy") AS DECIMAL(5,2)), 0) AS "AvgAccuracy"
      FROM "Skills" s
      JOIN "Topics" t ON s."TopicId" = t."TopicId"
      LEFT JOIN "QuestionSkills" qs ON s."SkillId" = qs."SkillId"
      LEFT JOIN "Questions" q ON qs."QuestionId" = q."QuestionId"
      LEFT JOIN "DifficultyLevels" dl ON q."DifficultyId" = dl."DifficultyId"
      LEFT JOIN "AnalyticsSkillResults" asr ON s."SkillId" = asr."SkillId"
      ${whereClause}
      GROUP BY s."SkillId", s."SkillName", s."TopicId", t."TopicName"
      ORDER BY s."SkillId" DESC
      OFFSET ${offset}
      LIMIT ${pageSize}
    `

    const total = await prisma.$queryRaw`
      SELECT COUNT(*)::int AS "Total"
      FROM "Skills" s
      ${whereClause}
    `

    return {
      data,
      total: total[0]?.Total || 0
    }
  }
}

export default new SkillRepository()