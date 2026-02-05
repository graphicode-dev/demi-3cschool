import React, { useCallback, useEffect, useRef, useState } from "react";
import type { SortConfig, TableColumn, TableData } from "@/shared/types";
import {
    MoreVertical,
    ChevronUp,
    ChevronDown,
    ChevronsUpDown,
} from "lucide-react";

interface TableGridViewProps {
    data: TableData[];
    columns: TableColumn[];
    onRowSelection?: (rowId: string, selected: boolean) => void;
    onSelectAll?: (selected: boolean) => void;
    sortConfig?: SortConfig | null;
    onSort?: (column: string) => void;
    columnWidths: number[];
    onColumnResize: (index: number, width: number) => void;
    onRowClick?: (rowId: string) => void;
    disableRowClick?: boolean;
    onEdit?: (rowId: string) => void;
    onDelete?: (rowId: string) => void;
    rowClassName?: (row: { id: string }) => string;
    showCheckbox?: boolean;
    actionsMenu?: (rowId: string) => React.ReactNode;
}

// Helper function to safely render cell values
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
    showCheckbox = false,
    actionsMenu,
}: TableGridViewProps) => {
    const MIN_WIDTH = 100;
    const resizingRef = useRef(false);
    const currentColumnRef = useRef<number | null>(null);
    const startPositionRef = useRef(0);
    const startWidthRef = useRef(0);
    const [openMenuId, setOpenMenuId] = useState<string | null>(null);
    const menuRef = useRef<HTMLDivElement>(null);

    // Close menu when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                menuRef.current &&
                !menuRef.current.contains(event.target as Node)
            ) {
                setOpenMenuId(null);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () =>
            document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    // Handle resize move
    const handleResizeMove = useCallback(
        (e: MouseEvent) => {
            if (!resizingRef.current || currentColumnRef.current === null)
                return;
            e.preventDefault();
            const diff = e.clientX - startPositionRef.current;
            const newWidth = Math.max(startWidthRef.current + diff, MIN_WIDTH);
            if (currentColumnRef.current !== null) {
                onColumnResize(currentColumnRef.current, newWidth);
            }
        },
        [onColumnResize]
    );

    // Handle resize end
    const handleResizeEnd = useCallback(() => {
        if (!resizingRef.current) return;
        resizingRef.current = false;
        currentColumnRef.current = null;
        document.removeEventListener("mousemove", handleResizeMove, true);
        document.removeEventListener("mouseup", handleResizeEnd, true);
        document.body.style.userSelect = "";
    }, [handleResizeMove]);

    // Handle resize start
    const handleResizeStart = (e: React.MouseEvent, index: number) => {
        e.preventDefault();
        e.stopPropagation();
        const th = e.currentTarget.closest("th");
        if (!th) return;
        const width = th.getBoundingClientRect().width;
        resizingRef.current = true;
        currentColumnRef.current = index;
        startPositionRef.current = e.clientX;
        startWidthRef.current = width;
        document.body.style.userSelect = "none";
        document.addEventListener("mousemove", handleResizeMove, true);
        document.addEventListener("mouseup", handleResizeEnd, true);
    };

    // Cleanup
    useEffect(() => {
        return () => {
            if (resizingRef.current) {
                document.removeEventListener(
                    "mousemove",
                    handleResizeMove,
                    true
                );
                document.removeEventListener("mouseup", handleResizeEnd, true);
                document.body.style.userSelect = "";
            }
        };
    }, [handleResizeMove, handleResizeEnd]);

    // Sort icon component
    const SortIcon = ({ column }: { column: string }) => {
        const isActive = sortConfig?.column === column;
        const direction = isActive ? sortConfig?.direction : null;

        if (direction === "asc") {
            return <ChevronUp className="w-4 h-4 text-brand-500" />;
        }
        if (direction === "desc") {
            return <ChevronDown className="w-4 h-4 text-brand-500" />;
        }
        return <ChevronsUpDown className="w-4 h-4 text-gray-400" />;
    };

    const hasActions = onEdit || onDelete || actionsMenu;

    return (
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-3xl overflow-hidden">
            <div className="overflow-x-auto">
                <table className="w-full">
                    {/* Table Header */}
                    <thead>
                        <tr>
                            {columns.map((column, index) => (
                                <th
                                    key={column.id}
                                    className="relative px-5 py-4 text-left"
                                    style={{
                                        width: columnWidths[index]
                                            ? `${columnWidths[index]}px`
                                            : "auto",
                                        minWidth: `${MIN_WIDTH}px`,
                                    }}
                                >
                                    <button
                                        type="button"
                                        className="flex items-center gap-3 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
                                        onClick={() =>
                                            column.sortable !== false &&
                                            onSort?.(column.accessorKey)
                                        }
                                        disabled={column.sortable === false}
                                    >
                                        <span className="font-semibold text-base capitalize">
                                            {column.header}
                                        </span>
                                        {column.sortable !== false && (
                                            <SortIcon
                                                column={column.accessorKey}
                                            />
                                        )}
                                    </button>

                                    {/* Column Resize Handle */}
                                    {index < columns.length - 1 && (
                                        <div
                                            className="absolute right-0 top-1/2 -translate-y-1/2 h-6 w-px bg-gray-300 dark:bg-gray-600 cursor-col-resize hover:bg-brand-500 hover:w-0.5 transition-all z-10"
                                            onMouseDown={(e) =>
                                                handleResizeStart(e, index)
                                            }
                                            role="separator"
                                            aria-orientation="vertical"
                                        />
                                    )}
                                </th>
                            ))}
                            {hasActions && (
                                <th className="px-5 py-4 text-left">
                                    <span className="font-semibold text-base text-gray-500 dark:text-gray-400 capitalize">
                                        Actions
                                    </span>
                                </th>
                            )}
                        </tr>
                    </thead>

                    {/* Table Body */}
                    <tbody>
                        {data.length === 0 ? (
                            <tr>
                                <td
                                    colSpan={
                                        columns.length + (hasActions ? 1 : 0)
                                    }
                                    className="px-5 py-8 text-center text-gray-500 dark:text-gray-400"
                                >
                                    No results.
                                </td>
                            </tr>
                        ) : (
                            data.map((row, rowIndex) => (
                                <tr
                                    key={row.id}
                                    className={`
                                        ${rowIndex === 0 ? "bg-brand-100/30 dark:bg-brand-500/10" : "bg-white dark:bg-gray-800"}
                                        ${!disableRowClick ? "cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700/50" : ""}
                                        ${rowClassName ? rowClassName(row) : ""}
                                        hover:bg-brand-50 dark:hover:bg-brand-500/10
                                        transition-colors
                                    `}
                                    onClick={() =>
                                        !disableRowClick && onRowClick?.(row.id)
                                    }
                                >
                                    {columns.map((column, colIndex) => (
                                        <td
                                            key={`${row.id}-${column.id}`}
                                            className={`
                                                px-5 py-4 text-base text-gray-900 dark:text-gray-100
                                                ${colIndex === 0 && rowIndex === 0 ? "rounded-tl-2xl rounded-bl-2xl" : ""}
                                            `}
                                            style={{
                                                width: columnWidths[colIndex]
                                                    ? `${columnWidths[colIndex]}px`
                                                    : "auto",
                                                minWidth: `${MIN_WIDTH}px`,
                                            }}
                                        >
                                            {column.cell ? (
                                                column.cell({
                                                    row: {
                                                        ...row,
                                                        original: {
                                                            ...row,
                                                            ...row.columns,
                                                        },
                                                    },
                                                })
                                            ) : (
                                                <span className="truncate block">
                                                    {renderCellValue(
                                                        row.columns[
                                                            column.accessorKey
                                                        ]
                                                    )}
                                                </span>
                                            )}
                                        </td>
                                    ))}
                                    {hasActions && (
                                        <td
                                            className={`
                                                px-5 py-4 text-center
                                                ${rowIndex === 0 ? "rounded-tr-2xl rounded-br-2xl" : ""}
                                            `}
                                            onClick={(e) => e.stopPropagation()}
                                        >
                                            {actionsMenu ? (
                                                <div
                                                    className="relative inline-block"
                                                    ref={
                                                        openMenuId === row.id
                                                            ? menuRef
                                                            : null
                                                    }
                                                >
                                                    <button
                                                        type="button"
                                                        className="p-1 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                                                        onClick={() =>
                                                            setOpenMenuId(
                                                                openMenuId ===
                                                                    row.id
                                                                    ? null
                                                                    : row.id
                                                            )
                                                        }
                                                    >
                                                        <MoreVertical className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                                                    </button>
                                                    {openMenuId === row.id && (
                                                        <div className="absolute right-0 top-full mt-1 z-50">
                                                            {actionsMenu(
                                                                row.id
                                                            )}
                                                        </div>
                                                    )}
                                                </div>
                                            ) : (
                                                <div className="flex items-center justify-center gap-2">
                                                    {onEdit && (
                                                        <button
                                                            type="button"
                                                            className="text-brand-500 hover:text-brand-700 text-sm font-medium"
                                                            onClick={() =>
                                                                onEdit(row.id)
                                                            }
                                                        >
                                                            Edit
                                                        </button>
                                                    )}
                                                    {onDelete && (
                                                        <button
                                                            type="button"
                                                            className="text-red-500 hover:text-red-700 text-sm font-medium"
                                                            onClick={() =>
                                                                onDelete(row.id)
                                                            }
                                                        >
                                                            Delete
                                                        </button>
                                                    )}
                                                </div>
                                            )}
                                        </td>
                                    )}
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};
