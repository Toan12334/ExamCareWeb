import { useState } from "react"
import useStudent from "../hooks/useStudent.js"
import DataTable from "../components/table/DataTable.jsx"
import Button from "../components/ui/Button.jsx"
import { Pencil, Trash2 } from "lucide-react"
import StudentForm from "../components/form/StudentForm.jsx"
import StudentFilter from "../components/search/StudentFilter.jsx"
import DeleteConfirmation from "../components/modal/DeleteConfirmation.jsx"
import Toast from "../utils/toast.js"
export function StudentManagePage() {

    const { students, createStudent, getStudentId, updateStudentId, deleteStudent, searchStudent, fetchStudents } = useStudent()

    const [openForm, setOpenForm] = useState(false)
    const [editingStudent, setEditingStudent] = useState(null)

    const handleSubmitStudent = async (data) => {

        if (editingStudent) {
            await updateStudentId(editingStudent.StudentId, data)
        } else {
            await createStudent(data)
        }

        setEditingStudent(null)
        setOpenForm(false)
    }

    const handlegetStudentId = async (id) => {
        const result = await getStudentId(id)
        setEditingStudent(result)
        setOpenForm(true)
    }

    const handleCloseForm = () => {
        setOpenForm(false)
        setEditingStudent(null)
    }

    const handleDeleteStudent = async (id) => {
        await deleteStudent(id)
        Toast.success("Xóa học sinh thành công")
    }

    const columns = [
        { key: "StudentId", title: "ID" },
        { key: "FullName", title: "Họ tên" },
        { key: "Email", title: "Email" },
        { key: "CreatedAt", title: "Ngày tạo" }
    ]

    return (
        <div>
            <StudentFilter onSearch={searchStudent} onReset={fetchStudents} />

            <DataTable
                columns={columns}
                data={students}
                onAdd={() => setOpenForm(true)}
                renderActions={(row) => (
                    <div className="flex justify-center gap-2">
                        <DeleteConfirmation onDelete={() => handleDeleteStudent(row.StudentId)}>
                            <Trash2 size={18} />
                        </DeleteConfirmation>

                        <Button onClick={() => handlegetStudentId(row.StudentId)}>
                            <Pencil size={18} />
                        </Button>
                    </div>
                )}
            />

            {openForm && (
                <StudentForm
                    student={editingStudent}
                    onClose={handleCloseForm}
                    onSubmit={handleSubmitStudent}
                />
            )}

        </div>
    )
}