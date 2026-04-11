import { useState } from "react"
import { useLocation } from "react-router-dom";
export default function DataTable2({
  title = "Danh sách",
  filters = [],
  columns = [],
  data = [],
  pagination = {}, // { page, totalPages, total }
  onPageChange,
  onSearch,
  onReset,
  onAdd,
  renderAction,
  loading = false  
}) {
  const [filterValues, setFilterValues] = useState({})
  const { page = 1, totalPages = 1, total = 0 } = pagination

  const handleChange = (key, value) => {
    setFilterValues(prev => ({ ...prev, [key]: value }))
  }

  const handleSearch = () => {
    onSearch && onSearch(filterValues)
  }

  const handleReset = () => {
    setFilterValues({})
    onReset && onReset()
  }
  const location = useLocation();

  return (
    <div className="bg-white rounded-xl shadow p-4">
      {/* Title */}
      <h2 className="text-lg font-semibold text-teal-600 mb-4">{title}</h2>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 mb-4">
        {filters.map(f => (
          f.type === "select" ? (
            <select
              key={f.key}
              value={filterValues[f.key] || ""}
              onChange={(e) => handleChange(f.key, e.target.value)}
              className="border px-3 py-2 rounded w-64"
            >
              <option value="">{f.placeholder}</option>
              {f.options?.map(opt => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          ) : (
            <input
              key={f.key}
              value={filterValues[f.key] || ""}
              onChange={(e) => handleChange(f.key, e.target.value)}
              placeholder={f.placeholder}
              className="border px-3 py-2 rounded w-64"
            />
          )
        ))}

        <button onClick={handleReset} className="border px-4 py-2 rounded text-teal-600">
          Làm mới bộ lọc
        </button>
        <button onClick={handleSearch} className="bg-teal-600 text-white px-4 py-2 rounded">
          Tìm kiếm
        </button>
      </div>

      {/* Add Button */}
      {location.pathname !== "/exam-manage/create" && (
        <div className="mb-3 text-right">
          <button
            onClick={onAdd}
            className="bg-teal-600 text-white px-4 py-2 rounded"
          >
            + Thêm mới
          </button>
        </div>
      )}

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full border-collapse border border-gray-200">
          <thead className="bg-gray-100">
            <tr>
              <th className="border px-3 py-2 w-16 text-center">#</th>
              {columns.map(col => (
                <th key={col.key} className="border px-3 py-2 text-left">
                  {col.title}
                </th>
              ))}
              {/* Header cho cột Action nếu có renderAction */}
              {renderAction && <th className="border px-3 py-2 text-center w-32">Thao tác</th>}
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td
                  colSpan={columns.length + (renderAction ? 2 : 1)}
                  className="text-center py-10"
                >
                  <div className="flex justify-center items-center gap-2 text-gray-500">
                    <div className="w-5 h-5 border-2 border-teal-600 border-t-transparent rounded-full animate-spin"></div>
                    Đang tải dữ liệu...
                  </div>
                </td>
              </tr>
            ) : data.length === 0 ? (
              <tr>
                <td
                  colSpan={columns.length + (renderAction ? 2 : 1)}
                  className="text-center py-8 text-gray-500"
                >
                  Không có dữ liệu
                </td>
              </tr>
            ) : (
              data.map((row, index) => (
                <tr key={row.id || index} className="hover:bg-gray-50 transition-colors">
                  <td className="border px-3 py-2 text-center">
                    {(page - 1) * 10 + index + 1} {/* Giả định 10 item/trang, có thể thay 10 bằng pageSize nếu có */}
                  </td>
                  {columns.map(col => (
                    <td key={col.key} className="border px-3 py-2">
                      {col.render ? col.render(row) : row[col.key]}
                    </td>
                  ))}
                  {/* Cột Action thực thi ở đây */}
                  {renderAction && (
                    <td className="border px-3 py-2 text-center">
                      <div className="flex justify-center gap-2">
                        {renderAction(row)}
                      </div>
                    </td>
                  )}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex flex-col sm:flex-row justify-between items-center mt-4 gap-4">
        <div className="text-sm text-gray-600">Tổng số: <b>{total}</b> bản ghi</div>

        <div className="flex items-center gap-2">
          <button disabled={page === 1} onClick={() => onPageChange?.(1)} className="px-3 py-1 border rounded disabled:opacity-30">{'<<'}</button>
          <button disabled={page === 1} onClick={() => onPageChange?.(page - 1)} className="px-3 py-1 border rounded disabled:opacity-30">{'<'}</button>
          <span className="text-sm">Trang <b>{page}</b> / {totalPages}</span>
          <button disabled={page === totalPages} onClick={() => onPageChange?.(page + 1)} className="px-3 py-1 border rounded disabled:opacity-30">{'>'}</button>
          <button disabled={page === totalPages} onClick={() => onPageChange?.(totalPages)} className="px-3 py-1 border rounded disabled:opacity-30">{'>>'}</button>
        </div>
      </div>
    </div>
  )
}