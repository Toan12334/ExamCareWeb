// controllers/questionType.controller.js
import questionTypeService from "../services/questionType.service.js";

class QuestionTypeController {
    // Sử dụng arrow function để tránh mất ngữ cảnh 'this' nếu cần
    getAll = async (req, res) => {
        try {
            const result = await questionTypeService.getAllQuestionTypes();
            res.status(200).json(result);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    getById = async (req, res) => {
        try {
            const result = await questionTypeService.getQuestionTypeById(req.params.id);
            res.status(200).json(result);
        } catch (error) {
            res.status(404).json({ error: error.message });
        }
    }

    create = async (req, res) => {
        try {
            const result = await questionTypeService.createQuestionType(req.body);
            res.status(201).json(result);
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }

    update = async (req, res) => {
        try {
            const result = await questionTypeService.updateQuestionType(req.params.id, req.body);
            res.status(200).json(result);
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }

    delete = async (req, res) => {
        try {
            await questionTypeService.deleteQuestionType(req.params.id);
            res.status(200).json({ message: "Xóa thành công!" });
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }
}

export default new QuestionTypeController();