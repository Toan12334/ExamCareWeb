import { useCallback, useEffect, useState } from "react";
import { getListStudentExam, getStudentExamDetail } from "../services/studentExam.service.js";

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
  const [ailoading, setaiLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchStudentExams = useCallback(async (customParams) => {
    try {
      setaiLoading(true);
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
      setaiLoading(false);
    }
  }, [params]);

  useEffect(() => {
    fetchStudentExams();
  }, [params]);

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
    setParams({
      ...defaultParams,
      limit: params.limit
    });
  };

  const refetch = () => {
    fetchStudentExams();
  };
  const handleAIComment = async (studentId, studentExamId) => {
    try {
      setaiLoading(true);
      setError(null);
  
      const response = await getStudentExamDetail(studentId, studentExamId);
      console.log("AI Comment Response:", response.data);
      return response.data;
    } catch (err) {
      setError(err?.response?.data?.message || err?.message || "Đã có lỗi xảy ra");
    } finally {
      setaiLoading(false);
    }
  };
  return {
    studentExams,
    pagination,
    params,
    ailoading,
    error,
    setParams,
    fetchStudentExams,
    handleSearch,
    handleFilter,
    handlePagination,
    handleSort,
    resetFilters,
    refetch, handleAIComment
  };
};

export default useStudentExam;