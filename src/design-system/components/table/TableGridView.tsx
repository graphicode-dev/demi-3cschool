import { TableHead } from "./TableHead";
import type { SortConfig, TableColumn, TableData } from "@/shared/types";
import TableRow from "./TableRow";

interface TableGridViewProps {
    data: TableData[];
    columns: TableColumn[];
    onRowSelection?: (rowId: string, selected: boolean) => void;
    onSelectAll: (selected: boolean) => void;
    sortConfig?: SortConfig | null;
    onSort?: (column: string) => void;
    columnWidths: number[];
    onColumnResize: (index: number, width: number) => void;
    onRowClick?: (rowId: string) => void;
    disableRowClick?: boolean;
    onEdit?: (rowId: string) => void;
    onDelete?: (rowId: string) => void;
    rowClassName?: (row: { id: string }) => string;
}

export const TableGridView = ({
    data,
    columns,
    onRowSelection,
    onSelectAll,
    sortConfig,
    onSort,
    columnWidths,
    onColumnResize,
    onRowClick,
    disableRowClick,
    onEdit,
    onDelete,
    rowClassName,
}: TableGridViewProps) => {
    // Check if all rows are selected
    const allSelected = data.length > 0 && data.every((row) => row.selected);

    // Handle row selection
    const handleRowSelection = (rowId: string, selected: boolean) => {
        if (onRowSelection) {
            onRowSelection(rowId, selected);
        }
    };

    return (
        <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <TableHead
                    allSelected={allSelected}
                    onSelectAll={onSelectAll}
                    columns={columns}
                    sortConfig={sortConfig}
                    onSort={onSort}
                    columnWidths={columnWidths}
                    onColumnResize={onColumnResize}
                />
                <tbody className="bg-white divide-y divide-gray-200 dark:bg-gray-800 dark:divide-gray-800">
                    {data.length === 0 ? (
                        <tr>
                            <td
                                colSpan={columns.length + 1}
                                className="px-6 py-4 whitespace-nowrap text-center text-gray-500 dark:text-gray-400"
                            >
                                No results.
                            </td>
                        </tr>
                    ) : (
                        data.map((row, index) => (
                            <TableRow
                                key={index}
                                row={row}
                                columns={columns}
                                columnWidths={columnWidths}
                                handleRowSelection={handleRowSelection}
                                onRowClick={onRowClick}
                                disableRowClick={disableRowClick}
                                onEdit={onEdit}
                                onDelete={onDelete}
                                className={
                                    rowClassName ? rowClassName(row) : ""
                                }
                            />
                        ))
                    )}
                </tbody>
            </table>
        </div>
    );
};
