import { useEffect, useState } from "react"
import QuestionGeneralInfo from "./QuestionGeneralInfo.jsx"
import MathEditorVertical from "./MathTextareaTest.jsx"
import QuestionAnswers from "./QuestionAnswers.jsx"
import { uploadMany } from "../../../services/upload.service.js"
import { create, updateQuestion } from "../../../services/question.service.js"
import Button from "../../ui/Button.jsx"
import Swal from 'sweetalert2'
import { useLocation } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

export default function QuestionForm(
) {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({});
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const location = useLocation();
  const { meta } = location.state || {};
  const { formDataEdit, dataMeta } = location.state || {};
  const topics = meta?.topics ?? dataMeta.meta.topics;
  const skills = meta?.skills ?? dataMeta.meta.skills
  const questionTypes = meta?.types ?? dataMeta.meta.types
  const difficulties = meta?.difficults ?? dataMeta.meta.difficults
  useEffect(() => {
    if (formDataEdit) {
      setFormData(formDataEdit.result); // Update formData when formDataEdit is available
    }
  }, [formDataEdit]);  // Run when formDataEdit changes 
  const handleSubmit = async () => {
    try {

      setLoading(true);
      if (formData.QuestionId) {

        const finalLoadUpdate = { ...formData }

        const type = Number(finalLoadUpdate.TypeId);
        if (type === 1) {
          delete finalLoadUpdate.ShortAnswer;
          delete finalLoadUpdate.TrueFalseStatements;
          delete finalLoadUpdate.QuestionId
        } else if (type === 2) {
          delete finalLoadUpdate.ShortAnswer;
          delete finalLoadUpdate.Options;
          delete finalLoadUpdate.QuestionId
        } else if (type === 3) {
          delete finalLoadUpdate.Options;
          delete finalLoadUpdate.TrueFalseStatements;
          delete finalLoadUpdate.QuestionId;

        }
        console.log(finalLoadUpdate)
        const formUpdateFinally = {
          ...finalLoadUpdate,
          TopicId: finalLoadUpdate.TopicId === "" ? null : Number(finalLoadUpdate.TopicId),
          DifficultyId: finalLoadUpdate.DifficultyId === "" ? null : Number(finalLoadUpdate.DifficultyId),
          TypeId: finalLoadUpdate.TypeId === "" ? null : Number(finalLoadUpdate.TypeId),
          QuestionContent: finalLoadUpdate.Content,
        };

        delete formUpdateFinally.Content;
        console.log(formUpdateFinally)
        const newHandleImg = formUpdateFinally.Images
          .filter(image => image.file)

        const respondUpload = await uploadMany(newHandleImg)
        if (respondUpload) {
          const urlObjectArray = respondUpload.map(url => ({ url }))
          formUpdateFinally.Images = [...formUpdateFinally.Images, ...urlObjectArray];
          formUpdateFinally.Images = formUpdateFinally.Images.filter(image => !(image.file && image.url));
        }

        console.log(formUpdateFinally)
        const res = await updateQuestion(formData.QuestionId, formUpdateFinally);
        Swal.fire({
          title: 'Thành công!',
          text: 'Đã update dữ liệu thành công',
          icon: 'success',
          confirmButtonText: 'OK'
        });
        navigate("/question-bank/questions")
        return res
      }
      else {
        const urlFileImgArray = await uploadMany(formData.Images);
        const urlimg = urlFileImgArray.map((url, index) => ({
          url,
          displayOrder: index + 1
        }));

        const finalPayLoad = {
          ...formData, Images: urlimg
        };


        const type = Number(formData.TypeId);
        if (type === 1) {
          delete finalPayLoad.ShortAnswer;
          delete finalPayLoad.TrueFalseStatements;
        } else if (type === 2) {
          delete finalPayLoad.ShortAnswer;
          delete finalPayLoad.Options;
        } else if (type === 3) {
          delete finalPayLoad.Options;
          delete finalPayLoad.TrueFalseStatements;
          finalPayLoad.CorrectAnswer = formData.ShortAnswer;
        }
        console.log(finalPayLoad)
        const res = await create(finalPayLoad);
        Swal.fire({
          title: 'Thành công!',
          text: 'Đã lưu dữ liệu',
          icon: 'success',
          confirmButtonText: 'OK'
        });

        navigate("/question-bank/questions")
        return res;
      }
    } catch (error) {
      const errorMsg =
        error.response?.data?.message || "Đã có lỗi xảy ra";
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="absolute inset-0 z-50 bg-white flex flex-col">
      <div className="h-14 border-b flex items-center justify-between px-6 bg-gray-50">
        <h2 className="text-lg font-semibold text-gray-800">
          {formDataEdit ? "Sửa câu hỏi" : "Tạo câu hỏi mới"}
        </h2>
        <button
          onClick={() => { navigate("/question-bank/questions") }}
          className="text-gray-500 hover:text-red-500 transition-colors"
        >
          ✕
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-10">
        <section>
          <h2 className="text-cyan-600 font-bold mb-4 border-l-4 border-cyan-500 pl-3">
            1. Thông tin chung
          </h2>
          <QuestionGeneralInfo
            formData={formData}
            setFormData={setFormData}
            topics={topics}
            skills={skills}
            difficulties={difficulties}
            questionTypes={questionTypes}
            errorName={error}
          />
        </section>

        <section>
          <h2 className="text-cyan-600 font-bold mb-4 border-l-4 border-cyan-500 pl-3">
            2. Nội dung chính
          </h2>
          <MathEditorVertical
            formData={formData}
            setFormData={setFormData}
          />
        </section>

        <section className="pb-10">
          <h2 className="text-cyan-600 font-bold mb-4 border-l-4 border-cyan-500 pl-3">
            3. Cấu hình đáp án
          </h2>
          <QuestionAnswers
            typeId={formData.TypeId}
            formData={formData}
            setFormData={setFormData}
          />
        </section>
      </div>

      <div className="h-16 border-t flex items-center justify-end px-6 gap-3 bg-gray-50">
        <Button
          onClick={() => { navigate("/question-bank/questions") }}
          variant="outline"
          disabled={loading}
        >
          Hủy
        </Button>
        <Button
          onClick={handleSubmit}
          disabled={loading}
          variant="premium"
        >
          {loading ? "Đang lưu..." : "Lưu câu hỏi"}
        </Button>
      </div>
    </div>
  );
}