import axiosClient from "./http.js";

class ClassService {
  async getAll(params = {}) {
    const res = await axiosClient.get("/classes", { params });
    return res.data;
  }

  async getById(id) {
    const res = await axiosClient.get(`/classes/${id}`);
    return res.data;
  }

async create() {
    try {
      // Dùng this để lấy dữ liệu từ class/store hiện tại
      const res = await axiosClient.post("/classes", { 
        className: this.className, 
        studentIds: this.studentIds 
      });
      return res.data;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  async update(id, data) {
    const res = await axiosClient.put(`/classes/${id}`, data);
    return res.data;
  }

  async delete(id) {
    const res = await axiosClient.delete(`/classes/${id}`);
    return res.data;
  }
}

export default new ClassService();