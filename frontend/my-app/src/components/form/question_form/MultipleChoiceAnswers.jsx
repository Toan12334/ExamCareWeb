import { useEffect, useRef, useState } from "react";
import renderMathInElement from "katex/contrib/auto-render";
import "katex/dist/katex.min.css";

export default function MultipleChoiceAnswers({ formData, setFormData }) {
  const [numOptions, setNumOptions] = useState(formData.Options?.length || 4);

  useEffect(() => {
    if (formData.Options?.length > 0) {
      setNumOptions(formData.Options.length);
    }
  }, [formData.Options]);

  const handleOptionChange = (index, value) => {
    const newOptions = Array.from({ length: numOptions }).map((_, i) => {
      const existing = formData.Options?.[i] || {};
      return {
        label: String.fromCharCode(65 + i),
        content: existing.content || "",
        isCorrect: existing.isCorrect || false,
      };
    });

    newOptions[index] = {
      ...newOptions[index],
      content: value,
    };

    setFormData((prev) => ({ ...prev, Options: newOptions }));
  };

  const handleSelectCorrect = (index) => {
    const newOptions = Array.from({ length: numOptions }).map((_, i) => {
      const existing = formData.Options?.[i] || {};
      return {
        label: String.fromCharCode(65 + i),
        content: existing.content || "",
        isCorrect: i === index,
      };
    });

    setFormData((prev) => ({ ...prev, Options: newOptions }));
  };

  function MathPreview({ content }) {
    const previewRef = useRef(null);

    useEffect(() => {
      const el = previewRef.current;
      if (!el) return;

      el.innerHTML = content ?? "";

      renderMathInElement(el, {
        delimiters: [
          { left: "$$", right: "$$", display: true },
          { left: "$", right: "$", display: false },
        ],
        throwOnError: false,
      });
    }, [content]);

    return (
      <div
        ref={previewRef}
        className="mt-1 text-xs text-gray-700 bg-gray-50 border rounded px-2 py-1 min-h-[28px]"
      />
    );
  }

  return (
    <div className="p-4 border rounded-lg bg-blue-50 shadow-sm">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <label className="font-medium text-blue-800 text-sm">
            Số lượng đáp án:
          </label>
          <select
            value={numOptions}
            onChange={(e) => setNumOptions(parseInt(e.target.value))}
            className="border rounded p-1 text-sm outline-none"
          >
            {[2, 3, 4, 5, 6].map((num) => (
              <option key={num} value={num}>
                {num} đáp án
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="space-y-3">
        {Array.from({ length: numOptions }).map((_, index) => {
          const label = String.fromCharCode(65 + index);
          const isCorrect = formData.Options?.[index]?.isCorrect || false;

          return (
            <div
              key={index}
              className={`flex gap-3 items-center bg-white p-2 rounded border transition-all ${
                isCorrect
                  ? "border-blue-500 ring-1 ring-blue-100"
                  : "border-gray-200"
              }`}
            >
              <div className="flex flex-col items-center min-w-[40px] border-r pr-2">
                <input
                  type="radio"
                  name="quiz-correct"
                  checked={isCorrect}
                  onChange={() => handleSelectCorrect(index)}
                  className="w-4 h-4 cursor-pointer accent-blue-600"
                />
                <span
                  className={`text-[9px] mt-1 font-bold ${
                    isCorrect ? "text-blue-600" : "text-gray-400"
                  }`}
                >
                  ĐÚNG
                </span>
              </div>

              <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-100 font-bold text-gray-600 text-sm">
                {label}
              </div>

              <div className="flex-1">
                <textarea
                  placeholder="Nội dung đáp án..."
                  value={formData.Options?.[index]?.content || ""}
                  onChange={(e) => handleOptionChange(index, e.target.value)}
                  className="w-full outline-none resize-none text-sm py-1 bg-transparent"
                  rows={1}
                />
                <MathPreview content={formData.Options?.[index]?.content || ""} />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}