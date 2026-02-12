import React, { useState, useMemo, useCallback, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useSearchParams } from "react-router-dom";
import type {
    TableData,
    TableColumn,
    ViewMode,
    SortConfig,
    TableMetadata,
    ActiveFilter,
} from "@/shared/types";
import { TableToolbar } from "./TableToolbar";
import type { GroupableColumn } from "./TableFilter";
import { TableGridView } from "./TableGridView";
import { TableCardView } from "./TableCardView";
import {
    toggleSelectRow,
    toggleSelectAll,
    getSelectedCount,
    sortData,
    toggleSort,
} from "@/utils/tableUtils";
import { TableGroupView } from "./TableGroupView";
import { AdvancedFilterBuilder } from "./AdvancedFilterBuilder";
import { ActiveFiltersDisplay } from "./ActiveFiltersDisplay";
import LoadingState from "../LoadingState";
import ErrorState from "../ErrorState";
import { useSimplePagination } from "@/shared/hooks/usePagination";
import { PaginatedData } from "@/shared/api";

interface DynamicTableProps<T> {
    title?: string;
    originalData?: PaginatedData<any>;
    data: TableData[];
    columns: TableColumn[];
    initialView?: ViewMode;
    onAddClick?: () => void;
    addLabel?: string;
    onBulkAction?: (selectedIds: string[]) => void;
    bulkActionLabel?: string;
    onRowClick?: (rowId: string) => void;
    disableRowClick?: boolean;
    hideBorder?: boolean;
    hideHeader?: boolean;
    hideToolbar?: boolean;
    hidePagination?: boolean;
    hideActionButtons?: boolean;
    customToolbar?: React.ReactNode;
    customView?: (data: T[]) => React.ReactNode;
    noPadding?: boolean;
    onEdit?: (rowId: string) => void;
    onDelete?: (rowId: string) => void;
    rowClassName?: (row: { id: string }) => string;
    searchQuery?: string;
    onSearchChange?: (query: string) => void;
    metadata?: TableMetadata;
    activeFilters?: ActiveFilter[];
    onFiltersChange?: (filters: ActiveFilter[]) => void;
    groupableColumns?: GroupableColumn[];
    renderCard?: (row: TableData, columns: TableColumn[]) => React.ReactNode;
    isLoading?: boolean;
    isError?: boolean;
    errorMessage?: string;
}

export const DynamicTable = ({
    title = "All items",
    data,
    originalData,
    columns,
    initialView = "grid",
    onAddClick,
    addLabel = "Add new",
    onBulkAction,
    bulkActionLabel = "Action",
    disableRowClick = false,
    onRowClick,
    hideBorder = false,
    hideHeader = false,
    hideToolbar = false,
    hidePagination = false,
    hideActionButtons = false,
    customToolbar,
    customView,
    noPadding = false,
    onEdit,
    onDelete,
    rowClassName,
    searchQuery: controlledSearchQuery,
    onSearchChange,
    metadata,
    activeFilters: controlledActiveFilters,
    onFiltersChange,
    groupableColumns,
    renderCard,
    isLoading,
    isError,
    errorMessage,
}: DynamicTableProps<TableData>) => {
    const { t } = useTranslation();
    const [searchParams] = useSearchParams();

    // READ current page from URL
    const currentPage = Number(searchParams.get("page")) || 1;
    const lastPage = useMemo(() => {
        if (!originalData) {
            return 1;
        }
        return originalData!.lastPage;
    }, [originalData]);

    const perPage = useMemo(() => {
        if (!originalData) {
            return 1;
        }
        return originalData!.perPage;
    }, [originalData]);

    const totalCount = useMemo(() => {
        return lastPage > 1
            ? (lastPage - 1) * perPage + data.length
            : data.length;
    }, [lastPage, perPage, data]);

    const hasDefaultGroups =
        groupableColumns?.some((col) => col.isDefault) || false;
    const [viewMode, setViewMode] = useState<ViewMode>(
        hasDefaultGroups ? "group" : initialView
    );
    const [internalSearchQuery, setInternalSearchQuery] = useState("");
    const searchQuery =
        controlledSearchQuery !== undefined
            ? controlledSearchQuery
            : internalSearchQuery;

    const [tableData, setTableData] = useState<TableData[]>(
        data.map((item) => ({ ...item, selected: false }))
    );
    const [sortConfig, setSortConfig] = useState<SortConfig | null>(null);
    const [columnWidths, setColumnWidths] = useState<number[]>(
        columns.map(() => 200)
    );
    const [visibleColumns, setVisibleColumns] = useState<string[]>(
        columns.map((col) => col.id)
    );
    const [selectedFilters, setSelectedFilters] = useState<string[]>([]);
    const [selectedGroups, setSelectedGroups] = useState<string[]>(
        () =>
            groupableColumns
                ?.filter((col) => col.isDefault)
                .map((col) => col.id) || []
    );

    const [internalActiveFilters, setInternalActiveFilters] = useState<
        ActiveFilter[]
    >([]);
    const activeFilters =
        controlledActiveFilters !== undefined
            ? controlledActiveFilters
            : internalActiveFilters;
    const [showFilterBuilder, setShowFilterBuilder] = useState(false);

    // Get URL navigation functions from hook
    const { goToNextPage, goToPreviousPage, setPageInURL } =
        useSimplePagination(currentPage, lastPage);

    useEffect(() => {
        setTableData((prevTableData) => {
            return data.map((item) => {
                const existingItem = prevTableData.find(
                    (existing) => existing.id === item.id
                );
                return {
                    ...item,
                    selected: existingItem ? existingItem.selected : false,
                };
            });
        });
    }, [data]);

    const handleSort = useCallback((column: string) => {
        setSortConfig((current) => toggleSort(column, current));
    }, []);

    const handleFilterSelect = useCallback((filterId: string) => {
        setSelectedFilters((prev) => {
            if (prev.includes(filterId)) {
                return prev.filter((id) => id !== filterId);
            } else {
                return [...prev, filterId];
            }
        });
    }, []);

    const handleGroupSelect = useCallback(
        (groupId: string) => {
            setSelectedGroups((prev) => {
                let newSelectedGroups;

                if (prev.includes(groupId)) {
                    newSelectedGroups = prev.filter((id) => id !== groupId);
                } else {
                    newSelectedGroups = [...prev, groupId];
                }

                if (newSelectedGroups.length > 0) {
                    setViewMode("group");
                } else if (viewMode === "group") {
                    setViewMode("grid");
                }

                return newSelectedGroups;
            });
        },
        [viewMode]
    );

    const handleSearchChange = useCallback(
        (query: string) => {
            if (onSearchChange) {
                onSearchChange(query);
            } else {
                setInternalSearchQuery(query);
            }
        },
        [onSearchChange]
    );

    const handleFiltersChange = useCallback(
        (filters: ActiveFilter[]) => {
            if (onFiltersChange) {
                onFiltersChange(filters);
            } else {
                setInternalActiveFilters(filters);
            }
        },
        [onFiltersChange]
    );

    const handleRemoveFilter = useCallback(
        (filterId: string) => {
            const updatedFilters = activeFilters.filter(
                (f) => f.id !== filterId
            );
            handleFiltersChange(updatedFilters);
        },
        [activeFilters, handleFiltersChange]
    );

    const handleClearAllFilters = useCallback(() => {
        handleFiltersChange([]);
    }, [handleFiltersChange]);

    const processedData = useMemo(() => {
        let result = tableData;

        if (selectedGroups.length > 0) {
            result = result.map((item) => {
                const groupValues = selectedGroups
                    .map((groupId) => {
                        const column = columns.find(
                            (col) => col.id === groupId
                        );
                        if (column) {
                            const value = item.columns[column.accessorKey];
                            return `${column.header}: ${value}`;
                        }
                        return null;
                    })
                    .filter(Boolean);

                return {
                    ...item,
                    group:
                        groupValues.join(" | ") ||
                        t("designSystem:designSystem.table.ungrouped"),
                };
            });
        }

        return result;
    }, [tableData, selectedGroups, columns, t]);

    const filteredData = useMemo(() => {
        return processedData;
    }, [processedData]);

    const sortedData = useMemo(() => {
        return sortData(filteredData, sortConfig);
    }, [filteredData, sortConfig]);

    // Data is already paginated by server
    const currentData = useMemo(() => {
        return sortedData;
    }, [sortedData]);

    const handleRowSelection = useCallback((rowId: string) => {
        setTableData((currentTableData) =>
            toggleSelectRow(currentTableData, rowId)
        );
    }, []);

    const handleSelectAll = useCallback(
        (selected: boolean) => {
            const currentPageIds = currentData.map((item) => item.id);
            setTableData((currentTableData) =>
                toggleSelectAll(currentTableData, selected, currentPageIds)
            );
        },
        [currentData]
    );

    const selectedCount = useMemo(() => {
        return getSelectedCount(tableData);
    }, [tableData]);

    const selectedIds = useMemo(() => {
        return tableData.filter((item) => item.selected).map((item) => item.id);
    }, [tableData]);

    const handleBulkAction = () => {
        if (onBulkAction && selectedIds.length > 0) {
            onBulkAction(selectedIds);
        }
    };

    const handleColumnVisibilityChange = useCallback((columnIds: string[]) => {
        setVisibleColumns(columnIds);
    }, []);

    const visibleColumnsData = useMemo(() => {
        return columns.filter((column) => visibleColumns.includes(column.id));
    }, [columns, visibleColumns]);

    const handleColumnResize = useCallback((index: number, width: number) => {
        setColumnWidths((prevWidths) => {
            const newWidths = [...prevWidths];
            newWidths[index] = width;
            return newWidths;
        });

        try {
            const table = document.querySelector("table");
            if (table) {
                const rows = table.querySelectorAll("tbody tr");
                rows.forEach((row) => {
                    const cells = row.querySelectorAll("td");
                    if (cells.length > index + 1) {
                        const cell = cells[index + 1] as HTMLTableCellElement;
                        cell.style.width = `${width}px`;
                        cell.style.minWidth = `${width}px`;
                    }
                });
            }
        } catch (error) {
            console.error("Error updating table cells:", error);
        }
    }, []);

    const renderTableView = () => {
        if (customView) {
            return customView(currentData);
        }

        const viewProps = {
            data: currentData,
            columns: visibleColumnsData,
            onRowSelection: handleRowSelection,
            onSelectAll: handleSelectAll,
            sortConfig,
            onSort: handleSort,
            columnWidths,
            onColumnResize: handleColumnResize,
            onRowClick,
            disableRowClick,
            onEdit,
            onDelete,
            rowClassName,
        };

        switch (viewMode) {
            case "grid":
                return <TableGridView {...viewProps} />;
            case "cards":
                return <TableCardView {...viewProps} renderCard={renderCard} />;
            case "group":
                return <TableGroupView {...viewProps} />;
            default:
                return <TableGridView {...viewProps} />;
        }
    };

    return (
        <div
            className={`w-full bg-white dark:bg-gray-800 rounded-2xl ${
                hideBorder ? "" : "border border-gray-200 dark:border-gray-800"
            }`}
        >
            <div className={noPadding ? "p-2" : "p-10"}>
                <div className="w-full my-5">{customToolbar}</div>

                {!hideHeader && (
                    <div className="flex justify-between items-center">
                        <div>
                            <h2 className="text-lg font-bold text-gray-900 dark:text-white">
                                {title}
                            </h2>
                            <p className="text-sm text-left text-gray-500 dark:text-gray-400">
                                {selectedCount > 0
                                    ? `${selectedCount} of ${totalCount} selected`
                                    : `${totalCount} record${
                                          totalCount !== 1 ? "s" : ""
                                      }`}
                            </p>
                        </div>

                        <div className="flex gap-2">
                            {selectedCount > 0 && onBulkAction && (
                                <button
                                    onClick={handleBulkAction}
                                    className="bg-brand-500 hover:bg-brand-600 text-white px-4 py-2.5 rounded-lg text-sm font-medium transition-colors"
                                >
                                    {bulkActionLabel}
                                </button>
                            )}
                            {onAddClick && (
                                <button
                                    onClick={onAddClick}
                                    className="inline-flex items-center gap-2 bg-brand-500 hover:bg-brand-600 text-white px-4 py-2.5 rounded-lg text-sm font-medium transition-colors"
                                >
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
                                            d="M12 4v16m8-8H4"
                                        />
                                    </svg>
                                    {addLabel}
                                </button>
                            )}
                        </div>
                    </div>
                )}

                {!hideToolbar && (
                    <TableToolbar
                        totalItems={totalCount}
                        currentView={viewMode}
                        onViewChange={setViewMode}
                        onSearch={handleSearchChange}
                        searchQuery={searchQuery}
                        columns={columns}
                        currentPage={currentPage}
                        totalPages={lastPage}
                        onPageChange={setPageInURL}
                        goToNextPage={goToNextPage}
                        goToPreviousPage={goToPreviousPage}
                        itemsPerPage={perPage}
                        onItemsPerPageChange={() => {}}
                        onColumnVisibilityChange={handleColumnVisibilityChange}
                        visibleColumns={visibleColumns}
                        selectedFilters={selectedFilters}
                        onFilterSelect={handleFilterSelect}
                        selectedGroups={selectedGroups}
                        onGroupSelect={handleGroupSelect}
                        groupableColumns={groupableColumns}
                        metadata={metadata}
                        onAdvancedFilterClick={
                            metadata
                                ? () => setShowFilterBuilder(true)
                                : undefined
                        }
                        hideActionButtons={hideActionButtons}
                        hidePagination={hidePagination}
                    />
                )}

                {metadata && activeFilters.length > 0 && (
                    <div className="mt-4">
                        <ActiveFiltersDisplay
                            filters={activeFilters}
                            metadata={metadata}
                            onRemoveFilter={handleRemoveFilter}
                            onClearAll={handleClearAllFilters}
                        />
                    </div>
                )}

                {isError ? (
                    <ErrorState message={errorMessage!} />
                ) : isLoading ? (
                    <LoadingState />
                ) : (
                    <div className="overflow-visible">{renderTableView()}</div>
                )}

                {metadata && showFilterBuilder && (
                    <AdvancedFilterBuilder
                        metadata={metadata}
                        activeFilters={activeFilters}
                        onFiltersChange={handleFiltersChange}
                        onClose={() => setShowFilterBuilder(false)}
                    />
                )}
            </div>
        </div>
    );
};
