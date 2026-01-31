/**
 * Programs curriculum type
 */
export type ProgramsCurriculum = "first_term" | "second_term" | "summer_camp";

// ============================================================================
// API Response Types
// ============================================================================

/**
 * Paginated data structure
 */
export interface PaginatedData<T> {
    perPage: number;
    currentPage: number;
    lastPage: number;
    nextPageUrl: string | null;
    items: T[];
}

/**
 * Paginated response wrapper
 */
export interface PaginatedResponse<T> {
    success: boolean;
    message: string;
    data: PaginatedData<T>;
}

/**
 * List response wrapper (array)
 */
export interface ListResponse<T> {
    success: boolean;
    message: string;
    data: T[];
}
