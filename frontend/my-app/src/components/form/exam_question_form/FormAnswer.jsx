import Preview from "../../ui/PreviewMathKatex";

export function TrueFalseTable({
    statements = [],
    value = {},
    onChange,
    className = "",
    tableClassName = "",
    previewProps = {},
    readOnly = false,
}) {
    const handleSelect = (id, answer) => {
        if (readOnly) return;
        onChange?.(id, answer);
    };

    return (
        <div className={`w-full overflow-x-auto ${className}`}>
            <table
                className={`w-full border-collapse border border-blue-700 text-sm ${tableClassName}`}
            >
                <thead>
                    <tr>
                        {/* Cột label riêng */}
                        <th className="w-12 border border-blue-700 px-2 py-2 text-center font-bold">

                        </th>

                        <th className="border border-blue-700 px-4 py-2 text-center font-bold">
                            Mệnh đề
                        </th>

                        <th className="w-20 border border-blue-700 px-4 py-2 text-center font-bold">
                            Đúng
                        </th>

                        <th className="w-20 border border-blue-700 px-4 py-2 text-center font-bold">
                            Sai
                        </th>
                    </tr>
                </thead>

                <tbody>
                    {statements.length > 0 ? (
                        statements.map((item, index) => {
                            const rowKey = item.id ?? index;
                            const label = item.keyLabel ?? item.label ?? item.StatementLabel ?? index + 1;

                            return (
                                <tr key={rowKey}>
                                    {/* Cột label */}
                                    <td className="border border-blue-700 text-center align-top font-medium">
                                        {label}
                                    </td>

                                    {/* Cột content */}
                                    <td className="border border-blue-700 px-3 py-2 align-top">
                                        <Preview
                                            content={item.StatementContent || ""}
                                            padding="p-0"
                                            border="border-0"
                                            bg="bg-transparent"
                                            rounded=""
                                            overflow="overflow-visible"
                                            width="w-full"
                                            height="h-auto"
                                            minHeight=""
                                            maxHeight=""
                                            {...previewProps}
                                        />
                                    </td>

                                    <td className="border border-blue-700 text-center align-middle">
                                        <input
                                            type="radio"
                                            name={`true-false-${rowKey}`}
                                            checked={
                                                value[rowKey] !== undefined
                                                    ? value[rowKey] === true
                                                    : item.IsCorrect === true
                                            }
                                            onChange={() => handleSelect(rowKey, true)}
                                            disabled={readOnly}
                                        />
                                    </td>

                                    <td className="border border-blue-700 text-center align-middle">
                                        <input
                                            type="radio"
                                            name={`true-false-${rowKey}`}
                                            checked={
                                                value[rowKey] !== undefined
                                                    ? value[rowKey] === false
                                                    : item.IsCorrect === false
                                            }
                                            onChange={() => handleSelect(rowKey, false)}
                                            disabled={readOnly}
                                        />
                                    </td>
                                </tr>
                            );
                        })
                    ) : (
                        <tr>
                            <td
                                colSpan={4}
                                className="border border-blue-700 px-4 py-4 text-center text-gray-500"
                            >
                                Chưa có dữ liệu mệnh đề
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );

}

export function MutipleChoice({
    options = [],
}) {
    return (
        <div className="space-y-4">
            {/* Options */}
            <div className="space-y-2">
                {(options ?? []).map((opt, index) => {
                    const isCorrect = opt.IsCorrect === true;

                    return (
                        <div
                            key={index}
                            className={`flex items-start gap-3 p-3 rounded-lg border
                             ${isCorrect
                                    ? "border-green-500 bg-green-50"
                                    : "border-gray-300"
                                }
                           `}
                        >
                            {/* 👉 radio chỉ để hiển thị */}
                            <input
                                type="radio"
                                checked={isCorrect}
                                readOnly
                                className={`mt-1 ${isCorrect ? "accent-green-600" : "accent-gray-400"
                                    }`}
                            />

                            {/* Label */}
                            <div className="font-semibold min-w-[20px]">
                                {opt.OptionLabel}.
                            </div>

                            {/* Content */}
                            <div className="flex-1">
                                <Preview
                                    content={opt.OptionContent ?? ""}
                                    padding="p-0"
                                    border="border-0"
                                    bg="bg-transparent"
                                />
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}