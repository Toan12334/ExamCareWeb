import { useEffect, useRef, useState } from "react";
import classApi from "../services/calsses.service.js";
export default function useClasses(initialParams = {}) {
  const [classes, setClasses] = useState([]);

  const [pagination, setPagination] = useState({
    page: 1,
    pageSize: 10,
    total: 0,
    totalPages: 0,
  });

  const [params, setParams] = useState({
    page: 1,
    pageSize: 10,
    ...initialParams,
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // 🔥 tránh race condition
  const requestRef = useRef(0);

  /**
   * FETCH DATA (core)
   */
  const fetchClasses = async (customParams = {}) => {
    const requestId = ++requestRef.current;

    try {
      setLoading(true);
      setError(null);

      const finalParams = {
        ...params,
        ...customParams,
      };

      const res = await classApi.getAll(finalParams);

      // ❗ bỏ request cũ nếu bị out-of-order
      if (requestId !== requestRef.current) return;

      setClasses(res.data || []);
      setPagination({
        page: res.pagination?.page || 1,
        pageSize: res.pagination?.pageSize || 10,
        total: res.pagination?.total || 0,
        totalPages: res.pagination?.totalPages || 1,
      });

      setParams(finalParams);
    } catch (err) {
      if (requestId !== requestRef.current) return;
      setError(err?.message || "Fetch classes failed");
    } finally {
      if (requestId === requestRef.current) {
        setLoading(false);
      }
    }
  };

  /**
   * CREATE
   */
  const createClass = async (data) => {
    await classApi.create(data);
    await fetchClasses();
  };

  /**
   * UPDATE
   */
  const updateClass = async (id, payload) => {
    await classApi.update(id, payload);
    await fetchClasses();
  };

  /**
   * DELETE
   */
  const deleteClass = async (id) => {
    await classApi.delete(id);
    await fetchClasses();
  };

  /**
   * CHANGE PAGE
   */
  const changePage = (page) => {
    fetchClasses({ page });
  };

  /**
   * SEARCH / FILTER (🔥 match DataTable2)
   */
  const searchClass = (filters) => {
    fetchClasses({
      ...filters,
      page: 1,
    });
  };

  /**
   * RESET FILTER
   */
  const resetFilters = () => {
    const cleanParams = {
      page: 1,
      pageSize: params.pageSize,
      search : "",
    };
    setParams(cleanParams);        // 🔥 reset state
    fetchClasses(cleanParams);     // 🔥 gọi API KHÔNG có filter
  };
  /**
   * INIT LOAD
   */
  useEffect(() => {
    fetchClasses();
    // eslint-disable-next-line
  }, []);

  return {
    classes,
    pagination,
    loading,
    error,

    // actions
    fetchClasses,
    createClass,
    updateClass,
    deleteClass,

    // table control
    changePage,
    searchClass,
    resetFilters,
  };
}