import { useForm } from "react-hook-form"
import { useEffect } from "react"

export default function StudentForm({ student, onClose, onSubmit }) {

    const {
        register,
        handleSubmit,
        reset,
        setError,
        formState: { errors }
    } = useForm()

    useEffect(() => {
        if (student) {
            reset(student)
        }
    }, [student, reset])

    const submitForm = async (data) => {
        try {
            await onSubmit(data)
        } catch (err) {

            // lỗi từ server
            setError("Email", {
                type: "server",
                message: err.response?.data?.message || "Server error"
            })

        }
    }

    return (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
            <div className="bg-white p-6 rounded-xl w-[400px]">

                <h2 className="text-xl font-bold mb-4">
                    {student ? "Sửa Student" : "Thêm Student"}
                </h2>

                <form onSubmit={handleSubmit(submitForm)}>

                    {/* FullName */}
                    <input
                        {...register("FullName", {
                            required: "Họ tên không được để trống",
                            minLength: {
                                value: 3,
                                message: "Họ tên phải ít nhất 3 ký tự"
                            }
                        })}
                        className="border p-2 w-full mb-1"
                        placeholder="Họ và tên"
                    />

                    {errors.FullName && (
                        <p className="text-red-500 text-sm mb-2">
                            {errors.FullName.message}
                        </p>
                    )}

                    {/* Email */}
                    <input
                        {...register("Email", {
                            required: "Email không được để trống",
                            pattern: {
                                value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                                message: "Email không hợp lệ"
                            }
                        })}
                        className="border p-2 w-full mb-1"
                        placeholder="Email"
                    />

                    {errors.Email && (
                        <p className="text-red-500 text-sm mb-2">
                            {errors.Email.message}
                        </p>
                    )}

                    <div className="flex justify-end gap-2 mt-3">
                        <button type="button" onClick={onClose}>
                            Hủy
                        </button>

                        <button
                            type="submit"
                            className="bg-blue-500 text-white px-3 py-1 rounded"
                        >
                            {student ? "Cập nhật" : "Lưu"}
                        </button>
                    </div>

                </form>

            </div>
        </div>
    )
}