/**
 * Shared Hooks - Types
 *
 * Types for URL-synced state hooks.
 */

// ============================================================================
// Sort Types
// ============================================================================

/**
 * Sort order
 */
export type SortOrder = "asc" | "desc";

/**
 * Sort configuration
 */
export interface SortConfig {
    field: string;
    order: SortOrder;
}

// ============================================================================
// Filter Types
// ============================================================================

/**
 * Filter value (single or multiple)
 */
export type FilterValue = string | string[] | number | boolean | null;

/**
 * Filters object
 */
export type Filters = Record<string, FilterValue>;

// ============================================================================
// List Query State Types
// ============================================================================

/**
 * List query state
 */
export interface ListQueryState {
    page: number;
    pageSize: number;
    search: string;
    sort: SortConfig | null;
    filters: Filters;
}

/**
 * List query state options
 */
export interface UseListQueryStateOptions {
    /** Default page size */
    defaultPageSize?: number;
    /** Default sort configuration */
    defaultSort?: SortConfig;
    /** Default filters */
    defaultFilters?: Filters;
    /** Debounce delay for search (ms) */
    searchDebounce?: number;
    /** URL parameter prefix for namespacing */
    paramPrefix?: string;
}

/**
 * List query state return type
 */
export interface UseListQueryStateReturn extends ListQueryState {
    /** Set page number */
    setPage: (page: number) => void;
    /** Set page size */
    setPageSize: (size: number) => void;
    /** Set search term */
    setSearch: (search: string) => void;
    /** Set sort configuration */
    setSort: (field: string, order?: SortOrder) => void;
    /** Set a single filter */
    setFilter: (key: string, value: FilterValue) => void;
    /** Set multiple filters at once */
    setFilters: (filters: Filters) => void;
    /** Remove a filter */
    removeFilter: (key: string) => void;
    /** Reset all filters */
    resetFilters: () => void;
    /** Reset all state to defaults */
    resetAll: () => void;
    /** Query params object for API calls */
    queryParams: Record<string, unknown>;
    /** Total pages (set externally) */
    totalPages: number;
    /** Set total pages */
    setTotalPages: (total: number) => void;
    /** Whether any filters or search are active */
    isFiltered: boolean;
    /** Toggle sort order for a field (asc/desc) */
    toggleSort: (field: string) => void;
}

// ============================================================================
// Pagination Types
// ============================================================================

/**
 * Pagination info from API
 */
export interface PaginationMeta {
    currentPage: number;
    totalPages: number;
    pageSize: number;
    totalItems: number;
}
