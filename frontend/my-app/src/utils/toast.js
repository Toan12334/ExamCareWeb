import toast from "react-hot-toast";

const Toast = {
  success: (message, options = {}) =>
    toast.success(message, options),

  error: (message, options = {}) =>
    toast.error(message, options),

  loading: (message = "Đang xử lý...") =>
    toast.loading(message),

  dismiss: (toastId) =>
    toast.dismiss(toastId),

  promise: (promise, messages) =>
    toast.promise(promise, {
      loading: messages.loading || "Đang xử lý...",
      success: messages.success || "Thành công",
      error: messages.error || "Thất bại",
    }),

    examCode: (code, options = {}) =>
      toast(
        `Mã bài thi của bạn: ${code}`,
        {
          duration: 50000,
          position: "top-center",
          style: {
            background: "#1e293b",
            color: "#fff",
            padding: "16px",
            fontSize: "16px",
          },
          ...options,
        }
      ),
};

export default Toast;