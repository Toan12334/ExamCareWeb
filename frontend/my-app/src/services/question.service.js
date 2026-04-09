import axiosClient from "./http.js"
export const getQuestions = async (params = {}) => {
  const result = await axiosClient.get("/questions", {
    params: {
      keyword: params.keyword || "",
      topicId: params.TopicId,
      difficultyId: params.DifficultyId,
      typeId: params.TypeId,
      skillId: params.SkillId,
      page: params.page || 1,
      pageSize: params.pageSize || 10
    }
  })

  return result.data
}

export const create = async (body) => {
  const result = await axiosClient.post("/questions", body);
  return result.data
}

export const getQuestionById = async (id) => {
  const result = await axiosClient.get(`/questions/${id}`)
  return result.data
}
export const updateQuestion = async (id, data) => {
  const result = await axiosClient.put(`questions/${id}`, data)
  console.log(result.data)
  return result.data
}
export const deleteQuestion = async (id) => {
  const result = await axiosClient.delete(`questions/${id}`);
  return result.data
}

export const getQuestionAnalyst = async (id) => {
  const result = await axiosClient.get(`questions/${id}/analytics`);
  return result.data
}