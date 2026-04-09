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
};

export default Toast;