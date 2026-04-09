import { useEffect, useState } from "react"
import {
  getTopics,
  getTopicById,
  getTopicsWithQuestionCount,
  insertTopic,
  updateTopic,
  deleteTopicById,searchTopic
} from "../services/topic.service.js"

export default function useTopic() {

  const [topics, setTopics] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const fetchTopics = async () => {
    try {
      setLoading(true)
      const data = await getTopics()
      setTopics(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const fetchTopicsWithCount = async () => {
    try {
      setLoading(true)
      const data = await getTopicsWithQuestionCount()
      setTopics(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const createTopic = async (data) => {
    await insertTopic(data)
    await fetchTopicsWithCount()
  }

  const getTopic = async (id) => {
    return await getTopicById(id)
  }

  const getAllTopic =async ()=>{
    const result =await  getTopics()
    setTopics(result)
    return result  ;
  }

  const editTopic = async (id, data) => {
    await updateTopic(id, data)
    await fetchTopicsWithCount()
  }

  const deleteTopic = async (id) => {
    await deleteTopicById(id)
    await fetchTopics()
  }
  const searchData =async (keyword)=>{
    const result = await searchTopic(keyword)
    setTopics(result)
  
  } 

  useEffect(() => {
    fetchTopicsWithCount();
  }, [])

  return {
    topics,
    loading,
    error,
    fetchTopics,
    fetchTopicsWithCount,
    createTopic,
    getTopic,
    editTopic,
    deleteTopic,searchData,getAllTopic
  }
}