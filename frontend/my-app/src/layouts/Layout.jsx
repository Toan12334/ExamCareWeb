import Sidebar from "../components/ui/SideBar"

import { Outlet } from "react-router-dom"
export default function Layout() {
  return (
    <div className="flex h-screen">
      <Sidebar />

      {/* 👇 THÊM relative + overflow-hidden */}
      <div className="flex-1 relative bg-gray-100 overflow-hidden">
        
        {/* Content */}
        <div className="h-full overflow-auto p-6">
          <Outlet />
        </div>

      </div>
    </div>
  )
}