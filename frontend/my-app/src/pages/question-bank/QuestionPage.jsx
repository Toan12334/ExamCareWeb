import DataTable2 from "../../components/table/DataTable2"
import { questionColumns } from "../../constants/question.columns.js"
import useQuestion from "../../hooks/useQuestion"
import Button from "../../components/ui/Button.jsx"
import { Pencil, Trash2, Eye } from 'lucide-react';
import QuestionForm from "../../components/form/question_form/QuestionForm.jsx"
import DeleteConfirmation from "../../components/modal/DeleteConfirmation.jsx";
import Swal from 'sweetalert2'
import { useState } from "react";
import QuestionViewForm from "../../components/form/question_form/QuestionViewForm.jsx";
import { useNavigate } from 'react-router-dom';
export default function QuestionPage() {
  const [formData, setFormData] = useState({});
  const { questions, filters, pagination, meta, onSearch, onPageChange, getViewAnaLystQuestion, onReset, getByIdQuestionID, fetchQuestions, deleteQuestionById } = useQuestion({ enableUrlSync: true });
  const [opentFormView, setOpenFormView] = useState(false)
  const navigate = useNavigate();
  const handleAdd = () => {
    setFormData({
      TopicId: "",
      SkillIds: [],
      DifficultyId: "",
      TypeId: "",
      Content: "",
      Images: [],
      Options: [],
      TrueFalseStatements: [],
      ShortAnswer: "",
      CorrectAnswer: "",
      add: true
    })
    navigate("/question-bank/create", { state: { meta } });

  }

  const handleEdit = async (id) => {
    const result = await getByIdQuestionID(id);
    console.log('Fetched Result:', result); // Kiểm tra dữ liệu trả về
    setFormData({ ...result, QuestionId: id });
    navigate(`/question-bank/edit/${id}`, { state: { formDataEdit: { result, QuestionId: id }, dataMeta: { meta } } });
  }

  const handleView = async (id) => {
    const result = await getViewAnaLystQuestion(id)
    setFormData({ ...result.data, preview: true })
    setOpenFormView(true)

  }

  const handleDelete = async (row) => {
    const result = await deleteQuestionById(row.QuestionId)
    Swal.fire({
      title: 'Thành công!',
      text: 'Đã xóa dữ liệu thành công',
      icon: 'success',
      confirmButtonText: 'OK'
    });
    fetchQuestions()
    return result
  }
  console.log(formData)
  return (
    <div>
      <DataTable2
        title="Quản lý câu hỏi"
        filters={filters}
        columns={questionColumns}
        data={questions}
        pagination={pagination}
        onSearch={onSearch}
        onPageChange={onPageChange}
        onReset={onReset}
        onAdd={handleAdd}
        renderAction={(row) => (
          <>
            <Button variant="soft"
              onClick={() => handleView(row.QuestionId)} className="bg-orange-300"
            >
              <Eye size={18} />
            </Button>
            <Button onClick={() => handleEdit(row.QuestionId)} variant="premium">
              <Pencil size={18} />
            </Button>
            <DeleteConfirmation onDelete={() => handleDelete(row)} />

          </>
        )}
      />

      {opentFormView && (
        <QuestionViewForm formData={formData} onClose={() => setOpenFormView(false)} />
      )}
    </div>
  )
}