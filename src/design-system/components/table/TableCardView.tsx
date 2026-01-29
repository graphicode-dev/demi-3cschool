import type { TableData, TableColumn } from "@/shared/types";
import { TableAvatar } from "./TableAvatar";
import { getInitials } from "@/utils/tableUtils";

// Helper function to safely render cell values (handles objects that can't be rendered as React children)
const renderCellValue = (value: unknown): string => {
    if (value === null || value === undefined) return "";
    if (typeof value === "object") {
        const obj = value as Record<string, unknown>;
        return (
            obj.name?.toString() ||
            obj.title?.toString() ||
            obj.label?.toString() ||
            ""
        );
    }
    return String(value);
};

interface TableCardViewProps {
    data: TableData[];
    columns: TableColumn[];
}

export const TableCardView = ({ data, columns }: TableCardViewProps) => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {data.length === 0 ? (
                <div className="col-span-3 p-8 text-center text-gray-500 dark:text-gray-400">
                    No data available
                </div>
            ) : (
                data.map((row) => {
                    const name = String(row.columns.name || "");
                    return (
                        <div
                            key={row.id}
                            className={`bg-white dark:bg-gray-800 rounded-2xl border p-4 relative group transition-all ${
                                row.selected
                                    ? "border-brand-500 bg-brand-50/30 dark:bg-brand-500/10"
                                    : "border-gray-200 hover:border-brand-200 dark:border-gray-700 dark:hover:border-brand-700"
                            }`}
                        >
                            <div className="absolute top-0 right-0 w-8 h-8 border-t-3 border-r-3 border-brand-500 dark:border-brand-700 rounded-tr-2xl" />
                            <div className="absolute bottom-0 left-0 w-8 h-8 border-b-3 border-l-3 border-brand-500 dark:border-brand-700 rounded-bl-2xl" />

                            <div className="flex flex-col gap-3 pt-6">
                                <div className="flex items-center gap-3">
                                    <TableAvatar
                                        src={row.avatar}
                                        initials={getInitials(name)}
                                        size="md"
                                    />
                                    <div>
                                        <div className="font-medium text-gray-900 dark:text-white">
                                            {name}
                                        </div>
                                        <div className="text-xs text-gray-500 dark:text-gray-400">
                                            {renderCellValue(
                                                row.columns[
                                                    columns[2]?.accessorKey
                                                ]
                                            )}{" "}
                                            •{" "}
                                            {renderCellValue(
                                                row.columns[
                                                    columns[3]?.accessorKey
                                                ]
                                            )}
                                        </div>
                                    </div>
                                </div>

                                <div className="w-full h-px bg-gray-200 dark:bg-gray-800" />

                                <div className="grid grid-cols-1 gap-2">
                                    {columns.slice(1, 4).map((column) => (
                                        <div
                                            key={column.id}
                                            className="flex flex-col"
                                        >
                                            <div className="text-xs text-gray-500 dark:text-gray-400">
                                                {column.header}
                                            </div>
                                            <div className="text-sm truncate text-gray-900 dark:text-white">
                                                {renderCellValue(
                                                    row.columns[
                                                        column.accessorKey
                                                    ]
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    );
                })
            )}
        </div>
    );
};
