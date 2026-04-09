export default function DateField({
    label,
    name,
    register
  }) {
    return (
      <div className="flex flex-col">
        {label && (
          <label className="text-sm font-medium mb-1">
            {label}
          </label>
        )}
  
        <input
          type="date"
          {...register(name)}
          className="border border-gray-300 rounded-lg px-3 py-2 w-56 focus:outline-none focus:ring-2 focus:ring-blue-200"
        />
      </div>
    )
  }