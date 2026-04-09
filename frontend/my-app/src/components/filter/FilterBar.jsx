export default function FilterBar({ children, onSubmit, onReset }) {
    return (
      <div className="bg-white p-4 rounded-xl shadow mb-4">
        <form
          onSubmit={onSubmit}
          className="flex flex-wrap gap-4 items-end"
        >
          {children}
  
          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
          >
            Lọc
          </button>
  
          <button
            type="button"
            onClick={onReset}
            className="bg-gray-200 px-4 py-2 rounded-lg hover:bg-gray-300"
          >
            Reset
          </button>
        </form>
      </div>
    )
  }