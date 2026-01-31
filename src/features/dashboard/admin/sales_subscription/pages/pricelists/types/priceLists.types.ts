/**
 * Price Lists Feature - Domain Types
 *
 * Types for the Price Lists domain including:
 * - Level Price entity
 * - Stats types
 * - Create/Update payloads
 * - Query parameters
 * - Level types
 */

import type { PaginatedData } from "../../../types/sales.types";

// ============================================================================
// Entity Types
// ============================================================================

/**
 * Level reference in level price
 */
export interface LevelPriceLevelRef {
    id: number;
    title: string;
}

/**
 * Group type for level price
 */
export type LevelPriceGroupType = "regular" | "special" | "premium";

/**
 * Level Price entity from API
 */
export interface LevelPrice {
    id: number;
    level?: LevelPriceLevelRef;
    name: string;
    description: string;
    price: string;
    groupType: LevelPriceGroupType;
    originalPrice: string;
    maxInstallments: number;
    isDefault: boolean;
    isActive: boolean;
    isValid: boolean;
    validFrom: string;
    validUntil: string;
    createdAt: string;
    updatedAt: string;
}

/**
 * Price List statistics
 */
export interface PriceListStats {
    activePriceLists: number;
    activePriceListsTrend: number;
    totalRevenue: number;
    expiredPriceLists: number;
    averagePrice: number;
}

// ============================================================================
// Query Parameters
// ============================================================================

/**
 * List query parameters for level prices
 */
export interface LevelPricesListParams {
    page?: number;
    search?: string;
    levelId?: string;
    isActive?: boolean;
}

// ============================================================================
// Payload Types
// ============================================================================

/**
 * Create level price payload (snake_case for API)
 */
export interface LevelPriceCreatePayload {
    level_id: number;
    name: string;
    description?: string;
    price: number;
    groupType?: LevelPriceGroupType;
    original_price?: number;
    max_installments?: number;
    is_default?: number;
    is_active?: number;
    valid_from?: string;
    valid_until?: string;
}

/**
 * Update level price payload (snake_case for API)
 */
export interface LevelPriceUpdatePayload {
    level_id?: number;
    name?: string;
    description?: string;
    price?: number;
    groupType?: LevelPriceGroupType;
    original_price?: number;
    max_installments?: number;
    is_default?: number;
    is_active?: number;
    valid_from?: string;
    valid_until?: string;
}

// ============================================================================
// API Response Types
// ============================================================================

/**
 * Level Prices paginated API response (for /level-prices/level/:levelId)
 */
export interface LevelPricesPaginatedResponse {
    perPage: number;
    currentPage: number;
    lastPage: number;
    nextPageUrl: string | null;
    items: LevelPrice[];
}

/**
 * Level Prices list API response (for /level-prices)
 */
export type LevelPricesListResponse = LevelPrice[];

// ============================================================================
// Re-export shared types
// ============================================================================

export type { PaginatedData };
