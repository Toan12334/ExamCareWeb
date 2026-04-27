import classService from "../services/classes.service.js";

class ClassController {
  /**
   * CREATE
   * POST /api/classes
   */
  async createClass(req, res) {
    try {
      // Nhận payload từ client (tương thích với logic trong Service)
      const { className, studentIds } = req.body; 

      // Gọi Service xử lý logic
      const newClass = await classService.createClass(className, studentIds);

      // Trả về response chuẩn
      return res.status(201).json({
        success: true,
        message: "Tạo lớp học thành công!",
        data: newClass
      });

    } catch (error) {
      console.error("Lỗi Controller (createClass):", error.message);
      
      return res.status(400).json({ 
        success: false, 
        message: error.message || "Đã xảy ra lỗi khi tạo lớp học." 
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

      // 🔥 ĐIỂM SỬA QUAN TRỌNG: 
      // Phải include thông qua Enrollments thay vì Students trực tiếp
      const data = await classService.getClassById(id, {
        include: {
          Enrollments: {
            where: {
              Student: { is_deleted: false }, // Chỉ lấy học sinh chưa bị xóa mềm
            },
            include: {
              Student: true, // Kéo thông tin học sinh ra
            },
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