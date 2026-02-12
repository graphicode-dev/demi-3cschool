import { useState, useRef, useEffect } from "react";
import { useTranslation } from "react-i18next";
import type { ViewMode, TableColumn, TableMetadata } from "@/shared/types";
import { TableFilter, type GroupableColumn } from "./TableFilter";
import { PDFIcon, VerticalFilter, XFile, CheckBox } from "@/design-system";
import Pagination from "./Pagination";

interface TableToolbarProps {
    totalItems: number;
    currentView: ViewMode;
    onViewChange: (view: ViewMode) => void;
    onSearch: (query: string) => void;
    searchQuery?: string;
    columns: TableColumn[];
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
    goToNextPage: () => void;
    goToPreviousPage: () => void;
    itemsPerPage: number;
    onItemsPerPageChange: (count: number) => void;
    onColumnVisibilityChange?: (visibleColumns: string[]) => void;
    visibleColumns?: string[];
    selectedFilters?: string[];
    onFilterSelect?: (filterId: string) => void;
    selectedGroups?: string[];
    onGroupSelect?: (groupId: string) => void;
    groupableColumns?: GroupableColumn[];
    metadata?: TableMetadata;
    onAdvancedFilterClick?: () => void;
    hidePagination?: boolean;
    hideActionButtons?: boolean;
}

export const TableToolbar = ({
    totalItems,
    currentView,
    onViewChange,
    onSearch,
    searchQuery,
    columns,
    currentPage,
    totalPages,
    onPageChange,
    goToNextPage,
    goToPreviousPage,
    itemsPerPage,
    onItemsPerPageChange,
    onColumnVisibilityChange,
    visibleColumns = [],
    selectedFilters = [],
    onFilterSelect,
    selectedGroups = [],
    onGroupSelect,
    groupableColumns,
    metadata,
    onAdvancedFilterClick,
    hidePagination,
    hideActionButtons,
}: TableToolbarProps) => {
    const { t } = useTranslation();
    const [searchValue, setSearchValue] = useState("");
    const [showColumnMenu, setShowColumnMenu] = useState(false);
    const [localVisibleColumns, setLocalVisibleColumns] = useState<string[]>(
        visibleColumns.length > 0
            ? visibleColumns
            : columns.map((col) => col.id)
    );
    const columnMenuRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (visibleColumns.length > 0) {
            setLocalVisibleColumns(visibleColumns);
        }
    }, [visibleColumns]);

    useEffect(() => {
        if (searchQuery !== undefined) {
            setSearchValue(searchQuery);
        }
    }, [searchQuery]);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                columnMenuRef.current &&
                !columnMenuRef.current.contains(event.target as Node)
            ) {
                setShowColumnMenu(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    const handleSearch = (value: string) => {
        onSearch(value);
    };

    const handleColumnToggle = (columnId: string) => {
        let updatedVisibleColumns: string[];

        if (localVisibleColumns.includes(columnId)) {
            if (localVisibleColumns.length === 1) {
                return;
            }
            updatedVisibleColumns = localVisibleColumns.filter(
                (id) => id !== columnId
            );
        } else {
            updatedVisibleColumns = [...localVisibleColumns, columnId];
        }

        setLocalVisibleColumns(updatedVisibleColumns);

        if (onColumnVisibilityChange) {
            onColumnVisibilityChange(updatedVisibleColumns);
        }
    };

    const getColumnHeader = (columnId: string) => {
        const column = columns.find((col) => col.id === columnId);
        return column ? column.header : columnId;
    };

    return (
        <div className="flex flex-1 flex-col flex-wrap gap-4 mb-8">
            <div className="flex flex-row flex-wrap justify-between items-center gap-4">
                <div className="flex items-center flex-wrap gap-2">
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <svg
                                className="h-5 w-5 text-gray-400"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                                />
                            </svg>
                        </div>

                        <div className="flex items-center flex-wrap gap-2 py-2.5 px-10 rounded-lg border border-gray-200 dark:border-gray-700 w-64 md:w-full bg-white dark:bg-gray-800">
                            <input
                                type="text"
                                value={searchValue}
                                onChange={(e) => {
                                    const value = e.target.value;
                                    setSearchValue(value);
                                    handleSearch(value);
                                }}
                                placeholder={t(
                                    "designSystem:designSystem.table.search"
                                )}
                                className="flex-1 min-w-[100px] focus:outline-none bg-transparent text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500"
                            />

                            {searchValue && (
                                <button
                                    type="button"
                                    onClick={() => {
                                        setSearchValue("");
                                        handleSearch("");
                                    }}
                                    className="text-gray-400 hover:text-gray-700 dark:text-gray-500 dark:hover:text-gray-300 transition-colors"
                                    title={t(
                                        "designSystem:designSystem.table.clearSearch"
                                    )}
                                >
                                    <svg
                                        className="w-4 h-4"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M6 18L18 6M6 6l12 12"
                                        />
                                    </svg>
                                    <span className="sr-only">
                                        {t(
                                            "designSystem:designSystem.table.clearSearch"
                                        )}
                                    </span>
                                </button>
                            )}

                            {selectedFilters.map((filterId) => (
                                <div
                                    key={filterId}
                                    className="flex items-center gap-1 px-2 py-1 bg-brand-50 border border-brand-200 rounded-full text-sm text-brand-700 dark:bg-brand-500/10 dark:border-brand-500/30 dark:text-brand-400"
                                >
                                    <span>#{getColumnHeader(filterId)}</span>
                                    <button
                                        type="button"
                                        onClick={() =>
                                            onFilterSelect &&
                                            onFilterSelect(filterId)
                                        }
                                        className="text-brand-500 hover:text-brand-700 dark:text-brand-400 dark:hover:text-brand-300"
                                    >
                                        <svg
                                            className="w-4 h-4"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            stroke="currentColor"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M6 18L18 6M6 6l12 12"
                                            />
                                        </svg>
                                        <span className="sr-only">
                                            {t(
                                                "designSystem:designSystem.table.removeFilter"
                                            )}
                                        </span>
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>

                    <TableFilter
                        columns={columns}
                        activeFilters={selectedFilters}
                        onFilterSelect={onFilterSelect || (() => {})}
                        selectedGroups={selectedGroups}
                        onGroupSelect={onGroupSelect}
                        groupableColumns={groupableColumns}
                    />

                    {metadata && onAdvancedFilterClick && (
                        <button
                            type="button"
                            onClick={onAdvancedFilterClick}
                            className="px-4 py-2.5 rounded-lg border border-gray-200 text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800 transition-colors flex items-center gap-2 text-sm font-medium"
                            title={t(
                                "designSystem:designSystem.table.advancedFilters"
                            )}
                        >
                            <svg
                                className="w-5 h-5"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"
                                />
                            </svg>
                            <span className="hidden md:inline">
                                {t(
                                    "designSystem:designSystem.table.advancedFilters"
                                )}
                            </span>
                        </button>
                    )}
                </div>

                <div className="flex items-center justify-center flex-wrap gap-5">
                    {!hidePagination && (
                        <Pagination
                            currentPage={currentPage}
                            totalPages={totalPages}
                            goToNextPage={goToNextPage}
                            goToPreviousPage={goToPreviousPage}
                            setPage={onPageChange}
                            itemsPerPage={itemsPerPage}
                            totalItems={totalItems}
                        />
                    )}

                    {!hideActionButtons && (
                        <div className="flex items-center justify-center flex-wrap gap-2">
                            <button
                                type="button"
                                onClick={() => {
                                    const nextView =
                                        currentView === "grid"
                                            ? "cards"
                                            : "grid";
                                    onViewChange(nextView);
                                }}
                                className="w-10 h-10 rounded-lg flex justify-center items-center border border-gray-200 text-gray-500 hover:bg-gray-50 hover:text-gray-700 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-300 transition-colors"
                                title={`Current: ${currentView} view (click to change)`}
                            >
                                {currentView === "grid" && (
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="h-5 w-5"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M4 6h16M4 12h16M4 18h7"
                                        />
                                    </svg>
                                )}
                                {currentView === "cards" && (
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="h-5 w-5"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"
                                        />
                                    </svg>
                                )}
                                {currentView === "group" && (
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="h-5 w-5"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                                        />
                                    </svg>
                                )}
                            </button>

                            <button
                                type="button"
                                onClick={() => {}}
                                className="w-10 h-10 rounded-lg flex justify-center items-center border border-gray-200 text-gray-500 hover:bg-gray-50 hover:text-gray-700 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-300 transition-colors"
                            >
                                <PDFIcon width={22} height={22} />
                                <span className="sr-only">PDF</span>
                            </button>

                            <button
                                type="button"
                                onClick={() => {}}
                                className="w-10 h-10 rounded-lg flex justify-center items-center border border-gray-200 text-gray-500 hover:bg-gray-50 hover:text-gray-700 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-300 transition-colors"
                            >
                                <XFile width={22} height={22} />
                                <span className="sr-only">X File</span>
                            </button>

                            <div className="relative">
                                <button
                                    type="button"
                                    onClick={() =>
                                        setShowColumnMenu(!showColumnMenu)
                                    }
                                    className="w-10 h-10 rounded-lg flex justify-center items-center border border-gray-200 text-gray-500 hover:bg-gray-50 hover:text-gray-700 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-300 transition-colors"
                                >
                                    <VerticalFilter width={22} height={22} />
                                    <span className="sr-only">
                                        {t(
                                            "designSystem:designSystem.table.columnVisibility"
                                        )}
                                    </span>
                                </button>

                                {showColumnMenu && (
                                    <div
                                        ref={columnMenuRef}
                                        className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 dark:bg-gray-800 z-50"
                                    >
                                        <div className="p-3 border-b border-gray-200 dark:border-gray-700">
                                            <h3 className="text-sm font-medium text-gray-900 dark:text-white">
                                                {t(
                                                    "designSystem:designSystem.table.showHideColumns"
                                                )}
                                            </h3>
                                        </div>
                                        <div className="max-h-60 overflow-y-auto">
                                            {columns.map((column) => (
                                                <div
                                                    key={column.id}
                                                    className="flex items-center px-3 py-2 hover:bg-gray-50 dark:hover:bg-gray-800"
                                                >
                                                    <CheckBox
                                                        checked={localVisibleColumns.includes(
                                                            column.id
                                                        )}
                                                        onChange={() => {
                                                            handleColumnToggle(
                                                                column.id
                                                            );
                                                        }}
                                                    />
                                                    <label
                                                        htmlFor={`column-${column.id}`}
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
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
