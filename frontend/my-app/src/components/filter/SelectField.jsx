export default function SelectField({
    label,
    name,
    register,
    options = [],
    placeholder = "Chọn..."
  }) {
    return (
      <div className="flex flex-col">
        {label && (
          <label className="text-sm font-medium mb-1">
            {label}
          </label>
        )}
  
        <select
          {...register(name)}
          className="border border-gray-300 rounded-lg px-3 py-2 w-56 focus:outline-none focus:ring-2 focus:ring-blue-200"
        >
          <option value="">{placeholder}</option>
  
          {options.map((item) => (
            <option key={item.value} value={item.value}>
              {item.label}
            </option>
          ))}
        </select>
      </div>
    )
  }