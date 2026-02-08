import React, { useState, useEffect } from "react";
import { TableHead } from "./TableHead";
import type { SortConfig, TableColumn, TableData } from "@/shared/types";
import TableRow from "./TableRow";
import { CheckBox } from "@/design-system";

interface TableGroupViewProps {
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
}

export const TableGroupView = ({
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
}: TableGroupViewProps) => {
    // Group the data by group property
    const [groupedData, setGroupedData] = useState<Record<string, TableData[]>>(
        {}
    );
    const [expandedGroups, setExpandedGroups] = useState<
        Record<string, boolean>
    >({});
    const [groupStats, setGroupStats] = useState<
        Record<string, { count: number; selected: number }>
    >({});

    // Check if all data is selected
    const allSelected = data.length > 0 && data.every((item) => item.selected);

    // Process and group the data
    useEffect(() => {
        const newGroupedData: Record<string, TableData[]> = {};
        const stats: Record<string, { count: number; selected: number }> = {};

        data.forEach((row) => {
            // Extract a cleaner group name from the row.group property
            let groupName = row.group || "Ungrouped";

            // If the group name contains column labels (e.g., "Name: John | Status: Active")
            // Extract just the values for a cleaner display
            if (groupName.includes(":")) {
                // Split by the pipe separator if there are multiple groups
                const parts = groupName.split(" | ");

                // For each part, extract just the value after the colon
                const values = parts.map((part) => {
                    const colonIndex = part.indexOf(":");
                    if (colonIndex !== -1) {
                        return part.substring(colonIndex + 1).trim();
                    }
                    return part.trim();
                });

                // Join the values with a separator
                groupName = values.join(" | ");
            }

            if (!newGroupedData[groupName]) {
                newGroupedData[groupName] = [];
                stats[groupName] = { count: 0, selected: 0 };
            }

            newGroupedData[groupName].push(row);
            stats[groupName].count++;

            if (row.selected) {
                stats[groupName].selected++;
            }
        });

        setGroupedData(newGroupedData);
        setGroupStats(stats);

        // Initialize expanded state for all groups if they don't exist yet
        setExpandedGroups((prev) => {
            const initialExpandedState = { ...prev };
            Object.keys(newGroupedData).forEach((groupName) => {
                if (initialExpandedState[groupName] === undefined) {
                    // By default, expand all groups
                    initialExpandedState[groupName] = true;
                }
            });
            return initialExpandedState;
        });
    }, [data]);

    // Handle toggling group expansion
    const toggleGroupExpansion = (groupName: string) => {
        setExpandedGroups((prev) => ({
            ...prev,
            [groupName]: !prev[groupName],
        }));
    };

    // Handle selecting/deselecting all rows in a group
    const handleGroupSelection = (groupName: string, selected: boolean) => {
        if (onRowSelection) {
            groupedData[groupName].forEach((row) => {
                if (row.selected !== selected) {
                    onRowSelection(row.id, selected);
                }
            });
        }
    };

    // Handle row selection (wrapper for onRowSelection)
    const handleRowSelection = (rowId: string, selected: boolean) => {
        if (onRowSelection) {
            onRowSelection(rowId, selected);
        }
    };

    // Sort the group names for consistent display
    const sortedGroupNames = Object.keys(groupedData).sort((a, b) => {
        // Keep "Ungrouped" at the end
        if (a === "Ungrouped") return 1;
        if (b === "Ungrouped") return -1;
        return a.localeCompare(b);
    });

    return (
        <div className="space-y-6">
            {sortedGroupNames.length === 0 ? (
                <div className="p-8 text-center text-gray-500 dark:text-gray-400">
                    No data available
                </div>
            ) : (
                <div className="overflow-x-auto">
                    <table className="min-w-full border-separate border-spacing-y-2">
                        <TableHead
                            allSelected={allSelected}
                            onSelectAll={onSelectAll}
                            columns={columns}
                            sortConfig={sortConfig}
                            onSort={onSort}
                            columnWidths={columnWidths}
                            onColumnResize={onColumnResize}
                        />

                        <tbody>
                            {sortedGroupNames.map((groupName) => (
                                <React.Fragment key={groupName}>
                                    {/* Group Header Row */}
                                    <tr
                                        className={`${
                                            expandedGroups[groupName]
                                                ? "bg-brand-50 dark:bg-brand-500/10"
                                                : ""
                                        } hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer`}
                                    >
                                        <td
                                            colSpan={columns.length + 1}
                                            className="py-3 px-2 rounded-xl"
                                        >
                                            <div className="flex justify-between items-center gap-3">
                                                <div className="flex items-center gap-2">
                                                    {/* Checkbox for group selection */}
                                                    {onRowSelection && (
                                                        <div
                                                            className="ml-2"
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                            }}
                                                        >
                                                            <CheckBox
                                                                checked={
                                                                    groupStats[
                                                                        groupName
                                                                    ]
                                                                        .selected ===
                                                                        groupStats[
                                                                            groupName
                                                                        ]
                                                                            .count &&
                                                                    groupStats[
                                                                        groupName
                                                                    ].count > 0
                                                                }
                                                                onChange={() => {
                                                                    const isAllSelected =
                                                                        groupStats[
                                                                            groupName
                                                                        ]
                                                                            .selected ===
                                                                        groupStats[
                                                                            groupName
                                                                        ].count;
                                                                    handleGroupSelection(
                                                                        groupName,
                                                                        !isAllSelected
                                                                    );
                                                                }}
                                                            />
                                                        </div>
                                                    )}

                                                    <div
                                                        className="flex items-center gap-1 text-gray-700 dark:text-gray-300"
                                                        onClick={() =>
                                                            toggleGroupExpansion(
                                                                groupName
                                                            )
                                                        }
                                                    >
                                                        {expandedGroups[
                                                            groupName
                                                        ] ? (
                                                            <svg
                                                                xmlns="http://www.w3.org/2000/svg"
                                                                className="h-4 w-4"
                                                                fill="none"
                                                                viewBox="0 0 24 24"
                                                                stroke="currentColor"
                                                                aria-hidden="true"
                                                            >
                                                                <path
                                                                    strokeLinecap="round"
                                                                    strokeLinejoin="round"
                                                                    strokeWidth={
                                                                        2
                                                                    }
                                                                    d="M19 9l-7 7-7-7"
                                                                />
                                                            </svg>
                                                        ) : (
                                                            <svg
                                                                xmlns="http://www.w3.org/2000/svg"
                                                                className="h-4 w-4"
                                                                fill="none"
                                                                viewBox="0 0 24 24"
                                                                stroke="currentColor"
                                                                aria-hidden="true"
                                                            >
                                                                <path
                                                                    strokeLinecap="round"
                                                                    strokeLinejoin="round"
                                                                    strokeWidth={
                                                                        2
                                                                    }
                                                                    d="M9 5l7 7-7 7"
                                                                />
                                                            </svg>
                                                        )}
                                                        <h3 className="font-medium text-gray-900 dark:text-white">
                                                            {groupName}
                                                        </h3>
                                                    </div>
                                                </div>

                                                <div className="flex items-center gap-2">
                                                    {groupStats[groupName]
                                                        .selected > 0 && (
                                                        <span className="text-sm text-brand-600 dark:text-brand-400">
                                                            {
                                                                groupStats[
                                                                    groupName
                                                                ].selected
                                                            }{" "}
                                                            selected
                                                        </span>
                                                    )}
                                                    <span className="px-2 py-1 bg-brand-100 text-brand-800 dark:bg-brand-500/20 dark:text-brand-400 rounded-full text-xs">
                                                        {
                                                            groupStats[
                                                                groupName
                                                            ].count
                                                        }
                                                    </span>
                                                </div>
                                            </div>
                                        </td>
                                    </tr>

                                    {/* Group Data Rows */}
                                    {expandedGroups[groupName] &&
                                        groupedData[groupName].map((row) => (
                                            <TableRow
                                                key={row.id}
                                                row={row}
                                                columns={columns}
                                                columnWidths={columnWidths}
                                                handleRowSelection={
                                                    handleRowSelection
                                                }
                                                onRowClick={onRowClick}
                                                disableRowClick={
                                                    disableRowClick
                                                }
                                            />
                                        ))}
                                </React.Fragment>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};
