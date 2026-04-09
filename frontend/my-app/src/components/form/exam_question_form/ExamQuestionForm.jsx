import { useState, useEffect } from "react";
import DataTable2 from "../../table/DataTable2";
import { questionColumnsOfAddExam } from "../../../constants/question.columns.js";
import useQuestion from "../../../hooks/useQuestion.js";
import Button from "../../ui/Button";
import { Eye } from "lucide-react";
import Input from "../../ui/Input.jsx";
import QuestionCard from "./Card.jsx";
import useExam from "../../../hooks/useExam.js";
import Swal from 'sweetalert2'
import { useNavigate } from "react-router-dom";
import { statisticTypeQuestion } from "../../../utils/examBuilderHelpers.js"
import { useParams } from "react-router-dom";
import ViewQuestionForm from "./ViewQuestionForm.jsx";
export default function ExamBuilderRedesign() {
  const { questions, filters, pagination, onReset, onSearch, onPageChange, getViewAnaLystQuestion } = useQuestion({ enableUrlSync: false });
  const [selectedQuestions, setSelectedQuestions] = useState([]);
  const [view, setView] = useState(false)
  const { createExam, error, fetchExamById, updateExam } = useExam();
  const [examName, setExamName] = useState("");
  const [duration, setDuration] = useState("");
  const [formDataExamQuestion, setformDataExamQuestion] = useState({})
  const { id } = useParams();
  useEffect(() => {
    const loadExam = async () => {
      const result = await fetchExamById(id);
      setDuration(result.data.duration);
      setExamName(result.data.examName);
      setSelectedQuestions(result.data.questions)
    };

    if (id) loadExam();

  }, [id]);

  const navigate = useNavigate();
  const isSelected = (questionId) => {
    return selectedQuestions.some((item) => item.QuestionId === questionId);
  };

  const handleToggleQuestion = (row) => {
    console.log("LIST QuestionPreview:", row.QuestionPreview);
    setSelectedQuestions((prev) => {
      const exists = prev.some((item) => item.QuestionId === row.QuestionId);
      if (exists) {
        return prev.filter((item) => item.QuestionId !== row.QuestionId);
      }
      return [...prev, row];
    });
  };
  console.log(selectedQuestions)
  const handleRemoveQuestion = (questionId) => {
    setSelectedQuestions((prev) =>
      prev.filter((item) => item.QuestionId !== questionId)
    );
  };

  const handleView = async (id) => {
    const result = await getViewAnaLystQuestion(id)
    console.log("DETAIL DATA:", result.data);
    console.log("DETAIL QuestionPreview:", result.data?.QuestionPreview);
    console.log("DETAIL QuestionContent:", result.data?.QuestionContent);
    setformDataExamQuestion(result.data)
    console.log(result)
    return result
  }
  const handleSave = async () => {
    const payload = {
      examName,
      duration: Number(duration),
      questions: selectedQuestions.map((item, index) => ({
        questionId: item.QuestionId,
        part: 1,
        questionOrder: index + 1,
      }))
    };

    if (id) {
      await updateExam(id, payload)
      Swal.fire({
        title: 'Thành công!',
        text: 'Đã lưu dữ liệu',
        icon: 'success',
        confirmButtonText: 'OK'
      });
    }

    else {
      await createExam(payload)
      Swal.fire({
        title: 'Thành công!',
        text: 'Đã lưu dữ liệu',
        icon: 'success',
        confirmButtonText: 'OK'
      });
    }
    navigate("/exam-manage/exam-papers")
  };

  const handleCancel = () => {
    setExamName("");
    setDuration("");
    setSelectedQuestions([]);
    navigate("/exam-manage/exam-papers");
  };

  return (
    <div className="space-y-6 p-6">
      <div className="rounded-xl border bg-white p-4 shadow">
        <Input
          error={error}
          type="input"
          label="Tên bài thi:"
          value={examName}
          onChange={(e) => setExamName(e.target.value)}
        />
        <Input
          error={error}
          type="number"
          label="Tổng thời gian:"
          value={duration}
          onChange={(e) => setDuration(e.target.value)}
        />
      </div>

      <div className="flex items-start gap-4">
        <div className="w-1/2 rounded-xl border bg-red-100 p-4">
          <h2 className="mb-4 text-center text-lg font-semibold">Các câu trong đề</h2>
          <p>Trắc nhiệm:{statisticTypeQuestion(selectedQuestions).multipleChoice}  Đúng/sai:{statisticTypeQuestion(selectedQuestions).trueFalse}  Trả lời ngắn:{statisticTypeQuestion(selectedQuestions).shortAnswer}</p>
          <div className="max-h-[1150px] overflow-y-auto pr-2">
            {selectedQuestions.length === 0 ? (
              <div className="text-sm text-gray-600">
                Danh sách các câu đã chọn sẽ hiển thị ở đây.
              </div>
            ) : (
              <div className="space-y-4">
                {selectedQuestions.map((question) => (
                  <QuestionCard onView={() => { handleView(question.QuestionId); setView(true) }}
                    key={question.QuestionId}
                    data={question}
                    onRemove={handleRemoveQuestion}
                  />
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="w-1/2 rounded-xl border bg-blue-100 p-4">
          <h2 className="mb-4 text-center text-lg font-semibold">Thao tác</h2>

          <DataTable2
            pagination={pagination}
            onPageChange={onPageChange}
            onReset={onReset}
            onSearch={onSearch}
            data={questions}
            filters={filters}
            columns={questionColumnsOfAddExam}
            renderAction={(row) => (
              <div className="flex items-center gap-2">
                <Button
                  variant="soft"
                  onClick={() => { handleView(row.QuestionId); setView(true) }}
                  className="bg-orange-300"
                >
                  <Eye size={18} />
                </Button>

                <Input
                  type="checkbox"
                  checked={isSelected(row.QuestionId)}
                  onChange={() => handleToggleQuestion(row)}
                />
              </div>
            )

            }
          />
          {view && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/20 rounded-xl">
              <ViewQuestionForm formData={formDataExamQuestion} onClose={() => {setformDataExamQuestion({});setView(false)}} />
            </div>
          )}
        </div>
      </div>

      <div className="flex justify-end gap-3 border-t pt-4">
        <Button variant="soft" onClick={handleCancel}>
          Hủy
        </Button>

        <Button variant="premium" onClick={handleSave}>
          Lưu
        </Button>
      </div>
    </div>
  );
}