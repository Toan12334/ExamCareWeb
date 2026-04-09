import axiosClient from "./http.js";

// CREATE
export const createExam = async (body) => {
  const result = await axiosClient.post("/exams", body);
  return result.data;
};

// GET ALL (pagination + search)
export const getAllExams = async (params = {}) => {
  const { page = 1, limit = 10, search = "" } = params;

  const result = await axiosClient.get("/exams", {
    params: {
      page,
      limit,
      search,
    },
  });

  return result.data;
};

// GET BY ID
export const getExamDetailById = async (id) => {
  const result = await axiosClient.get(`/exams/${id}`);
  return result.data;
};

// UPDATE
export const updateExam = async (id, data) => {
  const result = await axiosClient.put(`/exams/${id}`, data);
  return result.data;
};

// DELETE
export const deleteExam = async (id) => {
  const result = await axiosClient.delete(`/exams/${id}`);
  return result.data;
};

// UPDATE STATUS (toggle active)
export const updateExamStatus = async (id, isActive) => {
  const result = await axiosClient.patch(`/exams/${id}/status`, {
    isActive,
  });
  return result.data;
};