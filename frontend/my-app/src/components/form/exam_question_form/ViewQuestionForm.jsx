import Preview from "../../ui/PreviewMathKatex"
import ImageUrlPreview from "../../ui/ImageUrlPreview"
import { TrueFalseTable, MutipleChoice } from "./FormAnswer"
export default function ViewQuestionForm({ onClose, formData }) {
    console.log(formData)
    return (
        <div className="w-full max-w-2xl max-h-[80vh] bg-white rounded-xl shadow-xl border flex flex-col overflow-hidden">

            {/* Header (cố định) */}
            <div className="flex items-center justify-between px-5 py-3 border-b bg-gray-50">
                <h2 className="font-semibold text-lg">Xem trước câu hỏi</h2>
                <button
                    onClick={onClose}
                    className="text-gray-500 hover:text-black text-xl font-bold"
                >
                    ×
                </button>
            </div>

            {/* Body (scroll ở đây) */}
            <div className="p-5 overflow-y-auto space-y-5">


                {/* Preview */}
                <div className="bg-gray-50 border rounded-lg p-4">
                    <p className="mb-2 font-medium">Xem trước:</p>
                    <div className="min-h-[80px]">
                        <Preview content={formData.QuestionContent} />
                    </div>
                    <div>
                        <ImageUrlPreview fit="contain" src={formData.Images} />
                    </div>
                    <div>
                        {(() => {
                            switch (formData.TypeId) {
                                case 1:
                                    return <div><MutipleChoice options={formData.Details} /></div>;
                                case 2:
                                    return <TrueFalseTable statements={formData.statements ?? formData.Details} />
                                case 3:
                                    return `Đáp án: ${formData.Details.correctAnswer}`;
                            }
                        })()}
                    </div>
                </div>
            </div>
        </div>
    )




}


