import studentRepository from "../repositories/student.repository.js"

class StudentService {

  async getStudents() {
    return await studentRepository.getAll()
  }

  async getStudent(id) {
    return await studentRepository.getById(id)
  }

  async createStudent(data) {

    const existedStudent = await studentRepository.getByEmail(data.Email)


    if (existedStudent) {
      throw new Error("Email already exists")
    }


    return await studentRepository.create(data)
  }

  async updateStudent(id, data) {

    const existedStudent = await studentRepository.getByEmail(data.Email)

    if (existedStudent && existedStudent.StudentId !== id) {
      throw new Error("Email already exists")
    }

    return await studentRepository.update(id, data)
  }

  async deleteStudent(id) {
    return await studentRepository.delete(id)
  }

  async searchStudents(keyword) {
    return await studentRepository.search(keyword)
  }

}


export default new StudentService()