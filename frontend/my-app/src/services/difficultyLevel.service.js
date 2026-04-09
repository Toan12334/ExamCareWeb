import axiosClient from "./http.js"

export const getAllDifficultLevel =async ()=>{
    const getAll= await axiosClient.get("/difficulty-level");
    return getAll.data
}