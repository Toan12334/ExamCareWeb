export default function ShortAnswerField({ formData, setFormData }) {
    return (
      <div className="p-4 border rounded bg-yellow-50">
        <p className="font-medium mb-2 text-yellow-800 text-sm">Đáp án chính xác:</p>
        <textarea
          className="w-full p-3 border rounded focus:ring-2 focus:ring-yellow-400 outline-none min-h-[80px] text-sm"
          placeholder="Nhập nội dung đáp án ngắn..."
          value={formData.ShortAnswer ?? formData.CorrectAnswer ?? ""}
          onChange={(e) =>
            setFormData((prev) => ({
              ...prev,
              ShortAnswer: e.target.value,
              CorrectAnswer: e.target.value,
            }))
          }
        />
      </div>
    );
  }