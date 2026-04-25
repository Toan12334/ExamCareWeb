import { Switch } from "antd";
import { Users, Pencil, Trash2 } from "lucide-react";
import Button from "../components/ui/Button.jsx";

/**
 * TABLE COLUMNS
 */
export const classesColumns = (
  handleToggle,
  handleEdit,
  handleDelete
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
  {
    key: "actions",
    title: "Hành động",
    render: (row) => (
      <div className="flex gap-2">
        <Button
          className="bg-blue-600"
          onClick={() => handleEdit(row)}
        >
          <Pencil size={16} />
        </Button>

        <Button
          className="bg-red-600"
          onClick={() => handleDelete(row.ClassId)}
        >
          <Trash2 size={16} />
        </Button>
      </div>
    ),
  },
];

export const buildClassFilters = [

  { key: "search", placeholder: "Tìm tên lớp..." },
]