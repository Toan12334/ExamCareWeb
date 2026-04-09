import clsx from "clsx";

export default function Input({
  label,
  name,
  type = "text",
  value,
  onChange,
  placeholder = "",
  error = "",
  disabled = false,
  required = false,
  className = "",
  inputClassName = "",
  ...props
}) {
  return (
    <div className={clsx("w-full", className)}>
      {label && (
        <label htmlFor={name} className="block mb-1 font-semibold text-sm">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}

      <input
        id={name}
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        disabled={disabled}
        className={clsx(
          "w-full rounded-lg border px-3 py-2 outline-none transition",
          "focus:ring-2 focus:ring-blue-400",
          disabled && "bg-gray-100 cursor-not-allowed",
          error ? "border-red-500" : "border-gray-300",
          inputClassName
        )}
        {...props}
      />

      {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
    </div>
  );
}