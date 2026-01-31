/**
 * Coupons Feature - Domain Types
 *
 * Types for the Coupons domain including:
 * - Coupon entity
 * - Stats types
 * - Create/Update payloads
 * - Query parameters
 * - Usage types
 */

import type { PaginatedData } from "../../../types/sales.types";

// ============================================================================
// Entity Types
// ============================================================================

/**
 * Level reference in coupon
 */
export interface CouponLevelRef {
    id: number;
    title: string;
}

/**
 * Coupon status type
 */
export type CouponStatus = "active" | "inactive" | "expired";

/**
 * Coupon discount type
 */
export type CouponDiscountType = "percentage" | "fixed";

/**
 * Coupon entity from API
 */
export interface Coupon {
    id: number;
    code: string;
    name: string;
    description: string;
    type: CouponDiscountType;
    typeLabel: string;
    value: string;
    minPurchaseAmount: string;
    maxDiscountAmount: string;
    usageLimit: number;
    usageLimitPerUser: number;
    usedCount: number;
    validFrom: string;
    validUntil: string;
    status: CouponStatus;
    statusLabel: string;
    isFirstSubscriptionOnly: boolean;
    isValid: boolean;
    levels: CouponLevelRef[];
    createdAt: string;
    updatedAt: string;
}

/**
 * Coupon statistics
 */
export interface CouponStats {
    activeCoupons: number;
    totalUsages: number;
    expiredCoupons: number;
    totalRevenue: number;
    trend: {
        activeCoupons: number;
        totalUsages: number;
        expiredCoupons: number;
        totalRevenue: number;
    };
}

/**
 * Generate code response
 */
export interface GenerateCodeResponse {
    code: string;
}

/**
 * Validate coupon payload
 */
export interface CouponValidatePayload {
    code: string;
    level_id: string;
    amount: number;
    student_id: string;
}

/**
 * Validate coupon response
 */
export interface CouponValidateResponse {
    valid: boolean;
    message: string;
    coupon: Coupon | null;
}

/**
 * Change status payload
 */
export interface CouponChangeStatusPayload {
    status: CouponStatus;
}

// ============================================================================
// Usage Types
// ============================================================================

/**
 * User who used a coupon
 */
export interface CouponUsageUser {
    id: number;
    name: string;
    email: string;
}

/**
 * Coupon reference in usage
 */
export interface CouponUsageCouponRef {
    id: number;
    code: string;
    name: string;
}

/**
 * Level subscription in usage
 */
export interface CouponUsageLevelSubscription {
    id: number;
    level: {
        id: number;
        title: string;
    };
}

/**
 * Coupon usage record from API
 */
export interface CouponUsage {
    id: number;
    user: CouponUsageUser;
    coupon: CouponUsageCouponRef;
    levelSubscription: CouponUsageLevelSubscription;
    originalAmount: string;
    discountAmount: string;
    finalAmount: string;
    createdAt: string;
}

/**
 * Coupon usage statistics
 */
export interface CouponUsageStats {
    totalUses: number;
    remainingUses: number;
}

// ============================================================================
// Query Parameters
// ============================================================================

/**
 * List query parameters for coupons
 */
export interface CouponsListParams {
    page?: number;
    search?: string;
    isActive?: boolean;
}

/**
 * List query parameters for coupon usages
 */
export interface CouponUsagesListParams {
    couponId: string;
    page?: number;
    search?: string;
}

// ============================================================================
// Payload Types
// ============================================================================

/**
 * Create coupon payload
 */
export interface CouponCreatePayload {
    code: string;
    name: string;
    description?: string;
    type: CouponDiscountType;
    value: number;
    min_purchase_amount?: number;
    max_discount_amount?: number;
    usage_limit?: number;
    usage_limit_per_user?: number;
    valid_from?: string;
    valid_until?: string;
    status?: CouponStatus;
    is_first_purchase_only?: boolean;
    level_ids?: number[];
}

/**
 * Update coupon payload
 */
export interface CouponUpdatePayload {
    code?: string;
    name?: string;
    description?: string;
    type?: CouponDiscountType;
    value?: number;
    min_purchase_amount?: number;
    max_discount_amount?: number;
    usage_limit?: number;
    usage_limit_per_user?: number;
    valid_from?: string;
    valid_until?: string;
    status?: CouponStatus;
    is_first_purchase_only?: boolean;
    level_ids?: number[];
}

// ============================================================================
// Re-export shared types
// ============================================================================

export type { PaginatedData };
