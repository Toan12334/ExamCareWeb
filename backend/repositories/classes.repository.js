import prisma from "../config/db.js";
import { Prisma } from "@prisma/client";

class ClassRepository {

  /**
   * GET BY ID
   */
async getById(id, options = {}) {
  return prisma.classes.findFirst({
    where: { 
      ClassId: id 
    },
    include: options.include || {
      Enrollments: {
        include: {
          Student: true
        }
      }
    }
  });
}

  /**
   * UPDATE
   */
  async update(id, data) {
  const { className, studentIds } = data;

  return prisma.classes.update({
    where: { 
      ClassId: id 
    },
    data: {
      // 1. Cập nhật tên lớp (nhớ dùng đúng ClassName như trong Schema)
      ClassName: className, 

      // 2. Cập nhật danh sách sinh viên trong bảng trung gian Enrollment
      Enrollments: {
        // Xóa tất cả các liên kết cũ của lớp này trong bảng Enrollment
        deleteMany: {}, 
        
        // Thêm các liên kết mới dựa trên danh sách studentIds gửi lên
        create: studentIds.map((sId) => ({
          Student: {
            connect: { StudentId: sId }
          }
        })),
      },
    },
    // Trả về kèm theo danh sách Enrollment sau khi update để kiểm tra
    include: {
      Enrollments: true,
    },
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
    // Mặc định là false để luôn lấy dữ liệu chưa xóa trừ khi có yêu cầu khác
    is_deleted = false,
    fromDate,
    toDate,
    sortBy = "CreatedAt",
    sortOrder = "desc",
    includeStudents = false,
  } = params;

  const skip = (page - 1) * pageSize;
  const take = Number(pageSize);

  // Xây dựng điều kiện WHERE
  const where = {
    // Luôn lọc theo trạng thái xóa
    is_deleted: typeof is_deleted === "boolean" ? is_deleted : false,
  };

  // Nếu có tìm kiếm, thêm vào điều kiện (Prisma tự hiểu là AND khi thêm key)
  if (search) {
    where.ClassName = {
      contains: search,
      mode: "insensitive",
    };
  }

  // Lọc theo ngày tháng
  if (fromDate || toDate) {
    where.CreatedAt = {
      ...(fromDate && { gte: new Date(fromDate) }),
      ...(toDate && { lte: new Date(toDate) }),
    };
  }

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
        // Lấy danh sách học sinh (Enrollments)
        ...(includeStudents && {
          Enrollments: {
            where: { 
              Student: { is_deleted: false }, // Chỉ lấy học sinh chưa bị xóa
            },
            include: {
              Student: true
            }
          },
        }),

        // Đếm số lượng học sinh trong lớp
        _count: {
          select: {
            Enrollments: {
              where: { 
                Student: { is_deleted: false },
              }, 
            },
          },
        },
      },
    }),

    prisma.classes.count({ where }),
  ]);

  // Format dữ liệu trả về
  const formattedData = data.map((item) => ({
    ...item,
    studentCount: item._count?.Enrollments || 0,
    _count: undefined, 
  }));

  return {
    data: formattedData,
    pagination: {
      page: Number(page),
      pageSize: Number(pageSize),
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