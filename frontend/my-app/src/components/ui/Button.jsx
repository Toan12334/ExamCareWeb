export default function Button({
  children,
  variant = "primary",
  onClick,
  className = "",
  disabled = false,
  type = "button",
}) {
  const styles = {
    primary: "bg-blue-600 text-white shadow-sm hover:bg-blue-700",
    danger: "bg-rose-500 text-white shadow-sm hover:bg-rose-600",
    success: "bg-emerald-500 text-white shadow-sm hover:bg-emerald-600",
    outline: "border-2 border-blue-600 text-blue-600 bg-transparent hover:bg-blue-600 hover:text-white",
    ghost: "text-gray-600 bg-transparent hover:bg-gray-100",
    premium: "bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white shadow-md hover:opacity-90",
    soft: "bg-teal-50 text-teal-700 hover:bg-teal-100",
    reset: "bg-transparent text-blue-700 font-semibold border border-blue-500 hover:bg-blue-500 hover:text-white hover:border-transparent",
  };

  const baseClasses =
    "px-5 py-2 rounded-lg font-medium transition-all duration-200 flex items-center justify-center gap-2";

  const enabledClasses = "active:scale-95";
  const disabledClasses = "opacity-50 cursor-not-allowed pointer-events-none";

  return (
    <button
      type={type}
      onClick={disabled ? undefined : onClick}
      disabled={disabled}
      aria-disabled={disabled}
      className={`
        ${baseClasses}
        ${disabled ? disabledClasses : `${styles[variant] || styles.primary} ${enabledClasses}`}
        ${className}
      `}
    >
      {children}
    </button>
  );
}