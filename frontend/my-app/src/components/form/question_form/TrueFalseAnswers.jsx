import { useEffect, useRef, useState } from "react";
import renderMathInElement from "katex/contrib/auto-render";
import "katex/dist/katex.min.css";

export default function TrueFalseAnswers({ formData, setFormData }) {
  const [numOptions, setNumOptions] = useState(
    formData.TrueFalseStatements?.length || 4
  );

  useEffect(() => {
    if (formData.TrueFalseStatements?.length > 0) {
      setNumOptions(formData.TrueFalseStatements.length);
    }
  }, [formData.TrueFalseStatements]);

  const handleTFChange = (index, field, value) => {
    const newStatements = Array.from({ length: numOptions }).map((_, i) => {
      const existing = formData.TrueFalseStatements?.[i] || {};

      return {
        label: String.fromCharCode(97 + i),
        content: existing.content || "",
        isCorrect: existing.isCorrect ?? false,
      };
    });

    newStatements[index][field] = value;

    setFormData((prev) => ({
      ...prev,
      TrueFalseStatements: newStatements,
    }));
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
    <div className="p-4 border rounded-lg bg-green-50 shadow-sm">
      <div className="mb-4 flex items-center gap-3">
        <label className="font-medium text-green-800 text-sm">
          Số lượng nhận định:
        </label>
        <select
          value={numOptions}
          onChange={(e) => setNumOptions(parseInt(e.target.value))}
          className="border rounded p-1 text-sm outline-none"
        >
          {[1, 2, 3, 4, 5, 6].map((num) => (
            <option key={num} value={num}>
              {num} câu
            </option>
          ))}
        </select>
      </div>

      <div className="space-y-3">
        {Array.from({ length: numOptions }).map((_, index) => {
          const isCorrect =
            formData.TrueFalseStatements?.[index]?.isCorrect ?? false;

          return (
            <div
              key={index}
              className={`flex gap-3 items-center bg-white p-2 rounded border transition-all ${
                isCorrect
                  ? "border-green-400 ring-1 ring-green-100"
                  : "border-gray-200"
              }`}
            >
              <div className="flex items-center justify-center min-w-[28px] h-7 rounded bg-green-100 font-bold text-green-700 text-xs">
              {String.fromCharCode(97 + index)}
              </div>

              <div className="flex-1">
                <textarea
                  placeholder={`Nhập nhận định thứ ${String.fromCharCode(97 + index)}...`}
                  value={formData.TrueFalseStatements?.[index]?.content || ""}
                  onChange={(e) =>
                    handleTFChange(index, "content", e.target.value)
                  }
                  className="w-full border-b focus:border-green-500 outline-none resize-none text-sm py-1"
                  rows={1}
                />
                <MathPreview
                  content={formData.TrueFalseStatements?.[index]?.content || ""}
                />
              </div>

              <div className="flex flex-col gap-2 min-w-[80px] border-l pl-4 justify-center">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name={`tf-radio-${index}`}
                    checked={isCorrect === true}
                    onChange={() => handleTFChange(index, "isCorrect", true)}
                    className="w-4 h-4 accent-green-600 cursor-pointer"
                  />
                  <span
                    className={`text-xs font-bold ${
                      isCorrect === true ? "text-green-600" : "text-gray-500"
                    }`}
                  >
                    Đúng
                  </span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name={`tf-radio-${index}`}
                    checked={isCorrect === false}
                    onChange={() => handleTFChange(index, "isCorrect", false)}
                    className="w-4 h-4 accent-red-500 cursor-pointer"
                  />
                  <span
                    className={`text-xs font-bold ${
                      isCorrect === false ? "text-red-500" : "text-gray-500"
                    }`}
                  >
                    Sai
                  </span>
                </label>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}