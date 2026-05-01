/* eslint-disable react-hooks/set-state-in-effect */
import React, { useState, useEffect, useMemo } from 'react';
import Button from "../../ui/Button.jsx";
export default function UserSelector({ onClose, onSubmit, studentData = [], dataEdit = null ,loading}) {
  const [className, setClassName] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStudentIds, setSelectedStudentIds] = useState([]);

  console.log("selectedStudentIds:", selectedStudentIds);
  // SỬA LỖI 1 & 2: Dùng useEffect để khởi tạo dữ liệu khi mở Form Edit
  useEffect(() => {
    if (dataEdit) {
      // Set tên lớp
      setClassName(dataEdit.ClassName || "");
      
      // Lấy danh sách ID học sinh đã có trong lớp (tránh vòng lặp vô hạn)
      if (dataEdit.Students && dataEdit.Students.length > 0) {
        const editStudentIds = dataEdit.Students.map(student => student.StudentId);
        setSelectedStudentIds(editStudentIds);
      }
    }
  }, [dataEdit]); // Chỉ chạy lại khi dataEdit thay đổi

  // TỐI ƯU: Dùng useMemo để tránh filter lại mảng không cần thiết mỗi khi gõ tên lớp
  const filteredStudents = useMemo(() => {
    return studentData.filter(student => {
      const nameMatch = (student.FullName || "").toLowerCase().includes(searchTerm.toLowerCase());
      const emailMatch = (student.Email || "").toLowerCase().includes(searchTerm.toLowerCase());
      return nameMatch || emailMatch;
    });
  }, [studentData, searchTerm]);

  const handleCheckboxChange = (studentId) => {
    setSelectedStudentIds(prev =>
      prev.includes(studentId)
        ? prev.filter(id => id !== studentId)
        : [...prev, studentId]
    );
  };

  const selectedStudents = useMemo(() => {
    return studentData.filter(student => 
      selectedStudentIds.includes(student.StudentId)
    );
  }, [studentData, selectedStudentIds]);

  // Biến cờ kiểm tra xem đang là Edit hay Create
  const isEditMode = !!dataEdit;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-4xl max-h-[90vh] rounded-2xl shadow-2xl overflow-hidden flex flex-col border border-gray-200">
        
        {/* HEADER */}
        <div className="flex items-center justify-between p-5 border-b bg-gray-50">
          {/* Đổi tiêu đề động theo chế độ */}
          <h2 className="text-xl font-bold text-gray-800">
            {isEditMode ? "Chỉnh sửa lớp học" : "Tạo lớp học mới"}
          </h2>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-gray-200 rounded-full transition-colors text-gray-500 hover:text-gray-700"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* BODY */}
        <div className="p-6 overflow-y-auto space-y-6">
          
          {/* --- PHẦN 1: NHẬP TÊN LỚP --- */}
          <div>
            <label htmlFor="className" className="block text-sm font-bold text-gray-700 mb-2">
              Tên lớp học <span className="text-red-500">*</span>
            </label>
            <input
              id="className"
              type="text"
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              placeholder="Ví dụ: Lớp ReactJS Căn bản..."
              value={className} // SỬA LỖI 2: Chỉ gọi value={className}
              onChange={(e) => setClassName(e.target.value)}
            />
          </div>

          <hr className="border-gray-200" />

          {/* --- PHẦN 2: TÌM KIẾM THÀNH VIÊN --- */}
          <div className="relative">
            <label className="block text-sm font-bold text-gray-700 mb-2">
              Thêm học sinh vào lớp
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                </svg>
              </div>
              <input
                type="text"
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Tìm kiếm theo tên hoặc email học sinh..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          {/* --- PHẦN 3: DANH SÁCH CUỘN (SCROLLABLE LIST) --- */}
          <div className="border border-gray-200 rounded-xl overflow-hidden shadow-sm">
            <ul className="max-h-52 overflow-y-auto divide-y divide-gray-100 bg-gray-50">
              {filteredStudents.length > 0 ? (
                filteredStudents.map(student => (
                  <li 
                    key={student.StudentId}
                    className="flex items-center p-3 hover:bg-blue-50 transition-colors cursor-pointer group"
                    onClick={() => handleCheckboxChange(student.StudentId)}
                  >
                    <input
                      type="checkbox"
                      className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500 cursor-pointer"
                      checked={selectedStudentIds.includes(student.StudentId)}
                      readOnly
                    />
                    <div className="ml-4 flex-1">
                      <p className="text-sm font-semibold text-gray-900">{student.FullName || "Chưa cập nhật tên"}</p>
                      <p className="text-xs text-gray-500">{student.Email || "Chưa có email"}</p>
                    </div>
                  </li>
                ))
              ) : (
                <li className="p-8 text-center text-gray-500">
                  <p>Không tìm thấy học sinh phù hợp.</p>
                </li>
              )}
            </ul>
          </div>

          {/* --- PHẦN 4: BẢNG THÔNG TIN --- */}
          <div>
            <h3 className="text-md font-bold mb-3 flex items-center gap-2 text-gray-700">
              <span className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs">
                {selectedStudents.length}
              </span>
              Học sinh đã được chọn
            </h3>
            
            {selectedStudents.length > 0 ? (
              <div className="overflow-hidden border border-gray-200 rounded-xl">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-widest">Họ & Tên</th>
                      <th className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-widest">Email</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {selectedStudents.map((student) => (
                      <tr key={`sel-${student.StudentId}`} className="animate-in slide-in-from-top-1 duration-200">
                        <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">
                          {student.FullName || "-"}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                          {student.Email || "-"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="p-6 border-2 border-dashed border-gray-200 rounded-xl text-center text-gray-400 text-sm">
                Chưa có ai được chọn. Hãy tick vào danh sách phía trên.
              </div>
            )}
          </div>
        </div>

        {/* FOOTER */}
        <div className="p-4 border-t bg-gray-50 flex justify-end gap-3">
          <button 
            onClick={onClose}
            className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 font-medium transition-all"
          >
            Đóng
          </button>
          <Button 
            onClick={() => {
              if (onSubmit) {
                onSubmit({
                  className: className.trim(),
                  studentIds: selectedStudentIds
                });
              }
            }}
            disabled={className.trim() === "" || selectedStudents.length === 0||loading} // Vô hiệu hóa nếu chưa nhập tên lớp hoặc chưa chọn học sinh hoặc đang loading
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-md shadow-blue-200"
          >
            {/* Đổi chữ của nút bấm */}
            {isEditMode ? "Cập nhật lớp" : "Xác nhận tạo lớp"}
          </Button>
        </div>
      </div>
    </div>
  );
}