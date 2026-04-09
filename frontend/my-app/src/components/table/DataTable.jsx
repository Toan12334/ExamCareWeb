import Button from "../ui/Button"

export default function DataTable({
    columns = [],
    data = [],
    renderActions,
    onAdd,
    pagination,
    onPageChange
}) {

    const { page = 1, totalPages = 1 } = pagination || {}

    return (
        <div className="bg-white rounded-xl shadow p-4">

            {/* Header */}
            <div className="flex justify-between mb-4">
                <Button onClick={onAdd} variant="primary">
                    Thêm mới
                </Button>
            </div>

            {/* Table */}
            <table className="w-full border">
                <thead className="bg-gray-100">
                    <tr>
                        {columns.map((col) => (
                            <th key={col.key} className="px-6 py-3 text-left">
                                {col.title}
                            </th>
                        ))}
                        {renderActions && (
                            <th className="px-6 py-3 text-center">Actions</th>
                        )}
                    </tr>
                </thead>

                <tbody>
                    {!Array.isArray(data) || data.length === 0 ? (
                        <tr>
                            <td colSpan={columns.length + 1} className="text-center py-4">
                                Không có dữ liệu
                            </td>
                        </tr>
                    ) : (
                        data.map((row, index) => (
                            <tr key={index} className="border-t hover:bg-gray-50">

                                {columns.map((col) => (
                                    <td key={col.key} className="px-6 py-3">
                                        {row?.[col.key] ?? "-"}
                                    </td>
                                ))}

                                {renderActions && row && (
                                    <td className="px-6 py-3 text-center">
                                        {renderActions(row)}
                                    </td>
                                )}
                            </tr>
                        ))
                    )}
                </tbody>
            </table>

            {/* Pagination */}
            {pagination && (
                <div className="flex justify-between items-center mt-4">

                    <span>
                        Trang {page} / {totalPages}
                    </span>

                    <div className="flex gap-2">

                        <Button variant="reset"
                            onClick={() => onPageChange(page - 1)}
                            disabled={page === 1}
                        >
                            Prev
                        </Button>

                        {/* Render số trang */}
                        {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                            <Button
                                key={p}
                                variant={p === page ? "primary" : "secondary"}
                                onClick={() => onPageChange(p)}
                            >
                                {p}
                            </Button>
                        ))}

                        <Button
                            onClick={() => onPageChange(page + 1)}
                            disabled={page === totalPages} variant="reset"
                        >
                            Next
                        </Button>

                    </div>
                </div>
            )}
        </div>
    )
}