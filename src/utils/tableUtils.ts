import type { TableData, FilterConfig, SortConfig } from "@/shared/types";

export const getInitials = (name: string): string => {
    return name
        .split(" ")
        .map((part) => part[0])
        .join("")
        .toUpperCase()
        .substring(0, 2);
};

export const filterData = (
    data: TableData[],
    searchQuery: string,
    activeFilters: FilterConfig[] = []
): TableData[] => {
    // First apply search query filter
    let filteredData = data;

    if (searchQuery) {
        const lowerQuery = searchQuery.toLowerCase();
        filteredData = filteredData.filter((item) => {
            return Object.values(item.columns).some((value) =>
                String(value).toLowerCase().includes(lowerQuery)
            );
        });
    }

    // Then apply advanced filters if any
    if (activeFilters.length > 0) {
        filteredData = filteredData.filter((item) => {
            return activeFilters.every((filter) => {
                const value = String(
                    item.columns[filter.column] || ""
                ).toLowerCase();
                const filterValue = filter.value.toLowerCase();

                switch (filter.operator) {
                    case "equals":
                        return value === filterValue;
                    case "contains":
                        return value.includes(filterValue);
                    case "startsWith":
                        return value.startsWith(filterValue);
                    case "endsWith":
                        return value.endsWith(filterValue);
                    case "greaterThan":
                        return Number(value) > Number(filterValue);
                    case "lessThan":
                        return Number(value) < Number(filterValue);
                    default:
                        return true;
                }
            });
        });
    }

    return filteredData;
};

export const sortData = (
    data: TableData[],
    sortConfig: SortConfig | null
): TableData[] => {
    if (!sortConfig || !sortConfig.column || !sortConfig.direction) {
        return data;
    }

    return [...data].sort((a, b) => {
        const aValue = a.columns[sortConfig.column];
        const bValue = b.columns[sortConfig.column];

        if (typeof aValue === "number" && typeof bValue === "number") {
            return sortConfig.direction === "asc"
                ? aValue - bValue
                : bValue - aValue;
        }

        const aString = String(aValue || "").toLowerCase();
        const bString = String(bValue || "").toLowerCase();

        if (sortConfig.direction === "asc") {
            return aString.localeCompare(bString);
        } else {
            return bString.localeCompare(aString);
        }
    });
};

export const paginateData = (
    data: TableData[],
    page: number,
    itemsPerPage: number
): TableData[] => {
    const startIndex = (page - 1) * itemsPerPage;
    return data.slice(startIndex, startIndex + itemsPerPage);
};

export const toggleSelectRow = (data: TableData[], id: string): TableData[] => {
    return data.map((item) =>
        item.id === id ? { ...item, selected: !item.selected } : item
    );
};

export const toggleSelectAll = (
    data: TableData[],
    selected: boolean,
    currentPageIds?: string[]
): TableData[] => {
    if (!currentPageIds) {
        // Original behavior - select all items
        return data.map((item) => ({ ...item, selected }));
    }

    // New behavior - only select items on the current page
    return data.map((item) =>
        currentPageIds.includes(item.id) ? { ...item, selected } : item
    );
};

export const getSelectedCount = (data: TableData[]): number => {
    return data.filter((item) => item.selected).length;
};

export const toggleSort = (
    currentColumn: string,
    currentSortConfig: SortConfig | null
): SortConfig | null => {
    if (!currentSortConfig || currentSortConfig.column !== currentColumn) {
        return { column: currentColumn, direction: "asc" };
    }

    if (currentSortConfig.direction === "asc") {
        return { column: currentColumn, direction: "desc" };
    }

    return null;
};
