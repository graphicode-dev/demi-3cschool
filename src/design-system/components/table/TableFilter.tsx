import { useState } from "react";
import { useTranslation } from "react-i18next";
import type { TableColumn } from "@/shared/types";
import { CheckBox } from "@/shared/components/ui/CheckBox";

export interface GroupableColumn {
    id: string;
    isDefault?: boolean;
}

interface TableFilterProps {
    columns: TableColumn[];
    activeFilters: string[];
    onFilterSelect: (filterId: string) => void;
    selectedGroups?: string[];
    onGroupSelect?: (groupId: string) => void;
    groupableColumns?: GroupableColumn[];
}

export const TableFilter = ({
    columns,
    activeFilters,
    onFilterSelect,
    selectedGroups = [],
    onGroupSelect,
    groupableColumns: groupableColumnsProp,
}: TableFilterProps) => {
    const { t } = useTranslation();
    const [showFilterMenu, setShowFilterMenu] = useState(false);

    // Filter groupable columns based on provided config or default logic
    const groupableColumnIds = groupableColumnsProp?.map((col) => col.id);
    const groupableColumns = groupableColumnIds
        ? columns.filter((col) => groupableColumnIds.includes(col.id))
        : columns.filter(
              (col) =>
                  // Default: exclude actions and avatar columns
                  col.id !== "actions" && col.id !== "avatar"
          );

    // Get default selected groups from groupableColumns config
    const defaultSelectedGroups =
        groupableColumnsProp
            ?.filter((col) => col.isDefault)
            .map((col) => col.id) || [];

    // Handle clearing all group selections at once
    const handleClearAllGroups = () => {
        if (onGroupSelect) {
            // Call onGroupSelect for each selected group to clear them all
            selectedGroups.forEach((groupId) => {
                onGroupSelect(groupId);
            });
        }
    };

    return (
        <div className="relative">
            <button
                type="button"
                onClick={() => setShowFilterMenu(!showFilterMenu)}
                className={`flex justify-center items-center gap-1 p-3 w-12 h-12 text-sm font-medium rounded-lg ${
                    activeFilters.length > 0 || selectedGroups.length > 0
                        ? "bg-brand-50 text-brand-700 dark:bg-brand-500/10 dark:text-brand-400"
                        : "bg-white border border-gray-200 text-gray-500 hover:bg-gray-50 hover:text-gray-700 dark:bg-transparent dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-300"
                }`}
                aria-expanded={showFilterMenu}
            >
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
                    />
                </svg>
                {(activeFilters.length > 0 || selectedGroups.length > 0) && (
                    <span className="absolute -top-1 -right-1 bg-brand-500 text-white text-xs w-4 h-4 flex items-center justify-center rounded-full">
                        {activeFilters.length + selectedGroups.length}
                    </span>
                )}
                <span className="sr-only">
                    {t("designSystem:designSystem.table.filter")}
                </span>
            </button>

            {showFilterMenu && (
                <div className="absolute left-0 mt-2 w-64 px-2 z-999999 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700">
                    <div className="flex justify-between items-center">
                        {/* Filters */}
                        <div className="w-1/2 flex flex-col justify-center items-center self-start">
                            <h3 className="p-3 text-gray-900 dark:text-white font-medium">
                                {t("designSystem:designSystem.table.filters")}
                            </h3>
                            <div className="flex flex-col">
                                {columns.map((column) => (
                                    <div
                                        key={column.id}
                                        className="flex items-start py-2 hover:bg-gray-50 dark:hover:bg-gray-800"
                                    >
                                        <CheckBox
                                            checked={activeFilters.includes(
                                                column.id
                                            )}
                                            onChange={() => {
                                                onFilterSelect(column.id);
                                            }}
                                        />
                                        <label
                                            htmlFor={`filter-${column.id}`}
                                            className="ml-2 block text-sm text-gray-900 dark:text-gray-300"
                                        >
                                            {column.header}
                                        </label>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Group by */}
                        {onGroupSelect && (
                            <div className="w-1/2 flex flex-col justify-center items-center self-start">
                                <h3 className="p-3 text-gray-900 dark:text-white font-medium">
                                    {t(
                                        "designSystem:designSystem.table.groupBy"
                                    )}
                                </h3>
                                <div className="flex flex-col">
                                    {/* Option to clear all groups */}
                                    {selectedGroups.length > 0 && (
                                        <div
                                            className="flex items-center px-3 py-2 hover:bg-gray-50 dark:hover:bg-gray-800"
                                            onClick={handleClearAllGroups}
                                        >
                                            <span className="text-sm text-gray-900 dark:text-gray-300">
                                                {t(
                                                    "designSystem:designSystem.table.clearAllGroups"
                                                )}
                                            </span>
                                        </div>
                                    )}

                                    {groupableColumns.map((column) => (
                                        <div
                                            key={column.id}
                                            className="flex items-center px-3 py-2 hover:bg-gray-50 dark:hover:bg-gray-800"
                                        >
                                            <CheckBox
                                                checked={selectedGroups.includes(
                                                    column.id
                                                )}
                                                onChange={() => {
                                                    onGroupSelect(column.id);
                                                }}
                                            />
                                            <label
                                                htmlFor={`group-${column.id}`}
                                                className="ml-2 block text-sm text-gray-900 dark:text-gray-300"
                                            >
                                                {column.header}
                                            </label>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Close Button */}
                    <div className="p-3 border-t border-gray-200 dark:border-gray-700 flex justify-end">
                        <button
                            type="button"
                            onClick={() => setShowFilterMenu(false)}
                            className="px-3 py-1.5 text-sm text-gray-700 dark:text-gray-300 hover:text-brand-500 dark:hover:text-brand-400 transition-colors"
                        >
                            {t("designSystem:designSystem.table.close")}
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};
