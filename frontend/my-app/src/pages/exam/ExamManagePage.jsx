/* eslint-disable no-unused-vars */
import DataTable2 from "../../components/table/DataTable2";
import { examColumn, buildExamFilters } from "../../constants/exam.columns.jsx";
import useExam from "../../hooks/useExam";
import Button from "../../components/ui/Button.jsx";
import { useNavigate } from 'react-router-dom';
import { Trash2, Pencil } from "lucide-react"
import { useState } from "react";
import Toast from "../../utils/toast.js";

export default function ExamManagePage() {
    const navigate = useNavigate();
    const { exams,pagination,loading,error,valueFilter,changePage, changeLimit,updateExamStatus,randomCode,
        changeSearch,createExam, updateExam,deleteExam,loadValueFilter,setValueFilter } = useExam();

    const handleSearch = (filterValues) => {
        changeSearch(filterValues?.search || "");
    };
 console.log(exams)
    const handleReset = () => {
        changeSearch("");
    };

    const handleAdd = async () => {
       
        console.log("Open modal thêm mới exam");
        navigate('/exam-manage/create');
    };
    const handleRandom=async(id)=>{
        try {
            const newCode = await randomCode(id);
            Toast.examCode(newCode);
        } catch (err) {
            console.error(err);
            Toast.error("Đã xảy ra lỗi khi tạo mã đề thi mới");
        }
    }

    const handleDelete = async (row) => {
        const confirmed = window.confirm(
            `Bạn có chắc muốn xóa đề thi "${row.ExamName}" không?`
        );

        if (!confirmed) return;

        try {
            await deleteExam(row.ExamId);
        } catch (err) {
            console.error(err);
        }
    };

    const handleEdit = async (row) => {
        console.log("Open modal sửa exam", row);
        navigate(`/exam-manage/edit/${row.ExamId}`);
    };

    const handleToggle = async (id, checked) => {
        await updateExamStatus(id, checked);
        Toast.success("Cập nhật thành công ");
      };

    const renderAction = (row) => {
        return (
            <>
                <Button
                    onClick={() => handleEdit(row)}
                    className="bg-purple-500"
                    variant="ghost"
                >
                    <Pencil size={20} />
                </Button>
                <Button
                    onClick={() => handleDelete(row)}
                    variant="danger"
                >
                    <Trash2 size={20} />
                </Button>
            </>
        );
    };

 
    return (
        <div className="space-y-4">
            {error && (
                <div className="rounded border border-red-200 bg-red-50 px-4 py-3 text-red-600">
                    {error}
                </div>
            )}

            <DataTable2
                title="Danh sách đề thi"
                filters={typeof buildExamFilters === "function" ? buildExamFilters() : buildExamFilters}
                columns={examColumn(handleToggle,handleRandom)}
                data={exams}
                pagination={pagination}
                onPageChange={changePage}
                onSearch={handleSearch}
                onReset={handleReset}
                onAdd={handleAdd}
                renderAction={renderAction}
            />

            {loading && (
                <div className="text-sm text-gray-500">Đang tải dữ liệu...</div>
            )}

            

        </div>
    );
}