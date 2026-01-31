/**
 * Sales Subscription Feature - Domain Types
 *
 * Types for the Sales Subscription domain including:
 * - Coupon entity
 * - PriceList entity
 * - Purchase entity
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
