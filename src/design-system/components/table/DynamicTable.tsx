import React, { useState, useMemo, useCallback, useEffect } from "react";
import { useTranslation } from "react-i18next";
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
    paginateData,
    toggleSelectRow,
    toggleSelectAll,
    getSelectedCount,
    sortData,
    toggleSort,
} from "@/utils/tableUtils";
import { TableGroupView } from "./TableGroupView";
import { AdvancedFilterBuilder } from "./AdvancedFilterBuilder";
import { ActiveFiltersDisplay } from "./ActiveFiltersDisplay";

/**
 * DynamicTable Component
 *
 * A flexible table component that supports both client-side and server-side operations.
 *
 * ## Search Functionality
 *
 * ### Client-Side Search (Default)
 * When no `onSearchChange` prop is provided, the table performs local filtering:
 * ```tsx
 * <DynamicTable
 *   data={localData}
 *   columns={columns}
 *   // Search happens locally - no additional props needed
 * />
 * ```
 *
 * ### Server-Side Search
 * Pass `onSearchChange` to handle search externally (e.g., API calls):
 * ```tsx
 * const { handleSearchChange, getDebouncedSearchTerm } = useSearch();
 *
 * const { data } = useQuery({
 *   queryKey: ['items', getDebouncedSearchTerm('items')],
 *   queryFn: () => fetchItems(getDebouncedSearchTerm('items'))
 * });
 *
 * <DynamicTable
 *   data={data}
 *   columns={columns}
 *   searchQuery={getDebouncedSearchTerm('items')}
 *   onSearchChange={(query) => handleSearchChange('items', query)}
 * />
 * ```
 *
 * ### Hybrid Search
 * Enable both client and server search simultaneously:
 * ```tsx
 * <DynamicTable
 *   data={serverData}
 *   columns={columns}
 *   searchQuery={serverSearchTerm}
 *   onSearchChange={handleServerSearch}
 *   enableClientSearch={true} // Also filter results locally
 * />
 * ```
 */
interface DynamicTableProps<T> {
    title?: string;
    data: TableData[];
    columns: TableColumn[];
    initialView?: ViewMode;
    itemsPerPage?: number;
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
    // API pagination props
    totalCount?: number;
    currentPage?: number;
    lastPage?: number;
    onPageChange?: (page: number) => void;
    // Row actions
    onEdit?: (rowId: string) => void;
    onDelete?: (rowId: string) => void;
    // Row styling
    rowClassName?: (row: { id: string }) => string;
    // Search props
    searchQuery?: string; // Controlled search state from parent
    onSearchChange?: (query: string) => void; // Callback for server-side search
    enableClientSearch?: boolean; // Enable client-side search (default: true if onSearchChange not provided)
    // Metadata-based filtering
    metadata?: TableMetadata; // Table metadata for advanced filtering
    activeFilters?: ActiveFilter[]; // Controlled active filters
    onFiltersChange?: (filters: ActiveFilter[]) => void; // Callback when filters change
    // Groupable columns - controls which columns appear in the "Group by" filter dropdown
    // Each column can have an isDefault flag to be pre-selected
    groupableColumns?: GroupableColumn[];
    // Custom card renderer for cards view
    renderCard?: (row: TableData, columns: TableColumn[]) => React.ReactNode;
}

export const DynamicTable = ({
    title = "All items",
    data,
    columns,
    initialView = "grid",
    itemsPerPage: initialItemsPerPage = 10,
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
    // API pagination props
    totalCount,
    currentPage: apiCurrentPage,
    lastPage,
    onPageChange,
    // Row actions
    onEdit,
    onDelete,
    rowClassName,
    // Search props
    searchQuery: controlledSearchQuery,
    onSearchChange,
    enableClientSearch,
    // Metadata props
    metadata,
    activeFilters: controlledActiveFilters,
    onFiltersChange,
    // Groupable columns
    groupableColumns,
    // Custom card renderer
    renderCard,
}: DynamicTableProps<TableData>) => {
    const { t } = useTranslation();
    // Check if there are default selected groups to determine initial view mode
    const hasDefaultGroups =
        groupableColumns?.some((col) => col.isDefault) || false;
    const [viewMode, setViewMode] = useState<ViewMode>(
        hasDefaultGroups ? "group" : initialView
    );
    // For internal pagination, use API current page if provided, otherwise default to 1
    // If onPageChange is provided, we'll use the external pagination state
    const [internalCurrentPage, setInternalCurrentPage] = useState(
        apiCurrentPage || 1
    );
    const [itemsPerPage, setItemsPerPage] = useState(initialItemsPerPage);
    // Use controlled search query if provided, otherwise use internal state
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
        columns.map(() => 200) // Default width of 200px
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

    // Metadata-based filters
    const [internalActiveFilters, setInternalActiveFilters] = useState<
        ActiveFilter[]
    >([]);
    const activeFilters =
        controlledActiveFilters !== undefined
            ? controlledActiveFilters
            : internalActiveFilters;
    const [showFilterBuilder, setShowFilterBuilder] = useState(false);

    // Determine if client-side search should be enabled
    // If onSearchChange is provided, assume server-side search unless explicitly enabled
    const isClientSearchEnabled = enableClientSearch ?? !onSearchChange;

    // Use the external current page if provided, otherwise use internal state
    // This ensures we're always using the correct page state
    const currentPage =
        apiCurrentPage !== undefined ? apiCurrentPage : internalCurrentPage;

    // Update tableData when data prop changes
    useEffect(() => {
        setTableData((prevTableData) => {
            return data.map((item) => {
                // Preserve selected state if item already exists
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

    // Handle filter selection
    const handleFilterSelect = useCallback((filterId: string) => {
        setSelectedFilters((prev) => {
            if (prev.includes(filterId)) {
                return prev.filter((id) => id !== filterId);
            } else {
                return [...prev, filterId];
            }
        });
    }, []);

    // Handle group selection
    const handleGroupSelect = useCallback(
        (groupId: string) => {
            setSelectedGroups((prev) => {
                let newSelectedGroups;

                if (prev.includes(groupId)) {
                    // Remove the group if it's already selected
                    newSelectedGroups = prev.filter((id) => id !== groupId);
                } else {
                    // Add the group to the existing selection
                    newSelectedGroups = [...prev, groupId];
                }

                // Switch view mode based on the new selected groups
                if (newSelectedGroups.length > 0) {
                    // Switch to group view when groups are selected
                    setViewMode("group");
                } else if (viewMode === "group") {
                    // Switch back to grid view when all groups are cleared
                    setViewMode("grid");
                }

                return newSelectedGroups;
            });
        },
        [viewMode]
    );

    // Handle search change
    const handleSearchChange = useCallback(
        (query: string) => {
            if (onSearchChange) {
                // Server-side search: notify parent component
                onSearchChange(query);
            } else {
                // Client-side search: update internal state
                setInternalSearchQuery(query);
            }
        },
        [onSearchChange]
    );

    // Handle filter changes
    const handleFiltersChange = useCallback(
        (filters: ActiveFilter[]) => {
            if (onFiltersChange) {
                // Server-side filtering: notify parent component
                onFiltersChange(filters);
            } else {
                // Client-side filtering: update internal state
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

    // Process data with grouping
    const processedData = useMemo(() => {
        let result = tableData;

        // Apply client-side search query filter only if enabled
        if (isClientSearchEnabled && searchQuery) {
            result = result.filter((item) => {
                // Search across all column values
                return Object.values(item.columns).some((value) =>
                    String(value)
                        .toLowerCase()
                        .includes(searchQuery.toLowerCase())
                );
            });
        }

        // Apply grouping if any groups are selected
        if (selectedGroups.length > 0) {
            // Add group information to each row based on selected group columns
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

                // For multiple group selections, we'll create a composite group key
                return {
                    ...item,
                    group:
                        groupValues.join(" | ") ||
                        t("designSystem:designSystem.table.ungrouped"),
                };
            });
        }

        return result;
    }, [
        tableData,
        searchQuery,
        selectedGroups,
        columns,
        isClientSearchEnabled,
        t,
    ]);

    // Apply column filters - only if filters are selected
    const filteredData = useMemo(() => {
        const result = processedData;

        return result;
    }, [processedData, selectedFilters]);

    const sortedData = useMemo(() => {
        return sortData(filteredData, sortConfig);
    }, [filteredData, sortConfig]);

    // Use API lastPage if provided, otherwise calculate from local data
    const totalPages =
        lastPage || Math.max(1, Math.ceil(sortedData.length / itemsPerPage));

    // Reset to first page when search changes (only for client-side search)
    useEffect(() => {
        // Reset to first page only when search query actually changes and client search is enabled
        if (isClientSearchEnabled && searchQuery) {
            setInternalCurrentPage(1);
            if (onPageChange) onPageChange(1);
        }
    }, [searchQuery, isClientSearchEnabled, onPageChange]);

    const currentData = useMemo(() => {
        // If we're using API pagination, use the entire data as is
        // Otherwise, paginate the data locally
        return onPageChange
            ? sortedData
            : paginateData(sortedData, currentPage, itemsPerPage);
    }, [sortedData, currentPage, itemsPerPage, onPageChange]);

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

    // Handle column visibility change
    const handleColumnVisibilityChange = useCallback((columnIds: string[]) => {
        setVisibleColumns(columnIds);
    }, []);

    // Filter columns based on visibility
    const visibleColumnsData = useMemo(() => {
        return columns.filter((column) => visibleColumns.includes(column.id));
    }, [columns, visibleColumns]);

    // Handle column resize
    const handleColumnResize = useCallback((index: number, width: number) => {
        // Update the column widths state
        setColumnWidths((prevWidths) => {
            const newWidths = [...prevWidths];
            newWidths[index] = width;
            return newWidths;
        });

        // Try to update all cells in the column for immediate visual feedback
        try {
            const table = document.querySelector("table");
            if (table) {
                const rows = table.querySelectorAll("tbody tr");
                rows.forEach((row) => {
                    const cells = row.querySelectorAll("td");
                    // +1 because of the checkbox column
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
                {/* Custom Toolbar */}
                <div className="w-full my-5">{customToolbar}</div>

                {/* Header */}
                {!hideHeader && (
                    <div className="flex justify-between items-center">
                        {/* Title */}
                        <div>
                            <h2 className="text-lg font-bold text-gray-900 dark:text-white">
                                {title}
                            </h2>
                            <p className="text-sm text-left text-gray-500 dark:text-gray-400">
                                {selectedCount > 0
                                    ? `${selectedCount} of ${
                                          totalCount || filteredData.length
                                      } selected`
                                    : `${
                                          totalCount || filteredData.length
                                      } record${
                                          (totalCount ||
                                              filteredData.length) !== 1
                                              ? "s"
                                              : ""
                                      }`}
                            </p>
                        </div>

                        {/* Actions */}
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

                {/* Toolbar */}
                {!hideToolbar && (
                    <TableToolbar
                        totalItems={totalCount || filteredData.length}
                        currentView={viewMode}
                        onViewChange={setViewMode}
                        onSearch={handleSearchChange}
                        searchQuery={searchQuery}
                        columns={columns}
                        currentPage={currentPage}
                        totalPages={totalPages}
                        onPageChange={(page: number) => {
                            // Prevent redundant page changes
                            if (page === currentPage) return;

                            // For external (API) pagination, only notify parent
                            if (onPageChange) {
                                onPageChange(page);
                            }
                            // For internal pagination, update internal state
                            else {
                                setInternalCurrentPage(page);
                            }
                        }}
                        itemsPerPage={itemsPerPage}
                        onItemsPerPageChange={setItemsPerPage}
                        onColumnVisibilityChange={handleColumnVisibilityChange}
                        visibleColumns={visibleColumns}
                        selectedFilters={selectedFilters}
                        onFilterSelect={handleFilterSelect}
                        selectedGroups={selectedGroups}
                        onGroupSelect={handleGroupSelect}
                        groupableColumns={groupableColumns}
                        // Metadata-based filtering
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

                {/* Active Filters Display */}
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

                <div className="overflow-visible">{renderTableView()}</div>

                {/* Advanced Filter Builder Modal */}
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
