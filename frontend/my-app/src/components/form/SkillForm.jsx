  import { useForm } from "react-hook-form"
  import Button from "../ui/Button"

  export default function SkillForm({
    topics = [],
    onSubmit,
    onCancel,
    defaultValues = {},
  }) {
    const isEdit = !!defaultValues?.SkillId

    const {
      register,
      handleSubmit,
      formState: { errors }
    } = useForm({
      defaultValues: {
        SkillName: defaultValues.SkillName || "",
        TopicId: defaultValues.TopicId || ""
      }
    })

    const submitHandler = (data) => {
      onSubmit({
        ...data,
        SkillId: defaultValues.SkillId, // 👈 chỉ có khi edit
        TopicId: Number(data.TopicId)
      })
    }

    return (
      <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">

        <div className="bg-white p-6 rounded-xl w-[400px] shadow-lg">

          {/* Title */}
          <h2 className="text-lg font-bold mb-4">
            {isEdit ? "Cập nhật kỹ năng" : "Thêm kỹ năng"}
          </h2>

          <form onSubmit={handleSubmit(submitHandler)} className="space-y-4">

            {/* SkillName */}
            <div>
              <label className="block mb-1 font-medium">Tên kỹ năng</label>
              <input
                type="text"
                {...register("SkillName", { required: "Vui lòng nhập tên kỹ năng" })}
                className="w-full border px-3 py-2 rounded"
              />
              {errors.SkillName && (
                <p className="text-red-500 text-sm">
                  {errors.SkillName.message}
                </p>
              )}
            </div>

            {/* Topic */}
            <div>
              <label className="block mb-1 font-medium">Chủ đề</label>
              <select
                {...register("TopicId", { required: "Vui lòng chọn chủ đề" })}
                className="w-full border px-3 py-2 rounded"
              >
                <option value="">-- Chọn chủ đề --</option>
                {topics.map((t) => (
                  <option key={t.TopicId} value={t.TopicId}>
                    {t.TopicName}
                  </option>
                ))}
              </select>

              {errors.TopicId && (
                <p className="text-red-500 text-sm">
                  {errors.TopicId.message}
                </p>
              )}
            </div>

            {/* Actions */}
            <div className="flex justify-end gap-2">
              <Button type="button" variant="secondary" onClick={onCancel}>
                Hủy
              </Button>
              <Button type="submit" variant="primary">
                {isEdit ? "Cập nhật" : "Lưu"}
              </Button>
            </div>

          </form>
        </div>
      </div>
    )
  }