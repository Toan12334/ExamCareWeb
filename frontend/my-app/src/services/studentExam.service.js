import axiosClient from "./http.js"

export const getListStudentExam = async (params = {}) => {
    const response = await axiosClient.get("/student-exam", {
      params
    });
  
    return response.data;
  };