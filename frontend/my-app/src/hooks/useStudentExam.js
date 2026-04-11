import { useCallback, useEffect, useState } from "react";
import { getListStudentExam } from "../services/studentExam.service.js";

const defaultParams = {
  page: 1,
  limit: 10,
  search: "",
  fullName: "",
  examName: "",
  status: "",
  scoreMin: "",
  scoreMax: "",
  sortBy: "CreatedAt",
  sortOrder: "desc"
};

const useStudentExam = (initialParams = {}) => {
  const [studentExams, setStudentExams] = useState([]);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0
  });
  const [params, setParams] = useState({
    ...defaultParams,
    ...initialParams
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchStudentExams = useCallback(async (customParams) => {
    try {
      setLoading(true);
      setError(null);

      const finalParams = customParams || params;
      const response = await getListStudentExam(finalParams);

      setStudentExams(response?.data || []);
      setPagination(
        response?.pagination || {
          page: 1,
          limit: 10,
          total: 0,
          totalPages: 0
        }
      );
    } catch (err) {
      setError(err?.response?.data?.message || err?.message || "Đã có lỗi xảy ra");
      setStudentExams([]);
    } finally {
      setLoading(false);
    }
  }, [params]);

  useEffect(() => {
    fetchStudentExams();
  }, [fetchStudentExams]);

  const handleSearch = (filterValues) => {
    const { rangeScore, ...rest } = filterValues;
  
    let scoreMin = "";
    let scoreMax = "";
  
    if (rangeScore) {
      [scoreMin, scoreMax] = rangeScore.split("-").map(Number);
    }
  
    handleFilter({
      ...rest,
      scoreMin,
      scoreMax
    });
  };
  const handleFilter = (filters = {}) => {
    setParams((prev) => ({
      ...prev,
      page: 1,
      ...filters
    }));
  };

  const handlePagination = (page, limit = params.limit) => {
    setParams((prev) => ({
      ...prev,
      page,
      limit
    }));
  };

  const handleSort = (sortBy, sortOrder = "asc") => {
    setParams((prev) => ({
      ...prev,
      page: 1,
      sortBy,
      sortOrder
    }));
  };

  const resetFilters = () => {
    const newParams = {
      ...defaultParams,
      limit: params.limit
    };
  
    setParams(newParams);
    fetchStudentExams(newParams); // 👈 truyền params mới
  };

    const refetch = () => {
        fetchStudentExams();
    };

  return {
    studentExams,
    pagination,
    params,
    loading,
    error,
    setParams,
    fetchStudentExams,
    handleSearch,
    handleFilter,
    handlePagination,
    handleSort,
    resetFilters,
    refetch
  };
};

export default useStudentExam;