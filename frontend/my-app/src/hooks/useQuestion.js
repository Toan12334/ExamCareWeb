/* eslint-disable no-unused-vars */
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  getQuestions,
  create,
  getQuestionById,
  deleteQuestion,
  getQuestionAnalyst
} from "../services/question.service.js";
import { getAllQuestionType } from "../services/questionType.service.js";
import { buildQuestionFilters } from "../constants/question.columns.js";
import { getAllDifficultLevel } from "../services/difficultyLevel.service.js";
import { getAllSkill } from "../services/skill.service.js";
import useTopic from "./useTopic.js";
import { ROUTES } from "../constants/routes.js";

// Hàm tiện ích: Xóa các key có giá trị null, undefined hoặc chuỗi rỗng "" để không gửi xuống API
const cleanParams = (params) => {
  return Object.fromEntries(
    Object.entries(params).filter(([_, v]) => v !== null && v !== undefined && v !== "")
  );
};

export default function useQuestion(options = {}) {
  const {
    enableUrlSync = true,
    customSyncUrl = null,
  } = options;

  const navigate = useNavigate();
  const { getAllTopic } = useTopic();

  const [filters, setFilters] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [filterValues, setFilterValues] = useState({});
  const [meta, setMeta] = useState({ topics: [], types: [], difficults: [], skills: [] });

  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    pageSize: 10,
    totalPages: 1
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Nhận tham số trực tiếp thay vì phụ thuộc hoàn toàn vào state để tránh Stale State
  const fetchQuestions = async (currentFilters = filterValues, currentPage = pagination.page) => {
    try {
      setLoading(true);

      const finalParams = cleanParams({
        ...currentFilters,
        page: currentPage,
        pageSize: pagination.pageSize,
      });

      const result = await getQuestions(finalParams);

      setQuestions(result.data?.data || []);
      setPagination(prev => ({
        ...prev,
        page: result.data?.page || 1,
        total: result.data?.total || 0,
        totalPages: result.data?.totalPages || 1
      }));
    } catch (err) {
      console.error(err);
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuestions();
    loadFilters();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadFilters = async () => {
    const topics = await getAllTopic();
    const types = await getAllQuestionType();
    const difficulties = await getAllDifficultLevel();
    const skills = await getAllSkill();

    const normalize = {
      topics: topics.map(t => ({
        id: t.TopicId,
        name: t.TopicName
      })),
      types: types.map(t => ({
        id: t.TypeId,
        name: t.TypeName
      })),
      difficults: difficulties.map(d => ({
        id: d.DifficultyId,
        name: d.LevelName
      })),
      skills: skills.map(s => ({
        id: s.SkillId,
        name: s.SkillName,
        topicId: s.TopicId
      }))
    };

    setMeta(normalize);

    const topicOptions = topics.map(t => ({
      value: t.TopicId,
      label: t.TopicName
    }));

    const typeOptions = types.map(t => ({
      value: t.TypeId,
      label: t.TypeName
    }));

    const difficultOptions = difficulties.map(d => ({
      value: d.DifficultyId,
      label: d.LevelName
    }));

    const skillOptions = skills.map(s => ({
      value: s.SkillId,
      label: s.SkillName
    }));

    setFilters(buildQuestionFilters(topicOptions, typeOptions, difficultOptions, skillOptions));
  };

  const syncUrl = (params, page) => {
    if (!enableUrlSync) return;

    if (customSyncUrl) {
      customSyncUrl({ ...params, page });
      return;
    }

    navigate(
      ROUTES.QUESTION_BANK.QUESTIONS_WITH_QUERY({
        page: page || 1,
        limit: pagination.pageSize || 10,
        search: params.keyword || "",
        topicId: params.TopicId || "",
        skillId: params.SkillId || "",
        difficultyId: params.DifficultyId || "",
        typeId: params.TypeId || "",
      })
    );
  };

  const onSearch = async (params = {}) => {
    let nextFilterValues = {
      ...filterValues,
      ...params,
    };

    // Nếu người dùng thay đổi Topic, tự động xóa Skill để tránh lỗi xung đột bộ lọc
    if ('TopicId' in params && params.TopicId !== filterValues.TopicId) {
      nextFilterValues.SkillId = ""; 
    }

    setFilterValues(nextFilterValues);
    syncUrl(nextFilterValues, 1);
    await fetchQuestions(nextFilterValues, 1);
  };

  const onPageChange = async (page) => {
    syncUrl(filterValues, page);
    await fetchQuestions(filterValues, page);
  };

  const onReset = async () => {
    const emptyFilters = {}; // Dùng object rỗng, hàm cleanParams sẽ lo phần còn lại

    setFilterValues(emptyFilters);
    syncUrl(emptyFilters, 1);
    await fetchQuestions(emptyFilters, 1);
  };

  const createQuestion = async (body) => {
    return await create(body);
  };

  const getByIdQuestionID = async (id) => {
    const result = await getQuestionById(id);
    return result.data;
  };

  const deleteQuestionById = async (id) => {
    return await deleteQuestion(id);
  };

  const getViewAnaLystQuestion = async (id) => {
    return await getQuestionAnalyst(id);
  };

  return {
    questions,
    pagination,
    filters,
    loading,
    error,
    meta,
    onSearch,
    onPageChange,
    onReset,
    createQuestion,
    getByIdQuestionID,
    fetchQuestions,
    deleteQuestionById,
    getViewAnaLystQuestion
  };
}