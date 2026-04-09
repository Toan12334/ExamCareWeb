import {getAllQuestionType} from "../services/questionType.service.js"

export default function useQuestionType(){

const getAllTypeQuestion = async ()=>{
    const result =await getAllQuestionType();
    return result
}
return {
    getAllTypeQuestion
}
}

