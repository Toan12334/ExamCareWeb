/* eslint-disable no-undef */
import useClasses from "../../hooks/useClasses.js";
import DataTable2 from "../../components/table/DataTable2.jsx";
import { classesColumns, buildClassFilters } from "../../constants/calsses.columns.jsx";
import Button from "../../components/ui/Button.jsx";
import UserSelector from "../../components/form/classes_form/ClassForm.jsx";
import { Pencil, Trash2 } from "lucide-react";
import { useState } from "react";
import useStudents from "../../hooks/useStudent.js";
import Toast from "../../utils/toast.js";
export default function ClassesPage() {

    const [openUserSelector, setOpenUserSelector] = useState(false);
    const [dataEdit, setDataEdit] = useState(null);
    const [calssIdEdit, setClassIdEdit] = useState(null);
    const handleSubmit = async (data) => {
        setLoading(true);

        try {
            if (calssIdEdit) {
                await updateClass(calssIdEdit, data);
                setOpenUserSelector(false);
                setClassIdEdit(null);
                Toast.success("Cập nhật lớp thành công");
                return;
            } else {
                await createClass(data);
                setOpenUserSelector(false);
                Toast.success("Tạo lớp thành công");
                return;
            }
        } catch (error) {
            console.error(error);
            Toast.error("Có lỗi xảy ra");
        } finally {
            setLoading(false);
        }
    };
    const handleOpenForm = (row) => {
        console.log("Open form for row:", row);
        setClassIdEdit(null); // Reset classIdEdit khi mở form mới
        setDataEdit(null); // Reset dataEdit khi mở form mới
        setOpenUserSelector(true);
    }
    const handleEdit = async (row) => {
        console.log("Edit row:", row);
        const classData = await getClassById(row.ClassId);
        setClassIdEdit(row.ClassId);
        setDataEdit(classData);
        setOpenUserSelector(true);
        return classData;
    }

    const renderActions = (row) => {
        return (
            <div className="flex justify-center gap-2">
                <Button disabled={loading} variant="primary" onClick={() => handleEdit(row)}><Pencil size={18} /></Button>
                <Button variant="danger" onClick={() => handleDelete(row)}><Trash2 size={18} /></Button>
            </div>
        );
    };

    // eslint-disable-next-line no-unused-vars
    const { loading, classes, pagination, changePage, searchClass, resetFilters, createClass, updateClass, getClassById, setLoading } = useClasses();
    const { students } = useStudents();
    return (
        <div>
            <DataTable2 onAdd={handleOpenForm} renderAction={renderActions} onReset={resetFilters} filters={buildClassFilters} pagination={pagination} onSearch={searchClass} onPageChange={changePage}
                data={classes} title="Quản lý lớp" columns={classesColumns()} />
            {openUserSelector && <UserSelector loading={loading} dataEdit={dataEdit} onSubmit={handleSubmit} studentData={students} onClose={() => { setOpenUserSelector(false) }} />}
        </div>

    )

}