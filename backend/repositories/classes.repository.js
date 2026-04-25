import prisma from "../config/db.js";
import { Prisma } from "@prisma/client";

class ClassRepository {
  /**
   * CREATE
   */
  async create(data) {
    return prisma.classes.create({
      data,
    });
  }

  /**
   * GET BY ID
   */
  async getById(id, options = {}) {
    return prisma.classes.findUnique({
      where: { ClassId: id },
      include: options.include || {
        Students: true,
      },
    });
  }

  /**
   * UPDATE
   */
  async update(id, data) {
    return prisma.classes.update({
      where: { ClassId: id },
      data,
    });
  }

  /**
   * SOFT DELETE
   */
  async softDelete(id) {
    return prisma.classes.update({
      where: { ClassId: id },
      data: {
        is_deleted: true,
      },
    });
  }

  /**
   * HARD DELETE (cẩn thận)
   */
  async hardDelete(id) {
    return prisma.classes.delete({
      where: { ClassId: id },
    });
  }

  /**
   * GET ALL - FLEXIBLE (🔥 quan trọng)
   */
  async getAllClasses(params = {}) {
    const {
      page = 1,
      pageSize = 10,
      search,
      is_deleted,
      fromDate,
      toDate,
      sortBy = "CreatedAt",
      sortOrder = "desc",
      includeStudents = false,
    } = params;
  
    const skip = (page - 1) * pageSize;
    const take = Number(pageSize);
  
    // WHERE
    const where = {
      AND: [
        typeof is_deleted === "boolean" ? { is_deleted } : {},
  
        search
          ? {
              ClassName: {
                contains: search,
                mode: "insensitive",
              },
            }
          : {},
  
        fromDate || toDate
          ? {
              CreatedAt: {
                ...(fromDate && { gte: new Date(fromDate) }),
                ...(toDate && { lte: new Date(toDate) }),
              },
            }
          : {},
      ],
    };
  
    const orderBy = {
      [sortBy]: sortOrder,
    };
  
    const [data, total] = await Promise.all([
      prisma.classes.findMany({
        where,
        skip,
        take,
        orderBy,
        include: {
          ...(includeStudents && {
            Students: {
              where: { is_deleted: false },
            },
          }),
  
          // 🔥 COUNT STUDENTS
          _count: {
            select: {
              Students: {
                where: { is_deleted: false }, // chỉ đếm student chưa xóa
              },
            },
          },
        },
      }),
  
      prisma.classes.count({ where }),
    ]);
  
    // 🔥 Format lại cho đẹp (optional)
    const formattedData = data.map((item) => ({
      ...item,
      studentCount: item._count.Students,
      _count: undefined, // nếu không muốn trả về _count
    }));
  
    return {
      data: formattedData,
      pagination: {
        page,
        pageSize,
        total,
        totalPages: Math.ceil(total / pageSize),
      },
    };
  }
}

export default new ClassRepository();