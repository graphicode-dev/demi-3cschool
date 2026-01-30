/**
 * Tickets Management Feature - Domain Types
 *
 * Types for the Tickets Management domain including:
 * - Ticket entity
 * - Stats types
 * - API response types
 */

// ============================================================================
// API Response Types (shared)
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
