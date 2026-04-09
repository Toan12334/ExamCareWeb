import { useForm } from "react-hook-form"
import { useEffect } from "react"
import Button from "../ui/Button"

export default function TopicForm({ topic, onSubmit, onCancel }) {

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm({
    defaultValues: {
      TopicName: ""
    }
  })

  // 👉 Khi có topic (edit) thì set lại form
  useEffect(() => {
    if (topic) {
      reset({
        TopicName: topic.TopicName
      })
    } else {
      reset({
        TopicName: ""
      })
    }
  }, [topic, reset])

  const submitHandler = (data) => {
    onSubmit({
      TopicId: topic?.TopicId, // 👈 quan trọng
      TopicName: data.TopicName.trim()
    })
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
      <form
        onSubmit={handleSubmit(submitHandler)}
        className="bg-white rounded-xl w-[400px] p-6 shadow-lg"
      >
        <h2 className="text-xl font-semibold mb-4">
          {topic ? "Sửa Topic" : "Thêm mới"}
        </h2>

        <div className="mb-4">
          <input
            {...register("TopicName", {
              required: "Tên chủ đề là bắt buộc",
              validate: (value) =>
                value.trim() !== "" || "Không được nhập khoảng trắng"
            })}
            placeholder="Tên chủ đề"
            className="w-full border rounded-lg px-3 py-2"
          />

          {errors.TopicName && (
            <p className="text-red-500 text-sm mt-1">
              {errors.TopicName.message}
            </p>
          )}
        </div>

        <div className="flex justify-end gap-2">
          <Button type="submit" variant="primary">
            Lưu
          </Button>
          <Button type="button" variant="secondary" onClick={onCancel}>
            Hủy
          </Button>
        </div>
      </form>
    </div>
  )
}