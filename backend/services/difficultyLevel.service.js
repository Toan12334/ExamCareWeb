// services/difficultyLevel.service.js
import difficultyLevelRepository from "../repositories/difficultyLevel.repository.js";

class DifficultyLevelService {
    async getAllDifficultyLevels() {
        return await difficultyLevelRepository.findAll();
    }

    async getDifficultyLevelById(id) {
        const level = await difficultyLevelRepository.findById(id);
        if (!level) {
            throw new Error(`Mức độ khó với ID ${id} không tồn tại`);
        }
        return level;
    }

    async createDifficultyLevel(data) {
        if (!data.LevelName) {
            throw new Error("Tên mức độ khó (LevelName) là bắt buộc");
        }
        return await difficultyLevelRepository.create(data);
    }

    async updateDifficultyLevel(id, data) {
        await this.getDifficultyLevelById(id); // Kiểm tra tồn tại trước
        return await difficultyLevelRepository.update(id, data);
    }

    async deleteDifficultyLevel(id) {
        await this.getDifficultyLevelById(id);
        return await difficultyLevelRepository.delete(id);
    }
}

export default new DifficultyLevelService();