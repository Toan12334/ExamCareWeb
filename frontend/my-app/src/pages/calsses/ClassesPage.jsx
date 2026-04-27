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
    const handleSubmit = async (data, row) => {
        if (row) {
            Toast.success("Cập nhật lớp thành công");
        }
        else {
            await createClass(data);
            setOpenUserSelector(false);
            Toast.success("Tạo lớp thành công");
        }
    }
    const handleOpenForm = (row) => {
        console.log("Open form for row:", row);
        setOpenUserSelector(true);
    }

    const renderActions = (row) => {
        return (
            <div className="flex justify-center gap-2">
                <Button variant="primary" onClick={() => handleSubmit(row)}><Pencil size={18} /></Button>
                <Button variant="danger" onClick={() => handleDelete(row)}><Trash2 size={18} /></Button>
            </div>
        );
    };

    // eslint-disable-next-line no-unused-vars
    const { classes, pagination, changePage, searchClass, resetFilters, createClass } = useClasses();
    const { students } = useStudents();
    return (
        <div>
            <DataTable2 onAdd={handleOpenForm} renderAction={renderActions} onReset={resetFilters} filters={buildClassFilters} pagination={pagination} onSearch={searchClass} onPageChange={changePage}
                data={classes} title="Quản lý lớp" columns={classesColumns()} />
            {openUserSelector && <UserSelector onSubmit={handleSubmit} studentData={students} onClose={() => { setOpenUserSelector(false) }} />}
        </div>

    )

}