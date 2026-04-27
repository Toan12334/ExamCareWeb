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

  const fetchQuestions = async (params = {}) => {
    try {
      setLoading(true);

      const finalParams = {
        page: pagination.page,
        pageSize: pagination.pageSize,
        ...filterValues,
        ...params
      };

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

  const syncUrl = (params) => {
    if (!enableUrlSync) return;

    if (customSyncUrl) {
      customSyncUrl(params);
      return;
    }

    navigate(
      ROUTES.QUESTION_BANK.QUESTIONS_WITH_QUERY({
        page: params.page || 1,
        limit: params.pageSize || 10,
        search: params.keyword || "",
        topicId: params.TopicId || "",
        skillId: params.SkillId || "",
        difficultyId: params.DifficultyId || "",
        typeId: params.TypeId || "",
      })
    );
  };

  const onSearch = async (params = {}) => {
    const nextFilterValues = {
      ...filterValues,
      ...params,
    };

    const nextParams = {
      ...nextFilterValues,
      page: 1,
      pageSize: pagination.pageSize,
    };

    setFilterValues(nextFilterValues);
    syncUrl(nextParams);
    await fetchQuestions(nextParams);
  };

  const onPageChange = async (page) => {
    const nextParams = {
      ...filterValues,
      page,
      pageSize: pagination.pageSize,
    };

    syncUrl(nextParams);
    await fetchQuestions(nextParams);
  };

  const onReset = async () => {
    const emptyFilters = {
      keyword: "",
      TopicId: "",
      SkillId: "",
      DifficultyId: "",
      TypeId: "",
    };

    const nextParams = {
      ...emptyFilters,
      page: 1,
      pageSize: pagination.pageSize,
    };

    setFilterValues(emptyFilters);
    syncUrl(nextParams);
    await fetchQuestions(nextParams);
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