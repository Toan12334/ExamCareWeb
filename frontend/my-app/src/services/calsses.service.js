import axiosClient from "./http.js";

class ClassService {
  async getAll(params = {}) {
    const res = await axiosClient.get("/classes", { params });
    return res.data;
  }

  async getById(id) {
    const res = await axiosClient.get(`/classes/${id}`);
    console.log("Response from getById:", res);
    return res.data;
  }

async create(data) { 
    // Truyền thẳng data vào body của request
    const res = await axiosClient.post("/classes", data); 
    return res.data;
  }

  async update(id, data) {
    const res = await axiosClient.put(`/classes/${id}`, data);
    return res.data;
  }

  async deleteSoft(id) {
    const res = await axiosClient.patch(`/classes/${id}`);
    return res.data;
  }
}

export default new ClassService();