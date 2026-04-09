import axiosClient from "./http.js"

export const getSkillOverview = async () => {
    const result = await axiosClient.get("/skills/overview");
    return result.data
}

export const getAllSkill  = async () => {
    const result = await axiosClient.get("/skills/");
    return result.data
}

export const searchSkillData = async ({ keyword = "", topicId, page = 1, pageSize = 10 } = {}) => {
    try {
        const params = { keyword, topicId, page, pageSize }
        Object.keys(params).forEach(key => params[key] === undefined && delete params[key])
        const result = await axiosClient.get("skills/search/filter", { params })
        return result.data
    } catch (error) {
        console.error("Error fetching skills:", error)
        return null
    }
}

export const createSkill =async (data)=>{
    const result =await axiosClient.post("/skills/",data)
    return result
    
}
export const getSkillById =async (id)=>{
    const result =await axiosClient.get(`/skills/${id}`)
    return result.data
}

export const updateSkillData=async (id,data)=>{
    const result =await axiosClient.put(`/skills/${id}`,data)
    return result.data
}

export const deleteSkill =async  (id)=>{
    const result  =await axiosClient.delete(`/skills/${id}`);
    return result.data

}


    