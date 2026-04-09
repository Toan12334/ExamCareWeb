export default function SelectField({ label, value, options = [], onChange, error }) {
  return (
    <div>
      <label className="block mb-1 text-sm font-medium">
        {label}
      </label>

      <select
        className="w-full border rounded px-3 py-2"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      >
        <option value="">-- Chọn {label.toLowerCase()} --</option>

        {options.map(o => (
          <option key={o.id} value={o.id}>
            {o.name}
          </option>
        ))}
      </select>
      <span className="text-red-500 text-xs mt-1 italic">
        * {error}
      </span>
    </div>
  )
}