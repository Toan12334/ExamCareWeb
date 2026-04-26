import { useEffect, useState, useCallback } from "react"
import { getStudent, insertStudent, getStudentById ,updateStudent,deleteStudentById,searchStudentByNameOrEmail} from "../services/student.service.js"

export default function useStudent() {

  const [students, setStudents] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const fetchStudents = useCallback(async () => {
    try {
      setLoading(true)
      const res = await getStudent()
      setStudents(res)
    } catch (err) {
      setError(err)
    } finally {
      setLoading(false)
    }
  }, [])

  const createStudent = async (data) => {
    try {
      setLoading(true)
      await insertStudent(data)
      await fetchStudents()
    } catch (err) {
      setError(err.response?.data?.message || err.message)
      throw err   // QUAN TRỌNG
    } finally {
      setLoading(false)
    }
  }
  const updateStudentId = async (id, data) => {
    try {
      setLoading(true)
      await updateStudent(id, data)
      await fetchStudents()
    } catch (err) {
      setError(err.response?.data?.message || err.message)
      throw err   // QUAN TRỌNG
    } finally {
      setLoading(false)
    }
  }

  const getStudentId = async (id) => {
    try {
      const result = await getStudentById(id)
      return result
    } catch (err) {
      setError(err)
    }
  }

  const deleteStudent =async (id)=>{
    try {
      const result =await deleteStudentById(id)
      await fetchStudents()
      if(result){
        console.log("delete ok")
      }
    } catch (err) {
      console.log(err)
    }
  }
  const searchStudent = async (keyword) => {
    try {
      const result = await searchStudentByNameOrEmail(keyword)
      setStudents(result)
  
      if (result) {
        console.log(`data student search ${result}`)
      }
  
    } catch (error) {
      console.log(error)
    }
  }


  useEffect(() => {
    fetchStudents()
  }, [fetchStudents])

  return {
    students,
    loading,
    error,
    fetchStudents,
    createStudent,
    getStudentId,updateStudentId,deleteStudent,searchStudent
  }
}