/**
 * Coupons Feature - API Module
 *
 * Public exports for the coupons API layer.
 * Import from '@/features/sales_subscription/pages/coupons/api' or '@/features/sales_subscription/pages/coupons'.
 *
 * @example
 * ```ts
 * import {
 *     useCouponsList,
 *     useCoupon,
 *     useCreateCoupon,
 *     useGenerateCouponCode,
 *     couponKeys,
 * } from '@/features/sales_subscription/pages/coupons';
 * ```
 */

// Types
export type {
    Coupon,
    CouponLevelRef,
    CouponStatus,
    CouponDiscountType,
    CouponStats,
    CouponsListParams,
    CouponUsagesListParams,
    CouponCreatePayload,
    CouponUpdatePayload,
    CouponValidatePayload,
    CouponValidateResponse,
    CouponChangeStatusPayload,
    GenerateCodeResponse,
    CouponUsage,
    CouponUsageUser,
    CouponUsageStats,
    PaginatedData,
} from "../types";

// Query Keys
export { couponKeys, type CouponQueryKey } from "./coupons.keys";

// API Functions
export { couponsApi } from "./coupons.api";

// Query Hooks
export {
    useCouponsList,
    useCoupon,
    useGenerateCouponCode,
    useCouponUsages,
} from "./coupons.queries";

// Mutation Hooks
export {
    useCreateCoupon,
    useUpdateCoupon,
    useDeleteCoupon,
    useValidateCoupon,
    useChangeCouponStatus,
} from "./coupons.mutations";
