import { useCallback, useEffect, useState } from "react";
import {
  deleteExam,
  updateExam,
  getExamDetailById,
  getAllExams,
  createExam,updateExamStatus
} from "../services/exam.service.js";

import { getAllSkill } from "../services/skill.service.js"
import { getTopics } from "../services/topic.service.js"
import { getAllDifficultLevel } from "../services/difficultyLevel.service.js"


const DEFAULT_PARAMS = {
  page: 1,
  limit: 10,
  search: "",
};

const useExam = (initialParams = DEFAULT_PARAMS) => {
  const [exams, setExams] = useState([]);
  const [examDetail, setExamDetail] = useState(null);
  const [filterData, setfilterData] = useState({
    topics: [],
    skills: [],
    levels: [],
  })

  const [params, setParams] = useState({
    page: initialParams.page || 1,
    limit: initialParams.limit || 10,
    search: initialParams.search || "",
  });

  const [pagination, setPagination] = useState({
    total: 0,
    page: initialParams.page || 1,
    limit: initialParams.limit || 10,
    totalPages: 0,
    hasNextPage: false,
    hasPreviousPage: false,
  });

  const [loading, setLoading] = useState(false);
  const [detailLoading, setDetailLoading] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchExams = useCallback(async (customParams) => {
    try {
      const finalParams = {
        page: customParams?.page ?? 1,
        limit: customParams?.limit ?? 10,
        search: customParams?.search ?? "",
      };

      setLoading(true);
      setError(null);

      const response = await getAllExams(finalParams);

      setExams(response?.data || []);
      setPagination(
        response?.pagination || {
          total: 0,
          page: finalParams.page,
          limit: finalParams.limit,
          totalPages: 0,
          hasNextPage: false,
          hasPreviousPage: false,
        }
      );

      return response;
    } catch (err) {
      setError(
        err?.response?.data?.message ||
        err.message ||
        "Failed to fetch exams"
      );
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchExamById = useCallback(async (id) => {
    try {
      setDetailLoading(true);
      setError(null);

      const response = await getExamDetailById(id);
      setExamDetail(response?.data || null);

      return response;
    } catch (err) {
      const message =
        err?.response?.data?.message ||
        err.message ||
        "Failed to fetch exam detail";
      setError(message);
      throw err;
    } finally {
      setDetailLoading(false);
    }
  }, []);

  const handleCreateExam = useCallback(
    async (body) => {
      try {
        setSubmitLoading(true);
        setError(null);

        const response = await createExam(body);
        await fetchExams(params);

        return response;
      } catch (err) {
        const message =
          err?.response?.data?.message ||
          err.message ||
          "Failed to create exam";
        setError(message);
        throw err;
      } finally {
        setSubmitLoading(false);
      }
    },
    [fetchExams, params]
  );

  const loadValueFilter = useCallback(async () => {
    try {
      const [skillsRes, topicsRes, levelsRes] = await Promise.all([
        getAllSkill(),
        getTopics(),
        getAllDifficultLevel(),
      ]);

      const result = {
        skills: skillsRes || [],
        topics: topicsRes || [],
        levels: levelsRes || [],
      };

      setfilterData(result);
      return result;
    } catch (err) {
      console.error("Load filter failed", err);
      return null;
    }
  }, []);
  const handleUpdateExam = useCallback(
    async (id, body) => {
      try {
        setSubmitLoading(true);
        setError(null);

        const response = await updateExam(id, body);

        if (examDetail?.ExamId === Number(id)) {
          setExamDetail(response?.data || null);
        }

        await fetchExams(params);
        return response;
      } catch (err) {
        const message =
          err?.response?.data?.message ||
          err.message ||
          "Failed to update exam";
        setError(message);
        throw err;
      } finally {
        setSubmitLoading(false);
      }
    },
    [examDetail, fetchExams, params]
  );

  const handleDeleteExam = useCallback(
    async (id) => {
      try {
        setSubmitLoading(true);
        setError(null);

        const response = await deleteExam(id);

        const shouldGoPrevPage =
          exams.length === 1 && params.page > 1;

        const nextParams = shouldGoPrevPage
          ? { ...params, page: params.page - 1 }
          : params;

        if (shouldGoPrevPage) {
          setParams(nextParams);
        }

        await fetchExams(nextParams);
        return response;
      } catch (err) {
        const message =
          err?.response?.data?.message ||
          err.message ||
          "Failed to delete exam";
        setError(message);
        throw err;
      } finally {
        setSubmitLoading(false);
      }
    },
    [deleteExam, exams.length, fetchExams, params]
  );


  const handleUpdateExamStatus = useCallback(
    async (id, isActive) => {
      try {
        setSubmitLoading(true);
        setError(null);
  
        const response = await updateExamStatus(id, isActive);
  
        // cập nhật lại list
        await fetchExams(params);
  
        return response;
      } catch (err) {
        const message =
          err?.response?.data?.message ||
          err.message ||
          "Failed to update exam status";
        setError(message);
        throw err;
      } finally {
        setSubmitLoading(false);
      }
    },
    [fetchExams, params]
  );
  const changePage = useCallback((page) => {
    setParams((prev) => ({
      ...prev,
      page,
    }));
  }, []);

  const changeLimit = useCallback((limit) => {
    setParams((prev) => ({
      ...prev,
      limit,
      page: 1,
    }));
  }, []);

  const changeSearch = useCallback((search) => {
    setParams((prev) => ({
      ...prev,
      search,
      page: 1,
    }));
  }, []);

  const resetExamDetail = useCallback(() => {
    setExamDetail(null);
  }, []);

  const refreshExams = useCallback(async () => {
    await fetchExams(params);
  }, [fetchExams, params]);

  useEffect(() => {
    fetchExams(params);
  }, [fetchExams, params]);

  return {
    exams,
    examDetail,
    pagination,
    params,
    loading,
    detailLoading,
    submitLoading,
    error, filterData,

    fetchExams,
    fetchExamById,
    createExam: handleCreateExam,
    updateExam: handleUpdateExam,
    deleteExam: handleDeleteExam, setfilterData,
    updateExamStatus: handleUpdateExamStatus,

    changePage,
    changeLimit,
    changeSearch,
    setParams,
    setError,
    resetExamDetail,
    refreshExams, loadValueFilter
  };
};

export default useExam;