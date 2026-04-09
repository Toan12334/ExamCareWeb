import axiosClient from "./http.js"


export const getTopics = async () => {
  const result = await axiosClient.get("/topics")
  return result.data
}


export const getTopicById = async (id) => {
  const result = await axiosClient.get(`/topics/${id}`)
  return result.data
}


export const getTopicsWithQuestionCount = async () => {
  const result = await axiosClient.get("/topics/count")
  return result.data
}


export const insertTopic = async (data) => {
  const result = await axiosClient.post("/topics", data)
  return result.data
}


export const updateTopic = async (id, data) => {
  const result = await axiosClient.put(`/topics/${id}`, data)
  return result.data
}


export const deleteTopicById = async (id) => {
  const result = await axiosClient.delete(`/topics/${id}`)
  return result.data
}
export const searchTopic = async (keyword) => {
  const result = await axiosClient.get("/topics/search", {
    params: { keyword }
  })
  return result.data
}