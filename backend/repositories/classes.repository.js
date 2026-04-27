import prisma from "../config/db.js";
import { Prisma } from "@prisma/client";

class ClassRepository {

  /**
   * GET BY ID
   */
  async getById(id, options = {}) {
    return prisma.classes.findUnique({
      where: { ClassId: id },
      include: options.include || {
        // Đi qua bảng trung gian Enrollment để lấy thông tin Student
        Enrollments: {
          include: {
            Student: true
          }
        },
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
    // Lưu ý: Vì có bảng trung gian, nên xóa dữ liệu ở Enrollment trước
    // để tránh lỗi Foreign Key Constraint, sau đó mới xóa Class.
    return prisma.$transaction([
      prisma.enrollment.deleteMany({
        where: { ClassId: id }
      }),
      prisma.classes.delete({
        where: { ClassId: id },
      })
    ]);
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
          // Lấy danh sách học sinh thông qua Enrollments
          ...(includeStudents && {
            Enrollments: {
              where: { 
                Student: { is_deleted: false },
                // Có thể thêm điều kiện Status: 'active' nếu cần
                // Status: 'active' 
              },
              include: {
                Student: true // Kéo dữ liệu bảng Students
              }
            },
          }),

          // 🔥 COUNT STUDENTS thông qua bảng Enrollments
          _count: {
            select: {
              Enrollments: {
                where: { 
                  Student: { is_deleted: false }, // Chỉ đếm student chưa xóa
                  // Status: 'active' // Có thể mở comment nếu chỉ muốn đếm học sinh đang active
                }, 
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
      // Map từ item._count.Enrollments thay vì item._count.Students
      studentCount: item._count.Enrollments,
      _count: undefined, // Xóa object _count khỏi response cho gọn
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

  /**
   * CREATE CLASS WITH STUDENTS
   */
  async createClassWithStudents(className, validStudentIds = []) {
    // Chuyển mảng ID thành data để tạo bản ghi trong bảng trung gian Enrollment
    const enrollmentsData = validStudentIds.map(id => ({ 
      StudentId: id,
      Status: 'active' // Có thể set default hoặc truyền từ ngoài vào
    }));

    return await prisma.classes.create({
      data: {
        ClassName: className,
        Enrollments: {
          create: enrollmentsData // Dùng 'create' thay vì 'connect'
        }
      },
      include: {
        // Trả về kèm thông tin học sinh vừa thêm
        Enrollments: {
          include: {
            Student: true
          }
        }
      }
    });
  }
}

export default new ClassRepository();