import prisma from "../config/db.js"
import bcrypt from "bcrypt"

class StudentRepository {

  async findValidStudents(studentIds = [], studentEmails = []) {
    return await prisma.students.findMany({
      where: {
        is_deleted: false,
        OR: [
          { StudentId: { in: studentIds } },
          { Email: { in: studentEmails } }
        ]
      },
      select: { StudentId: true }
    });
  }

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
    if(data.Password) {
      const salt = await bcrypt.genSalt(10)
      data.Password = await bcrypt.hash(data.Password, salt)
    }
    return await prisma.students.create({
      data: {
        FullName: data.FullName,
        Email: data.Email,
        Password: data.Password
      }
    })
  }

  // update student
  async update(id, data) {
    const salt = await bcrypt.genSalt(10)
    data.Password = await bcrypt.hash(data.Password, salt)
    return await prisma.students.update({
      where: {
        StudentId: id
      },
      data: {
        FullName: data.FullName,
        Email: data.Email,
        Password: data.Password
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
        is_deleted: false,
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
      const student = await prisma.students.findFirst({
        where: {
          Email: email,
          is_deleted: false,
        },
      });
      return student;
    } catch (error) {
      console.error("Error in StudentRepository.findByEmail:", error.message);
      throw error;
    }
  }





}

export default new StudentRepository()