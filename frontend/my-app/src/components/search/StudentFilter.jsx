import { useForm } from "react-hook-form"
import Button from "../ui/Button"

export default function StudentFilter({ onSearch, onReset }) {

  const { register, handleSubmit, reset } = useForm({
    defaultValues: {
      keyword: ""
    }
  })

  const handleSearch = (data) => {
    if (onSearch) {
      onSearch(data.keyword.trim())
    }
  }

  const handleReset = () => {
    reset()

    if (onReset) {
      onReset()
    }
  }

  return (
    <form
      onSubmit={handleSubmit(handleSearch)}
      className="bg-white p-4 rounded-xl shadow mb-4 flex gap-3"
    >

      {/* Input tìm kiếm */}
      <input
        {...register("keyword", {
          validate: (value) =>
            value.trim() !== "" || "Không được nhập toàn dấu cách"
        })}
        placeholder="Tìm theo tên hoặc email..."
        className="border rounded-lg px-3 py-2 flex-1"
      />

      {/* Button */}
      <Button type="submit">
        Tìm kiếm
      </Button>

      <Button variant="reset" type="button" onClick={handleReset}>
        Reset
      </Button>

    </form>
  )
}