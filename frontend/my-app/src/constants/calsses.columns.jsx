import { Switch } from "antd";
import { Users, Pencil, Trash2 } from "lucide-react";
import Button from "../components/ui/Button.jsx";

/**
 * TABLE COLUMNS
 */
export const classesColumns = (
) => [
  {
    key: "ClassId",
    title: "ID",
  },
  {
    key: "ClassName",
    title: "Tên lớp",
  },
  {
    key: "studentCount",
    title: "Số học sinh",
    render: (row) => (
      <div className="flex items-center gap-2">
        <Users size={16} />
        <span>{row.studentCount || 0}</span>
      </div>
    ),
  },
  {
    key: "CreatedAt",
    title: "Ngày tạo",
    render: (row) =>
      new Date(row.CreatedAt).toLocaleDateString("vi-VN"),
  },

];

export const buildClassFilters = [

  { key: "search", placeholder: "Tìm tên lớp..." },
]