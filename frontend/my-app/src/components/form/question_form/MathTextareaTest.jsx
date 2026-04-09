import { useEffect, useRef } from "react";
import renderMathInElement from "katex/contrib/auto-render";
import { useDropzone } from "react-dropzone";
import "katex/dist/katex.min.css";
import "../../../css/MathEditorVertical.css";

export default function MathEditorVertical({ formData, setFormData }) {
  const previewRef = useRef();

  useEffect(() => {
    if (previewRef.current) {
      previewRef.current.innerHTML =
        formData.Content ?? formData.QuestionContent ?? "";

      renderMathInElement(previewRef.current, {
        delimiters: [
          { left: "$$", right: "$$", display: true },
          { left: "$", right: "$", display: false },
        ],
        throwOnError: false,
      });
    }
  }, [formData.Content, formData.QuestionContent]);

  const handleTextChange = (e) => {
    if (!setFormData) return;

    setFormData((prev) => ({
      ...prev,
      Content: e.target.value,
    }));
  };

  const onDrop = (acceptedFiles) => {
    if (!setFormData) return;

    const mapped = acceptedFiles.map((file) => ({
      file,
      url: URL.createObjectURL(file),
    }));

    setFormData((prev) => ({
      ...prev,
      Images: [...(prev.Images || []), ...mapped],
    }));
  };

  const removeImage = (imgToRemove) => {
    if (!setFormData) return;

    setFormData((prev) => ({
      ...prev,
      Images: (prev.Images || []).filter((img) => img !== imgToRemove),
    }));

    if (imgToRemove?.file && imgToRemove?.url) {
      URL.revokeObjectURL(imgToRemove.url);
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "image/*": [] },
  });

  return (
    <div className="math-editor-container">
      <h3 className="text-sm font-bold text-gray-600 mb-2">
        Nội dung câu hỏi (hỗ trợ KaTeX)
      </h3>

      {/* Text input */}
      <textarea
        value={formData.Content ?? formData.QuestionContent ?? ""}
        onChange={handleTextChange}
        placeholder="Nhập nội dung câu hỏi, công thức toán dùng $$ ... $$ hoặc $ ... $"
        className="math-textarea"
        rows={6}
      />

      {/* Upload ảnh */}
      <div
        {...getRootProps()}
        className={`math-dropzone mt-4 border-2 border-dashed p-4 text-center cursor-pointer rounded-lg transition-all ${
          isDragActive
            ? "border-blue-500 bg-blue-50"
            : "border-gray-300 hover:border-blue-400"
        }`}
      >
        <input {...getInputProps()} />
        <p className="text-gray-500 font-medium">
          📷 Kéo thả hoặc click để thêm ảnh minh họa
        </p>
      </div>

      {/* Preview */}
      <div className="preview-label text-xs text-gray-400 mt-2 italic">
        Xem trước hiển thị:
      </div>
      <div
        ref={previewRef}
        className="math-preview border p-4 rounded bg-gray-50 min-h-[50px] mt-1"
      />

      {/* Danh sách ảnh */}
      <div className="image-list flex flex-wrap gap-3 mt-4">
        {formData.Images?.map((img, index) => (
          <div
            key={index}
            className="image-item relative w-24 h-24 border rounded overflow-hidden shadow-sm group"
          >
            <img
              src={img.url ?? img.ImageUrl}
              alt="preview"
              className="w-full h-full object-cover"
            />

            <button
              onClick={() => removeImage(img)}
              className="remove-btn absolute top-1 right-1 bg-red-500 text-white w-5 h-5 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
            >
              ✕
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}