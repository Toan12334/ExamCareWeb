import { useEffect } from 'react';
import renderMathInElement from 'katex/contrib/auto-render';
import 'katex/dist/katex.min.css';
import MathEditorVertical from './MathTextareaTest';
export default function QuestionViewForm({ onClose, formData }) {

  useEffect(() => {
    // This ensures KaTeX renders math after React has finished updating the DOM
    const element = document.getElementById('answers-section');
    if (element) {
      renderMathInElement(element, {
        delimiters: [
          { left: "$", right: "$", display: false }, // Inline math
          { left: "$$", right: "$$", display: true }, // Block math
        ]
      });
    }
  }, [formData]); // Re-run whenever formData changes

  return (
    <div className="absolute inset-0 z-50 bg-white flex flex-col">

      {/* HEADER */}
      <div className="h-14 border-b flex items-center justify-between px-6 bg-gray-50">
        <h2 className="text-lg font-semibold text-gray-800">
          Xem chi tiết câu hỏi
        </h2>

        <button
          onClick={onClose}
          className="text-gray-500 hover:text-red-500 transition-colors"
        >
          ✕
        </button>
      </div>

      {/* BODY */}
      <div className="flex-1 overflow-y-auto p-6 space-y-10">

        {/* SECTION 1 */}
        <section>
          <h2 className="text-cyan-600 font-bold mb-4 border-l-4 border-cyan-500 pl-3">
            1. Thông tin chung
          </h2>

          <div className="space-y-3 text-gray-700">
            <p><b>Chủ đề: </b>{formData.TopicName}</p>
            <p><b>Kỹ năng: </b> {formData.Skills}</p>
            <p><b>Độ khó: </b> {formData.Difficulty}</p>
            <p><b>Loại câu hỏi: </b> {formData.TypeId === 1 ? "Trắc nhiệm" : formData.TypeId === 2 ? "Đúng/Sai" : "Trả lời ngắn"}</p>
          </div>
        </section>

        {/* SECTION 2 */}
        <section>
          <h2 className="text-cyan-600 font-bold mb-4 border-l-4 border-cyan-500 pl-3">
            2. Nội dung chính
          </h2>

          <div className="border rounded-lg p-4 bg-gray-50">
            <p>Đây là nội dung câu hỏi (test UI)</p>
            <MathEditorVertical formData={formData} />
          </div>
        </section>

        {/* SECTION 3 */}
        <section id="answers-section" className="pb-10">
          <h2 className="text-cyan-600 font-bold mb-4 border-l-4 border-cyan-500 pl-3">
            3. Cấu hình đáp án
          </h2>

          <div className="space-y-2">
            {/* Render answers for different TypeId */}
            {formData.TypeId === 1 &&
              formData.Details.map((item) => (
                <p
                  key={item.OptionLabel}
                  className={item.IsCorrect ? "text-green-600 font-semibold" : ""}
                >
                  {item.OptionLabel}. {item.OptionContent}
                </p>
              ))}

            {formData.TypeId === 2 &&
              formData.Details.map((item) => (
                <p
                  key={item.StatementLabel}
                  className={item.IsCorrect ? "text-green-600 font-semibold" : ""}
                >
                  {item.StatementLabel}. {item.StatementContent}
                </p>
              ))}

            {formData.TypeId === 3 && (
              <div className="pt-2 space-y-1">
                <p className="text-green-600 font-semibold">
                  ✔ Đáp án đúng: {formData.Details.correctAnswer}
                </p>
              </div>
            )}

            {/* Display attempts and average time */}
            <div className="pt-2 space-y-1">
              <p>
                <span className="font-semibold">Số lượt thử: </span>
                {formData.TotalAttempts}
              </p>
              <p>
                <span className="font-semibold">Thời gian trung bình: </span>
                {formData.AvgTimeSpentSeconds??"Chưa thử nghiệm trong đề"} giây
              </p>
            </div>
          </div>
        </section>

      </div>

      {/* FOOTER */}
      <div className="h-16 border-t flex items-center justify-end px-6 gap-3 bg-gray-50">
        <button
          onClick={onClose}
          className="px-4 py-2 border rounded-lg hover:bg-gray-100"
        >
          Đóng
        </button>
      </div>
    </div>
  );
}