/* eslint-disable no-unused-vars */
import { studentExamColumns } from "../constants/studentExam.columns.jsx"
import DataTable2 from "../components/table/DataTable2"
import useStudentExam from "../hooks/useStudentExam.js";
import { buildStudentExamFilters } from "../constants/studentExam.columns.jsx";
import Button from "../components/ui/Button.jsx";
export default function StudentExamPage() {
    const { studentExams, pagination,ailoading, error, handleSearch, handleFilter, handlePagination, handleSort, resetFilters, handleAIComment } = useStudentExam();
 

    const handleAI = async (studentId, studentExamId) => {
        console.log("CLICKED:", studentId, studentExamId);
        const aiResponsetext="";
        try {
          if(!aiResponsetext=="") {
            alert("Đã có nhận xét AI, không thể lấy lại");
           <Button variant="Xem nhận xét"/>
          }
          const response = await handleAIComment(studentId, studentExamId);
          return response.data;
      
        } catch (err) {
          console.error("AI ERROR:", err);
      
          // có thể show toast hoặc alert
          alert(err?.message || "Lỗi khi lấy AI comment");
      
        }
      };
    const renderAIComment = (row) => {
        return (
            <Button
                onClick={() => handleAI(row.StudentId, row.StudentExamId)}
                disabled={ailoading}
                className="bg-purple-600 text-white px-3 py-1 rounded hover:bg-purple-700"
            >{ailoading ? "Đang tải..." : "Xem nhận xét AI"}
            </Button>
        );
    };

    return (
        <div>
            <DataTable2  renderAction={renderAIComment} pagination={pagination} error={error} onSearch={handleSearch} onFilter={handleFilter}
             onPageChange={handlePagination} onSort={handleSort} onReset={resetFilters}
                columns={studentExamColumns} data={studentExams} title="Quản lý học sinh đang thi" filters={buildStudentExamFilters()} />
        </div>
    )
}