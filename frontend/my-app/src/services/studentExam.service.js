import axiosClient from "./http.js"

export const getListStudentExam = async (params = {}) => {
    const response = await axiosClient.get("/student-exam", {
      params
    });
  
    return response.data;
  };


  export const getStudentExamDetail = async (studentId, studentExamId) => {
    const response = await axiosClient.get(
      `/student-exam/detail/${studentId}/${studentExamId}`
    );
  
    return response.data;
  };