import classRepository from "../repositories/classes.repository.js";
import studentRepository from "../repositories/student.repository.js";

class ClassService {

  /**
   * GET CLASS BY ID
   */
  async getClassById(id, options = {}) {
    if (!id) {
      throw new Error("ClassId is required");
    }

    const data = await classRepository.getById(Number(id), options);

    if (!data) {
      throw new Error("Class not found");
    }

    // Tùy chọn: Format lại dữ liệu nếu có Enrollments đi kèm
    if (data.Enrollments) {
      data.Students = data.Enrollments.map(enrollment => enrollment.Student);
      delete data.Enrollments; // Xóa key Enrollments cho gọn (nếu muốn)
    }

    return data;
  }

  /**
   * UPDATE CLASS
   */
  async updateClass(id, payload) {
    if (!id) {
      throw new Error("ClassId is required");
    }

    return classRepository.update(Number(id), payload);
  }

  /**
   * DELETE (SOFT)
   */
  async deleteClass(id) {
    if (!id) {
      throw new Error("ClassId is required");
    }

    return classRepository.softDelete(Number(id));
  }

  /**
   * GET ALL CLASSES (🔥 FLEXIBLE)
   */
  async getAllClasses(query) {
    const {
      page,
      pageSize,
      search,
      is_deleted,
      fromDate,
      toDate,
      sortBy,
      sortOrder,
      includeStudents,
    } = query;

    // 🎯 normalize params
    const params = {
      page: Number(page) > 0 ? Number(page) : 1,
      pageSize: Number(pageSize) > 0 ? Number(pageSize) : 10,
      search: search?.trim() || undefined,

      // convert string -> boolean
      is_deleted:
        is_deleted === "true"
          ? true
          : is_deleted === "false"
          ? false
          : undefined,

      fromDate: fromDate || undefined,
      toDate: toDate || undefined,

      sortBy: sortBy || "CreatedAt",
      sortOrder: sortOrder === "asc" ? "asc" : "desc",

      includeStudents: includeStudents === "true",
    };

    const result = await classRepository.getAllClasses(params);

    // Format lại dữ liệu mảng trả về từ Repository (biến Enrollments -> Students cho Frontend dễ đọc)
    if (params.includeStudents && result.data) {
      result.data = result.data.map(classItem => {
        if (classItem.Enrollments) {
          classItem.Students = classItem.Enrollments.map(e => e.Student);
          delete classItem.Enrollments;
        }
        return classItem;
      });
    }

    return result;
  }

  /**
   * CREATE CLASS
   */
  async createClass(className, studentIdentifiers = []) {
    // 1. Kiểm tra nghiệp vụ (Validation)
    if (!className || className.trim() === "") {
      throw new Error("Tên lớp học không được để trống.");
    }

    // 2. Logic phân loại đầu vào
    const rawStudentIds = studentIdentifiers.filter(item => typeof item === 'number');
    const studentEmails = studentIdentifiers.filter(item => typeof item === 'string');

    let validStudentIds = [];

    // 3. Nếu có dữ liệu học sinh truyền vào, gọi StudentRepo để lấy những học sinh TỒN TẠI & HỢP LỆ
    if (studentIdentifiers.length > 0) {
      const foundStudents = await studentRepository.findValidStudents(rawStudentIds, studentEmails);
      
      // Rút trích ra mảng chỉ chứa StudentId: [1, 5, 8]
      validStudentIds = foundStudents.map(student => student.StudentId);
    }

    // 4. Gọi ClassRepo để thực hiện hành động GHI vào database
    // (Nếu validStudentIds rỗng, lớp học vẫn được tạo nhưng chưa có thành viên)
    const newClass = await classRepository.createClassWithStudents(className, validStudentIds);

    // 5. Format lại dữ liệu trước khi trả về (Chuyển Enrollments thành Students)
    // Điều này giúp giữ nguyên cấu trúc Response cũ, Frontend không cần sửa code!
    if (newClass.Enrollments) {
      newClass.Students = newClass.Enrollments.map(enrollment => enrollment.Student);
      delete newClass.Enrollments; 
    }

    // 6. Trả về kết quả đã xử lý xong xuôi
    return newClass;
  }
}

export default new ClassService();