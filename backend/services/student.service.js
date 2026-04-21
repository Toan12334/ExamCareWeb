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


  async login(email, password) {
    try {
      // Tìm sinh viên theo email
      const student = await studentRepository.findByEmail(email);

      // Nếu không tìm thấy sinh viên, trả về null
      if (!student) {
        return null;
      }

      // Kiểm tra mật khẩu
      const isPasswordValid = await bcrypt.compare(password, student.Password);
      if (!isPasswordValid) {
        return null;
      }

      // Trả về thông tin sinh viên nếu đăng nhập thành công
      return student;
    } catch (error) {
      console.error('Error in StudentService.login:', error.message);
      throw error;
    }
  }

}


export default new StudentService()