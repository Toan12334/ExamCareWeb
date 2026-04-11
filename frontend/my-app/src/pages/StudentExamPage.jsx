/* eslint-disable no-unused-vars */
import { studentExamColumns } from "../constants/studentExam.columns.jsx"
import DataTable2 from "../components/table/DataTable2"
import useStudentExam from "../hooks/useStudentExam.js";
export default function StudentExamPage(){
    const { studentExams,  pagination, loading,  error,  handleSearch,  handleFilter, handlePagination, handleSort, resetFilters} = useStudentExam();

    return(
        <div>
            <DataTable2 pagination={pagination} loading={loading} error={error} onSearch={handleSearch} onFilter={handleFilter} onPagination={handlePagination} onSort={handleSort} onResetFilters={resetFilters}
            columns={studentExamColumns} data={studentExams} title="Quản lý học sinh đang thi"/>
        </div>
    )
}