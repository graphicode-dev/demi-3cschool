import React, { useCallback, useEffect, useRef } from "react";
import { CheckBox } from "@/shared/components/ui/CheckBox";
import type { SortConfig, TableColumn } from "@/shared/types";
import { SortableHeader } from "./SortableHeader";

interface TableHeadProps {
    allSelected: boolean;
    onSelectAll: (selected: boolean) => void;
    columns: TableColumn[];
    sortConfig?: SortConfig | null;
    onSort?: (column: string) => void;
    columnWidths: number[];
    onColumnResize: (index: number, width: number) => void;
}

export function TableHead({
    allSelected,
    onSelectAll,
    columns,
    sortConfig,
    onSort,
    columnWidths,
    onColumnResize,
}: TableHeadProps) {
    const MIN_WIDTH = 50;
    const resizingRef = useRef(false);
    const currentColumnRef = useRef<number | null>(null);
    const startPositionRef = useRef(0);
    const startWidthRef = useRef(0);

    // Handle resize move
    const handleResizeMove = useCallback(
        (e: MouseEvent) => {
            if (!resizingRef.current || currentColumnRef.current === null)
                return;

            e.preventDefault();

            const diff = e.clientX - startPositionRef.current;
            const newWidth = Math.max(startWidthRef.current + diff, MIN_WIDTH);

            // Find all th and td elements for this column and update their width
            const table = document.querySelector("table");
            if (table) {
                // Update the header cell
                const headers = table.querySelectorAll("th");
                const columnIndex = currentColumnRef.current; // Store in local variable to satisfy TypeScript
                const headerCell = headers[columnIndex + 1]; // +1 for checkbox column
                if (headerCell instanceof HTMLElement) {
                    headerCell.style.width = `${newWidth}px`;
                    headerCell.style.minWidth = `${newWidth}px`;
                }

                // Update all data cells for this column
                const rows = table.querySelectorAll("tbody tr");
                rows.forEach((row) => {
                    const cells = row.querySelectorAll("td");
                    if (cells.length > columnIndex + 1) {
                        const cell = cells[columnIndex + 1];
                        if (cell instanceof HTMLElement) {
                            cell.style.width = `${newWidth}px`;
                            cell.style.minWidth = `${newWidth}px`;
                        }
                    }
                });
            }

            // Update the state in the parent component
            if (currentColumnRef.current !== null) {
                onColumnResize(currentColumnRef.current, newWidth);
            }
        },
        [onColumnResize, MIN_WIDTH]
    );

    // Handle resize end
    const handleResizeEnd = useCallback(() => {
        if (!resizingRef.current) return;

        resizingRef.current = false;
        currentColumnRef.current = null;

        // Remove event listeners
        document.removeEventListener("mousemove", handleResizeMove, true);
        document.removeEventListener("mouseup", handleResizeEnd, true);

        // Restore text selection
        document.body.style.userSelect = "";
    }, [handleResizeMove]);

    // Handle resize start
    const handleResizeStart = (e: React.MouseEvent, index: number) => {
        e.preventDefault();
        e.stopPropagation();

        // Get the current width of the column
        const th = e.currentTarget.closest("th");
        if (!th) return;

        const width = th.getBoundingClientRect().width;

        resizingRef.current = true;
        currentColumnRef.current = index;
        startPositionRef.current = e.clientX;
        startWidthRef.current = width;

        // Prevent text selection during resize
        document.body.style.userSelect = "none";

        // Add event listeners with capture phase
        document.addEventListener("mousemove", handleResizeMove, true);
        document.addEventListener("mouseup", handleResizeEnd, true);
    };

    // Clean up event listeners when component unmounts
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

    return (
        <thead>
            <tr>
                <th scope="col" className="w-12 px-6 py-3 text-left">
                    <CheckBox
                        checked={allSelected}
                        onChange={() => onSelectAll(!allSelected)}
                    />
                </th>

                {columns.map((column, index) => (
                    <th
                        key={column.id}
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider relative"
                        style={{
                            width: columnWidths[index]
                                ? `${columnWidths[index]}px`
                                : "200px",
                            minWidth: `${MIN_WIDTH}px`,
                            maxWidth: columnWidths[index]
                                ? `${columnWidths[index]}px`
                                : "200px",
                            overflow: "hidden",
                            whiteSpace: "nowrap",
                            textOverflow: "ellipsis",
                        }}
                    >
                        <div className="flex items-center overflow-hidden">
                            <SortableHeader
                                column={column.accessorKey}
                                sortable={column.sortable !== false}
                                sortConfig={sortConfig || null}
                                onSort={onSort}
                            >
                                <span className="truncate block">
                                    {column.header}
                                </span>
                            </SortableHeader>

                            {/* Resize handle */}
                            {index < columns.length - 1 && (
                                <div
                                    className="absolute right-0 top-0 h-full w-1 lg:w-0.5 cursor-col-resize flex items-center justify-center hover:bg-gray-200 dark:hover:bg-gray-700 group z-20"
                                    onMouseDown={(e) =>
                                        handleResizeStart(e, index)
                                    }
                                    aria-label={`Resize column ${column.header}`}
                                    role="button"
                                    tabIndex={0}
                                >
                                    <div className="w-full h-full bg-gray-300 group-hover:bg-brand-500 dark:bg-gray-600 dark:group-hover:bg-brand-500"></div>
                                </div>
                            )}
                        </div>
                    </th>
                ))}
            </tr>
        </thead>
    );
}
