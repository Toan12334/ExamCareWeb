import studentService from "../services/student.service.js"

class StudentController {

  async getStudents(req, res) {
    try {
      const students = await studentService.getStudents()
      res.status(200).json(students)
    } catch (error) {
      res.status(500).json({ message: error.message })
    }
  }

  async getStudent(req, res) {
    try {
      const { id } = req.params
      const student = await studentService.getStudent(Number(id))

      if (!student) {
        return res.status(404).json({ message: "Student not found" })
      }

      res.status(200).json(student)
    } catch (error) {
      res.status(500).json({ message: error.message })
    }
  }

  async createStudent(req, res) {
    try {

      const data = req.body
      const student = await studentService.createStudent(data)

      res.status(201).json(student)

    } catch (error) {

      res.status(400).json({
        message: error.message
      })

    }
  }

  async updateStudent(req, res) {
    try {
      const { id } = req.params
      const data = req.body

      const student = await studentService.updateStudent(Number(id), data)
      res.status(200).json(student)
    } catch (error) {
      res.status(500).json({ message: error.message })
    }
  }

  async deleteStudent(req, res) {
    try {
      const { id } = req.params

      await studentService.deleteStudent(id)
      res.status(200).json({ message: "Student deleted successfully" })
    } catch (error) {
      res.status(500).json({ message: error.message })
    }
  }

  async searchStudents(req, res) {
    const { keyword } = req.query
    const students = await studentService.searchStudents(keyword)
    res.json(students)
  }

}

export default new StudentController()