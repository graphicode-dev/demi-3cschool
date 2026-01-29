/**
 * useListQueryState Hook
 *
 * URL-synced state management for list pages.
 * Handles page, pageSize, search, sort, and filters with URL persistence.
 *
 * @example
 * ```tsx
 * const {
 *     page,
 *     pageSize,
 *     search,
 *     sort,
 *     filters,
 *     setPage,
 *     setSearch,
 *     setFilter,
 *     queryParams,
 * } = useListQueryState({
 *     defaultPageSize: 10,
 *     defaultSort: { field: 'createdAt', order: 'desc' },
 * });
 *
 * const { data } = useQuery({
 *     queryKey: ['courses', queryParams],
 *     queryFn: () => fetchCourses(queryParams),
 * });
 * ```
 */

import { useState, useCallback, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import type {
    SortConfig,
    SortOrder,
    Filters,
    FilterValue,
    UseListQueryStateOptions,
    UseListQueryStateReturn,
} from "./types";

// ============================================================================
// Constants
// ============================================================================

const DEFAULT_PAGE = 1;
const DEFAULT_PAGE_SIZE = 10;
const FILTER_PREFIX = "filter[";
const FILTER_SUFFIX = "]";

// ============================================================================
// Helpers
// ============================================================================

/**
 * Parse sort string from URL (e.g., "createdAt:desc")
 */
function parseSort(sortString: string | null): SortConfig | null {
    if (!sortString) return null;

    const [field, order] = sortString.split(":");
    if (!field) return null;

    return {
        field,
        order: (order as SortOrder) || "asc",
    };
}

/**
 * Serialize sort config to URL string
 */
function serializeSort(sort: SortConfig | null): string | null {
    if (!sort) return null;
    return `${sort.field}:${sort.order}`;
}

/**
 * Parse filters from URL search params
 */
function parseFilters(searchParams: URLSearchParams): Filters {
    const filters: Filters = {};

    searchParams.forEach((value, key) => {
        if (key.startsWith(FILTER_PREFIX) && key.endsWith(FILTER_SUFFIX)) {
            const filterKey = key.slice(
                FILTER_PREFIX.length,
                -FILTER_SUFFIX.length
            );

            // Handle array values (comma-separated)
            if (value.includes(",")) {
                filters[filterKey] = value.split(",");
            } else {
                filters[filterKey] = value;
            }
        }
    });

    return filters;
}

/**
 * Serialize filters to URL params
 */
function serializeFilters(filters: Filters, params: URLSearchParams): void {
    // Remove existing filter params
    const keysToRemove: string[] = [];
    params.forEach((_, key) => {
        if (key.startsWith(FILTER_PREFIX)) {
            keysToRemove.push(key);
        }
    });
    keysToRemove.forEach((key) => params.delete(key));

    // Add new filter params
    Object.entries(filters).forEach(([key, value]) => {
        if (value === null || value === undefined || value === "") return;

        const paramKey = `${FILTER_PREFIX}${key}${FILTER_SUFFIX}`;

        if (Array.isArray(value)) {
            params.set(paramKey, value.join(","));
        } else {
            params.set(paramKey, String(value));
        }
    });
}

// ============================================================================
// Hook
// ============================================================================

export function useListQueryState(
    options: UseListQueryStateOptions = {}
): UseListQueryStateReturn {
    const {
        defaultPageSize = DEFAULT_PAGE_SIZE,
        defaultSort = null,
        defaultFilters = {},
        paramPrefix = "",
    } = options;

    const [searchParams, setSearchParams] = useSearchParams();
    const [totalPages, setTotalPages] = useState(1);

    // Helper to get prefixed param name
    const getParamName = useCallback(
        (name: string) => (paramPrefix ? `${paramPrefix}_${name}` : name),
        [paramPrefix]
    );

    // ========================================================================
    // Read state from URL
    // ========================================================================

    const page = useMemo(() => {
        const pageParam = searchParams.get(getParamName("page"));
        if (!pageParam) return DEFAULT_PAGE;
        const parsed = parseInt(pageParam, 10);
        return Number.isNaN(parsed) ? DEFAULT_PAGE : Math.max(1, parsed);
    }, [searchParams, getParamName]);

    const pageSize = useMemo(() => {
        const sizeParam = searchParams.get(getParamName("pageSize"));
        if (!sizeParam) return defaultPageSize;
        const parsed = parseInt(sizeParam, 10);
        return Number.isNaN(parsed) ? defaultPageSize : Math.max(1, parsed);
    }, [searchParams, getParamName, defaultPageSize]);

    const search = useMemo(() => {
        return searchParams.get(getParamName("search")) || "";
    }, [searchParams, getParamName]);

    const sort = useMemo(() => {
        const sortParam = searchParams.get(getParamName("sort"));
        return parseSort(sortParam) || defaultSort;
    }, [searchParams, getParamName, defaultSort]);

    const filters = useMemo(() => {
        const urlFilters = parseFilters(searchParams);
        return { ...defaultFilters, ...urlFilters };
    }, [searchParams, defaultFilters]);

    // ========================================================================
    // Update URL helpers
    // ========================================================================

    const updateParams = useCallback(
        (updates: Record<string, string | null>) => {
            setSearchParams(
                (prev) => {
                    const newParams = new URLSearchParams(prev);

                    Object.entries(updates).forEach(([key, value]) => {
                        const paramName = getParamName(key);
                        if (value === null || value === "") {
                            newParams.delete(paramName);
                        } else {
                            newParams.set(paramName, value);
                        }
                    });

                    return newParams;
                },
                { replace: true }
            );
        },
        [setSearchParams, getParamName]
    );

    // ========================================================================
    // Setters
    // ========================================================================

    const setPage = useCallback(
        (newPage: number) => {
            updateParams({
                page: newPage === DEFAULT_PAGE ? null : String(newPage),
            });
        },
        [updateParams]
    );

    const setPageSize = useCallback(
        (newSize: number) => {
            updateParams({
                pageSize: newSize === defaultPageSize ? null : String(newSize),
                page: null, // Reset to page 1 when changing page size
            });
        },
        [updateParams, defaultPageSize]
    );

    const setSearch = useCallback(
        (newSearch: string) => {
            updateParams({
                search: newSearch || null,
                page: null, // Reset to page 1 when searching
            });
        },
        [updateParams]
    );

    const setSort = useCallback(
        (field: string, order: SortOrder = "asc") => {
            const newSort: SortConfig = { field, order };
            const serialized = serializeSort(newSort);
            const defaultSerialized = serializeSort(defaultSort);

            updateParams({
                sort: serialized === defaultSerialized ? null : serialized,
            });
        },
        [updateParams, defaultSort]
    );

    const setFilter = useCallback(
        (key: string, value: FilterValue) => {
            setSearchParams(
                (prev) => {
                    const newParams = new URLSearchParams(prev);
                    const paramKey = `${FILTER_PREFIX}${key}${FILTER_SUFFIX}`;

                    if (value === null || value === undefined || value === "") {
                        newParams.delete(paramKey);
                    } else if (Array.isArray(value)) {
                        newParams.set(paramKey, value.join(","));
                    } else {
                        newParams.set(paramKey, String(value));
                    }

                    // Reset to page 1 when filtering
                    newParams.delete(getParamName("page"));

                    return newParams;
                },
                { replace: true }
            );
        },
        [setSearchParams, getParamName]
    );

    const setFilters = useCallback(
        (newFilters: Filters) => {
            setSearchParams(
                (prev) => {
                    const newParams = new URLSearchParams(prev);
                    serializeFilters(newFilters, newParams);
                    newParams.delete(getParamName("page")); // Reset to page 1
                    return newParams;
                },
                { replace: true }
            );
        },
        [setSearchParams, getParamName]
    );

    const removeFilter = useCallback(
        (key: string) => {
            setFilter(key, null);
        },
        [setFilter]
    );

    const resetFilters = useCallback(() => {
        setSearchParams(
            (prev) => {
                const newParams = new URLSearchParams(prev);

                // Remove all filter params
                const keysToRemove: string[] = [];
                newParams.forEach((_, key) => {
                    if (key.startsWith(FILTER_PREFIX)) {
                        keysToRemove.push(key);
                    }
                });
                keysToRemove.forEach((key) => newParams.delete(key));

                // Reset to page 1
                newParams.delete(getParamName("page"));

                return newParams;
            },
            { replace: true }
        );
    }, [setSearchParams, getParamName]);

    const resetAll = useCallback(() => {
        setSearchParams(
            (prev) => {
                const newParams = new URLSearchParams();

                // Keep non-list params
                prev.forEach((value, key) => {
                    const isListParam =
                        key === getParamName("page") ||
                        key === getParamName("pageSize") ||
                        key === getParamName("search") ||
                        key === getParamName("sort") ||
                        key.startsWith(FILTER_PREFIX);

                    if (!isListParam) {
                        newParams.set(key, value);
                    }
                });

                return newParams;
            },
            { replace: true }
        );
    }, [setSearchParams, getParamName]);

    // ========================================================================
    // Query params for API
    // ========================================================================

    const queryParams = useMemo(() => {
        const params: Record<string, unknown> = {
            page,
            pageSize,
        };

        if (search) {
            params.search = search;
        }

        if (sort) {
            params.sortBy = sort.field;
            params.sortOrder = sort.order;
        }

        // Flatten filters
        Object.entries(filters).forEach(([key, value]) => {
            if (value !== null && value !== undefined && value !== "") {
                params[key] = value;
            }
        });

        return params;
    }, [page, pageSize, search, sort, filters]);

    // ========================================================================
    // Computed helpers
    // ========================================================================

    const isFiltered = useMemo(() => {
        return Object.keys(filters).length > 0 || search !== "";
    }, [filters, search]);

    const toggleSort = useCallback(
        (field: string) => {
            if (sort?.field === field) {
                // Toggle order if same field
                const newOrder = sort.order === "asc" ? "desc" : "asc";
                setSort(field, newOrder);
            } else {
                // Default to desc for new field
                setSort(field, "desc");
            }
        },
        [sort, setSort]
    );

    return {
        // State
        page,
        pageSize,
        search,
        sort,
        filters,
        totalPages,

        // Setters
        setPage,
        setPageSize,
        setSearch,
        setSort,
        setFilter,
        setFilters,
        removeFilter,
        resetFilters,
        resetAll,
        setTotalPages,

        // Helpers
        isFiltered,
        toggleSort,

        // API params
        queryParams,
    };
}

export default useListQueryState;
