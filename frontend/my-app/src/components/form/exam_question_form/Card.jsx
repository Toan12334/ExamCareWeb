import { Eye, Trash2 } from "lucide-react";
import Preview from "../../ui/PreviewMathKatex";

export default function QuestionCard({
  data,
  onRemove,
  onView,
  className = "",
}) {
  const {
    QuestionId,
    QuestionPreview,
    TopicName,
    TypeName,
    Skills,
    Difficulty,
  } = data || {};

  const skills = Array.isArray(Skills)
    ? Skills
    : typeof Skills === "string" && Skills.trim() !== ""
      ? Skills.split(",").map((item) => item.trim())
      : [];

  return (
    <div
      className={`w-full rounded-2xl border border-gray-200 bg-white p-4 shadow-sm ${className}`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1">
          <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-teal-600">
            Câu hỏi {QuestionId ? `#${QuestionId}` : ""}
          </p>

          <Preview content={QuestionPreview || ""} />
        </div>

        <div className="flex shrink-0 items-center gap-2">
          {onView && (
            <button
              type="button"
              onClick={() => onView(data)}
              className="flex items-center gap-1 rounded-lg border border-blue-200 px-3 py-1.5 text-sm text-blue-600 transition hover:bg-blue-50"
              title="Xem chi tiết"
            >
              <Eye size={16} />
              <span>Xem</span>
            </button>
          )}

          {onRemove && (
            <button
              type="button"
              onClick={() => onRemove(QuestionId)}
              className="flex items-center gap-1 rounded-lg border border-red-200 px-3 py-1.5 text-sm text-red-500 transition hover:bg-red-50"
              title="Xóa câu hỏi"
            >
              <Trash2 size={16} />
              <span>Xóa</span>
            </button>
          )}
        </div>
      </div>

      <div className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-2">
        <div className="rounded-xl bg-gray-50 p-3">
          <p className="text-sm font-medium text-gray-500">Chủ đề</p>
          <p className="mt-1 text-sm font-semibold text-gray-800">
            {TopicName || "--"}
          </p>
        </div>

        <div className="rounded-xl bg-gray-50 p-3">
          <p className="text-sm font-medium text-gray-500">Thể loại</p>
          <p className="mt-1 text-sm font-semibold text-gray-800">
            {TypeName || "--"}
          </p>
        </div>

        <div className="rounded-xl bg-gray-50 p-3">
          <p className="text-sm font-medium text-gray-500">Độ khó</p>
          <p className="mt-1 text-sm font-semibold text-gray-800">
            {Difficulty || "--"}
          </p>
        </div>
      </div>

      <div className="mt-4">
        <p className="mb-2 text-sm font-medium text-gray-500">Kỹ năng</p>

        {skills.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {skills.map((skill, index) => (
              <span
                key={`${skill}-${index}`}
                className="rounded-full bg-blue-100 px-3 py-1 text-sm font-medium text-blue-700"
              >
                {skill}
              </span>
            ))}
          </div>
        ) : (
          <p className="text-sm text-gray-400">Chưa có kỹ năng</p>
        )}
      </div>
    </div>
  );
}