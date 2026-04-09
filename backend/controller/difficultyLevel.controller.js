// controllers/difficultyLevel.controller.js
import difficultyLevelService from "../services/difficultyLevel.service.js";

class DifficultyLevelController {
    getAll = async (req, res) => {
        try {
            const levels = await difficultyLevelService.getAllDifficultyLevels();
            res.status(200).json(levels);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    getById = async (req, res) => {
        try {
            const level = await difficultyLevelService.getDifficultyLevelById(req.params.id);
            res.status(200).json(level);
        } catch (error) {
            res.status(404).json({ error: error.message });
        }
    }

    create = async (req, res) => {
        try {
            const newLevel = await difficultyLevelService.createDifficultyLevel(req.body);
            res.status(201).json(newLevel);
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }

    update = async (req, res) => {
        try {
            const updated = await difficultyLevelService.updateDifficultyLevel(req.params.id, req.body);
            res.status(200).json(updated);
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }

    delete = async (req, res) => {
        try {
            await difficultyLevelService.deleteDifficultyLevel(req.params.id);
            res.status(200).json({ message: "Xóa mức độ khó thành công" });
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }
}

export default new DifficultyLevelController();