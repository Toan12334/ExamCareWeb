import { useEffect, useState, useCallback } from "react";
import { searchSkillData,createSkill,getSkillById,updateSkillData,deleteSkill } from "../services/skill.service.js";

export default function useSkill() {
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Lưu trữ cả pagination và filters để dùng chung
  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    pageSize: 10,
    totalPages: 1
  });

  const [filters, setFilters] = useState({
    keyword: "",
    topicId: null
  });

  // Hàm gọi API dùng chung cho cả load mới, tìm kiếm và chuyển trang
  const fetchSkillsData = useCallback(async (searchParams = {}, pageNum = 1) => {
    try {
      setLoading(true);
      setError(null);

      // Ưu tiên dùng searchSkillData để xử lý được cả lọc và phân trang
      const res = await searchSkillData({
        keyword: searchParams.keyword || "",
        topicId: searchParams.topicId || null,
        page: pageNum,
        pageSize: pagination.pageSize
      });

      setSkills(res?.data || []);
      setPagination(prev => ({
        ...prev,
        total: res.total || 0,
        page: res.page || pageNum,
        totalPages: res.totalPages || 1
      }));
    } catch (err) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  }, [pagination.pageSize]);

  // Load dữ liệu lần đầu
  useEffect(() => {
    fetchSkillsData();
  }, [fetchSkillsData]);

  // Hàm xử lý khi nhấn nút Tìm kiếm
  const searchSkill = async ({ keyword = "", topicId = null }) => {
    setFilters({ keyword, topicId }); // Lưu filter lại
    await fetchSkillsData({ keyword, topicId }, 1); // Tìm kiếm thì luôn về trang 1
  };

  // Hàm xử lý khi ấn nút Next/Prev/Số trang từ DataTable
  const onChangePage = async (newPage) => {
    // Chỉ chạy nếu trang mới hợp lệ
    if (newPage >= 1 && newPage <= pagination.totalPages) {
      await fetchSkillsData(filters, newPage);
    }
  };


const createNewSkill = async (data) => {
  const res = await createSkill(data)
  setSkills((prev) => [res.data, ...prev])
  return res.data
}

  const getSkillId=async (id)=>{
    const skill =await getSkillById(id)
    return skill
  }
 const updateSkill=async (id,data)=>{
  const update=await updateSkillData(id,data)
  return update
 }

 const deleteSkillById =async(id)=>{
  const deleteski =await deleteSkill(id);
  return deleteski
 }


  return {
    skills,
    pagination,
    loading,
    error,filters,
    fetchSkills: fetchSkillsData,
    searchSkill,
    onChangePage ,createNewSkill,getSkillId,updateSkill,deleteSkillById
  };
}