import { PrismaClient } from "@prisma/client"
import { PrismaMssql } from "@prisma/adapter-mssql"
import dotenv from "dotenv";

dotenv.config({ path: "../.env" });
const adapter = new PrismaMssql({
  server: process.env.DB_SERVER,
  port: Number(process.env.DB_PORT) || 1433,
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  options: {
    trustServerCertificate: true
  }
})

const prisma = new PrismaClient({
  adapter
})

export default prisma