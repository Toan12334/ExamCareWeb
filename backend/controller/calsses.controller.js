import classService from "../services/classes.service.js";

class ClassController {
  /**
   * CREATE
   * POST /api/classes
   */
  async createClass(req, res) {
    try {
      const data = await classService.createClass(req.body);

      return res.status(201).json({
        message: "Create class successfully",
        data,
      });
    } catch (error) {
      return res.status(400).json({
        message: error.message,
      });
    }
  }

  /**
   * GET ALL (🔥 flexible)
   * GET /api/classes
   */
  async getAllClasses(req, res) {
    try {
      const result = await classService.getAllClasses(req.query);

      return res.status(200).json({
        message: "Get classes successfully",
        ...result,
      });
    } catch (error) {
      return res.status(400).json({
        message: error.message,
      });
    }
  }

  /**
   * GET BY ID
   * GET /api/classes/:id
   */
  async getClassById(req, res) {
    try {
      const { id } = req.params;

      const data = await classService.getClassById(id, {
        include: {
          Students: {
            where: { is_deleted: false },
          },
        },
      });

      return res.status(200).json({
        message: "Get class successfully",
        data,
      });
    } catch (error) {
      return res.status(404).json({
        message: error.message,
      });
    }
  }

  /**
   * UPDATE
   * PUT /api/classes/:id
   */
  async updateClass(req, res) {
    try {
      const { id } = req.params;

      const data = await classService.updateClass(id, req.body);

      return res.status(200).json({
        message: "Update class successfully",
        data,
      });
    } catch (error) {
      return res.status(400).json({
        message: error.message,
      });
    }
  }

  /**
   * DELETE (SOFT)
   * DELETE /api/classes/:id
   */
  async deleteClass(req, res) {
    try {
      const { id } = req.params;

      await classService.deleteClass(id);

      return res.status(200).json({
        message: "Delete class successfully",
      });
    } catch (error) {
      return res.status(400).json({
        message: error.message,
      });
    }
  }
}

export default new ClassController();