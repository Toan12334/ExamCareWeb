import prisma from "../config/db.js"
import { Prisma } from "@prisma/client"
class SkillRepository {

  async getSkillsOverview({ page = 1, pageSize = 10 }) {
    const offset = (page - 1) * pageSize

    const [data, total] = await Promise.all([
      prisma.$queryRaw`
        SELECT 
            s.SkillId,
            s.SkillName,
            s.TopicId,
            t.TopicName,
            COUNT(CASE WHEN dl.LevelName = N'Easy' THEN 1 END) AS EasyCount,
            COUNT(CASE WHEN dl.LevelName = N'Medium' THEN 1 END) AS MediumCount,
            COUNT(CASE WHEN dl.LevelName = N'Hard' THEN 1 END) AS HardCount,
            COUNT(q.QuestionId) AS TotalQuestions,
            ISNULL(CAST(AVG(asr.Accuracy) AS DECIMAL(5, 2)), 0) AS AvgAccuracy
        FROM Skills s
        JOIN Topics t ON s.TopicId = t.TopicId
        LEFT JOIN QuestionSkills qs ON s.SkillId = qs.SkillId
        LEFT JOIN Questions q ON qs.QuestionId = q.QuestionId
        LEFT JOIN DifficultyLevels dl ON q.DifficultyId = dl.DifficultyId
        LEFT JOIN AnalyticsSkillResults asr ON s.SkillId = asr.SkillId
        GROUP BY s.SkillId, s.SkillName, s.TopicId, t.TopicName
        ORDER BY t.TopicName, s.SkillName
        OFFSET ${offset} ROWS FETCH NEXT ${pageSize} ROWS ONLY
      `,
      prisma.$queryRaw`SELECT COUNT(*) as Total FROM Skills`
    ])

    return {
      data,
      total: Number(total[0].Total)
    }
  }

  async getAll() {
    return prisma.skills.findMany({
      include: { Topics: true },
      orderBy: { SkillName: "asc" }
    })
  }

  async getById(id) {
    return prisma.skills.findUnique({
      where: { SkillId: Number(id) }
    })
  }


  async create(data) {
    return prisma.skills.create({
      data: {
        SkillName: data.SkillName,
        TopicId: Number(data.TopicId)
      }
    })
  }


    async update(id, data) {
      return prisma.skills.update({
        where: { SkillId: Number(id) },
        data: {
          SkillName: data.SkillName,
          TopicId: Number(data.TopicId)
        }
      })
    }


  async delete(id) {
    return prisma.skills.delete({
      where: { SkillId: Number(id) }
    })
  }


  async searchByName(keyword) {
    return prisma.skills.findMany({
      where: {
        SkillName: {
          contains: keyword
        }
      },
      include: { Topics: true }
    })
  }


  async filterByTopic(topicId) {
    return prisma.skills.findMany({
      where: { TopicId: Number(topicId) },
      include: { Topics: true }
    })
  }


  async searchAndFilter({ keyword = "", topicId, page = 1, pageSize = 10 }) {
    const offset = (page - 1) * pageSize

    const conditions = [Prisma.sql`1=1`]

    if (keyword?.trim()) {
      conditions.push(
        Prisma.sql`s.SkillName LIKE ${`%${keyword.trim()}%`}`
      )
    }

    if (topicId && !isNaN(Number(topicId))) {
      conditions.push(
        Prisma.sql`s.TopicId = ${Number(topicId)}`
      )
    }

    const whereClause = Prisma.sql`WHERE ${Prisma.join(conditions, " AND ")}`

    const data = await prisma.$queryRaw`
      SELECT 
          s.SkillId,
          s.SkillName,
          s.TopicId,
          t.TopicName,
          COUNT(CASE WHEN dl.LevelName = N'Easy' THEN 1 END) AS EasyCount,
          COUNT(CASE WHEN dl.LevelName = N'Medium' THEN 1 END) AS MediumCount,
          COUNT(CASE WHEN dl.LevelName = N'Hard' THEN 1 END) AS HardCount,
          COUNT(q.QuestionId) AS TotalQuestions,
          ISNULL(CAST(AVG(asr.Accuracy) AS DECIMAL(5, 2)), 0) AS AvgAccuracy
      FROM Skills s
      JOIN Topics t ON s.TopicId = t.TopicId
      LEFT JOIN QuestionSkills qs ON s.SkillId = qs.SkillId
      LEFT JOIN Questions q ON qs.QuestionId = q.QuestionId
      LEFT JOIN DifficultyLevels dl ON q.DifficultyId = dl.DifficultyId
      LEFT JOIN AnalyticsSkillResults asr ON s.SkillId = asr.SkillId
      ${whereClause}
      GROUP BY s.SkillId, s.SkillName, s.TopicId, t.TopicName
      ORDER BY s.SkillId DESC
      OFFSET ${offset} ROWS FETCH NEXT ${pageSize} ROWS ONLY
    `

    const total = await prisma.$queryRaw`
      SELECT COUNT(*) as Total
      FROM Skills s
      ${whereClause}
    `

    return {
      data: Array.isArray(data) ? data : [],
      total: Number(total?.[0]?.Total || 0)
    }
  }
}
export default new SkillRepository()