/* eslint-disable no-unused-vars */
import { studentExamColumns } from "../constants/studentExam.columns.jsx"
import DataTable2 from "../components/table/DataTable2"
import useStudentExam from "../hooks/useStudentExam.js";
import { buildStudentExamFilters } from "../constants/studentExam.columns.jsx";
import Button from "../components/ui/Button.jsx";
export default function StudentExamPage() {
    const { studentExams, pagination,ailoading, error, handleSearch, handleFilter, handlePagination, handleSort, resetFilters, handleAIComment } = useStudentExam();

    const renderAIComment = (row) => {
        console.log("render row", row);
      
        return (
          <Button
            type="button"
            onClick={() => {
              console.log("clicked row:", row);
              console.log("StudentId:", row.StudentId);
              console.log("StudentExamId:", row.StudentExamId);
              handleAIComment(row.StudentId, row.StudentExamId);
            }}
            className="bg-purple-600 text-white px-3 py-1 rounded hover:bg-purple-700"
          >
            Xem nhận xét AI
          </Button>
        );
      };

    return (
        <div>
            <DataTable2  renderAction={renderAIComment} pagination={pagination} error={error} onSearch={handleSearch} onFilter={handleFilter} onPagination={handlePagination} onSort={handleSort} onReset={resetFilters}
                columns={studentExamColumns} data={studentExams} title="Quản lý học sinh đang thi" filters={buildStudentExamFilters()} />
        </div>
    )
}