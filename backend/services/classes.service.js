import classRepository from "../repositories/classes.repository.js";

class ClassService {
  /**
   * CREATE CLASS
   */
  async createClass(payload) {
    if (!payload?.ClassName) {
      throw new Error("ClassName is required");
    }

    return classRepository.create({
      ClassName: payload.ClassName,
    });
  }

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

    return classRepository.getAllClasses(params);
  }
}

export default new ClassService();