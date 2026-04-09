import { Toaster } from "react-hot-toast";

export default function ToastProvider() {
  return (
    <Toaster
      position="top-right"
      gutter={12}
      containerClassName="mt-6 mr-6"
      toastOptions={{
        duration: 3000,

        className:
          "flex items-center gap-3 rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-800 shadow-lg transition-all",

        success: {
          className:
            "flex items-center gap-3 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-emerald-900 shadow-md",
          iconTheme: {
            primary: "#10b981",
            secondary: "#ecfdf5",
          },
        },

        error: {
          className:
            "flex items-center gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-red-900 shadow-md",
          iconTheme: {
            primary: "#ef4444",
            secondary: "#fef2f2",
          },
        },

        loading: {
          className:
            "flex items-center gap-3 rounded-xl border border-blue-200 bg-blue-50 px-4 py-3 text-blue-900 shadow-md",
          iconTheme: {
            primary: "#3b82f6",
            secondary: "#eff6ff",
          },
        },
      }}
    />
  );
}