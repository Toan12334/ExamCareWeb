import MultipleChoiceAnswers from "./MultipleChoiceAnswers";
import TrueFalseAnswers from "./TrueFalseAnswers";
import ShortAnswerField from "./ShortAnswerField";

export default function QuestionAnswers({ typeId, formData, setFormData }) {
  const currentType = Number(typeId);

  switch (currentType) {
    case 1:
      return (
        <div className="w-full mt-2">
          <MultipleChoiceAnswers formData={formData} setFormData={setFormData} />
        </div>
      );

    case 2:
      return (
        <div className="w-full mt-2">
          <TrueFalseAnswers formData={formData} setFormData={setFormData} />
        </div>
      );

    case 3:
      return (
        <div className="w-full mt-2">
          <ShortAnswerField formData={formData} setFormData={setFormData} />
        </div>
      );

    default:
      return (
        <div className="w-full mt-2">
          <div className="p-10 border-2 border-dashed rounded-lg text-center text-gray-400">
            Vui lòng chọn loại câu hỏi từ phần Thông tin chung
          </div>
        </div>
      );
  }
}