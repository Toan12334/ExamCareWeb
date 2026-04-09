import axiosClient from "./http.js"

export const getStudent=async()=>{
   const result = await axiosClient.get("/students/")
   return result.data
}

export const insertStudent = async (data) => {
   const result = await axiosClient.post("/students", data)
   return result
}

export const getStudentById =async (id)=>{
   const result =await axiosClient.get(`/students/${id}`)
   return result.data
}
export const updateStudent = async (id,data)=>{
   const result = await axiosClient.put(`/students/${id}`,data)
   return result
}
export const deleteStudentById = async (id) => {
   return await axiosClient.patch(`/students/${id}`, {
     is_deleted: true
   })
 }
export const searchStudentByNameOrEmail = async (keyword) => {
   const result = await axiosClient.get("students/search", {
     params: {
       keyword: keyword
     }
   })
 
   return result.data
 }