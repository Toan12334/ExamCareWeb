import prisma from "../config/db.js"

class StudentRepository {

  // lấy tất cả students
  async getAll() {
    return await prisma.students.findMany({
      where: { is_deleted: false }
    })
  }

  // lấy student theo id
  async getById(id) {
    return await prisma.students.findUnique({
      where: {
        StudentId: id
      }
    })
  }

  // tạo student
  async create(data) {
    return await prisma.students.create({
      data: {
        FullName: data.FullName,
        Email: data.Email
      }
    })
  }

  // update student
  async update(id, data) {
    return await prisma.students.update({
      where: {
        StudentId: id
      },
      data: {
        FullName: data.FullName,
        Email: data.Email
      }
    })
  }

  // xóa student
  async delete(id) {
    return await prisma.students.update({
      where: {
        StudentId: Number(id)
      },
      data: {
        is_deleted: true
      }
    })
  }
  // tìm theo email
  async getByEmail(email) {
    return await prisma.students.findFirst({
      where: {
        Email: email,
        is_deleted: false
      }
    })
  }

  async search(keyword) {
    return await prisma.students.findMany({
      where: {
        OR: [
          {
            FullName: {
              contains: keyword
            }
          },
          {
            Email: {
              contains: keyword
            }
          }
        ]
      }
    })
  }

  async findByEmail(email) {
    try {
      const student = await this.prisma.student.findUnique({
        where: { Email: email },
      });
      return student;
    } catch (error) {
      console.error('Error in StudentRepository.findByEmail:', error.message);
      throw error;
    }
  }





}

export default new StudentRepository()