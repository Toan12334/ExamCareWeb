
export default function MultiCheckbox({
    label,
    options = [],
    selected = [],
    onChange,
    disabled,
    emptyText
  }) {
    return (
      <div className="col-span-2">
        <label className="block mb-1 text-sm font-medium">
          {label}
        </label>
  
        <div className="border rounded p-3 grid grid-cols-3 gap-2 max-h-40 overflow-y-auto">
  
          {disabled && (
            <p className="text-gray-400 text-sm col-span-3">
              {emptyText}
            </p>
          )}
  
          {options.map(o => (
            <label key={o.id} className="flex items-center gap-2">
              <input
                type="checkbox"
                disabled={disabled}
                checked={selected.includes(o.id)}
                onChange={() => onChange(o.id)}
              />
              <span>{o.name}</span>
            </label>
          ))}
  
        </div>
      </div>
    )
  }