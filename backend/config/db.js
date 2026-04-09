import { PrismaClient } from "@prisma/client";

// Khi dùng PostgreSQL trên Render/Supabase, Prisma sẽ tự động đọc biến DATABASE_URL 
// từ hệ thống nên bạn không cần dùng Adapter hay khai báo port, password thủ công nữa.
const prisma = new PrismaClient();

export default prisma;