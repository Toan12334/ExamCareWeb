import { useState } from "react"
import { Link } from "react-router-dom"
import { Menu, Users, Layers, ChevronDown, Book, School } from "lucide-react"
import { ROUTES } from "../../constants/routes"

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(false)

  return (
    <div className={`h-screen bg-[#2f3651] text-white transition-all duration-300 
        ${collapsed ? "w-20" : "w-64"}`}>

      {/* Toggle */}
      <div className="p-4 flex justify-end">
        <Menu
          className="cursor-pointer"
          onClick={() => setCollapsed(!collapsed)}
        />
      </div>

      <div className="space-y-2 px-2">

        {/* 🔥 NEW: System Management */}
        <DropdownSystem collapsed={collapsed} />

        {/* Question Bank */}
        <DropdownItem collapsed={collapsed} />

        {/* Exam */}
        <DropdownExamManagement collapsed={collapsed} />

      </div>
    </div>
  )
}


function DropdownSystem({ collapsed }) {
  const [open, setOpen] = useState(false)

  return (
    <div>
      <div
        onClick={() => setOpen(!open)}
        className="flex items-center justify-between p-3 hover:bg-[#3b4363] rounded-lg cursor-pointer"
      >
        <div className="flex items-center gap-3">
          <Users size={20} />
          {!collapsed && <span>Quản lý hệ thống</span>}
        </div>

        {!collapsed && <ChevronDown size={16} />}
      </div>

      {open && !collapsed && (
        <div className="ml-8 mt-1 space-y-1 text-sm text-gray-300">

          {/* Users */}
          <Link
            to={ROUTES.USER_MANAGER.MANAGER}
            className="flex items-center gap-2 p-2 hover:bg-[#3b4363] rounded"
          >
            <Users size={16} />
            Quản lý người dùng
          </Link>

          {/* 🔥 NEW: Classes */}
          <Link
            to={ROUTES.CLASSES_MANAGER.MANAGER}
            className="flex items-center gap-2 p-2 hover:bg-[#3b4363] rounded"
          >
            <School size={16} />
            Quản lý lớp
          </Link>

        </div>
      )}
    </div>
  )
}

function DropdownItem({ collapsed }) {

  const [open, setOpen] = useState(false)

  return (
    <div>
      <div
        onClick={() => setOpen(!open)}
        className="flex items-center justify-between p-3 hover:bg-[#3b4363] rounded-lg cursor-pointer"
      >
        <div className="flex items-center gap-3">
          <Layers size={20} />
          {!collapsed && <span>Quản lý ngân hàng câu hỏi</span>}
        </div>

        {!collapsed && <ChevronDown size={16} />}
      </div>

      {open && !collapsed && (
        <div className="ml-8 mt-1 space-y-1 text-sm text-gray-300">
          <Link to={ROUTES.QUESTION_BANK.TOPICS} className="block p-2 hover:bg-[#3b4363] rounded">
            Quản lý Chủ đề
          </Link>
          <Link to={ROUTES.QUESTION_BANK.SKILLS} className="block p-2 hover:bg-[#3b4363] rounded">
            Quản lý Kỹ năng
          </Link>
          <Link to={ROUTES.QUESTION_BANK.DIFFICULTIES} className="block p-2 hover:bg-[#3b4363] rounded">
            Quản lý Độ khó
          </Link>
          <Link to={ROUTES.QUESTION_BANK.QUESTIONS} className="block p-2 hover:bg-[#3b4363] rounded">
            Quản lý Câu hỏi
          </Link>
        </div>
      )}
    </div>
  )
}

function DropdownExamManagement({ collapsed }) {

  const [open, setOpen] = useState(false)

  return (
    <div>
      <div
        onClick={() => setOpen(!open)}
        className="flex items-center justify-between p-3 hover:bg-[#3b4363] rounded-lg cursor-pointer"
      >
        <div className="flex items-center gap-3">
          <Book size={20} />
          {!collapsed && <span>Quản lý  thi</span>}
        </div>

        {!collapsed && <ChevronDown size={16} />}
      </div>

      {open && !collapsed && (
        <div className="ml-8 mt-1 space-y-1 text-sm text-gray-300">
          <Link to={ROUTES.EXAM_MANAGE.STUDENT_EXAM} className="block p-2 hover:bg-[#3b4363] rounded">
            Quản lý thí sinh thi
          </Link>
          <Link to={ROUTES.EXAM_MANAGE.EXAM_PAPER} className="block p-2 hover:bg-[#3b4363] rounded">
            Quản lý Đề thi
          </Link>
        </div>
      )}
    </div>
  )
}