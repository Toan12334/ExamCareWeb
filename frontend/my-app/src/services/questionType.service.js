import axiosClient from "./http.js"

export const getAllQuestionType =async ()=>{
    const getAll= await axiosClient.get("/question-type/");
    return getAll.data
}