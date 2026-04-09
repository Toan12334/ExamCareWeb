// services/questionType.service.js
import questionTypeRepository from "../repositories/questionType.repository.js";

class QuestionTypeService {
    async getAllQuestionTypes() {
        return await questionTypeRepository.findAll();
    }

    async getQuestionTypeById(id) {
        const type = await questionTypeRepository.findById(id);
        if (!type) {
            throw new Error(`Không tìm thấy Question Type với ID: ${id}`);
        }
        return type;
    }

    async createQuestionType(data) {
        if (!data.TypeName || data.TypeName.trim() === "") {
            throw new Error("Tên loại câu hỏi không được để trống");
        }
        return await questionTypeRepository.create(data);
    }

    async updateQuestionType(id, data) {
        await this.getQuestionTypeById(id); // Kiểm tra xem có tồn tại không
        return await questionTypeRepository.update(id, data);
    }

    async deleteQuestionType(id) {
        await this.getQuestionTypeById(id);
        return await questionTypeRepository.delete(id);
    }
}

export default new QuestionTypeService();