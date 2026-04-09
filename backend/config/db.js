import { PrismaClient } from "@prisma/client"
import { PrismaMssql } from "@prisma/adapter-mssql"

const adapter = new PrismaMssql({
  server: "localhost",
  port: 1433,
  database: "MathExamAnalytics",
  user: "sa",
  password: "123",
  options: {
    trustServerCertificate: true
  }
})

const prisma = new PrismaClient({
  adapter
})

export default prisma