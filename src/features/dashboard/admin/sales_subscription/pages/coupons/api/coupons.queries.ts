/**
 * Coupons Feature - Query Hooks
 *
 * TanStack Query hooks for reading coupon data.
 * All queries support AbortSignal for cancellation.
 *
 * @example
 * ```tsx
 * // List all coupons
 * const { data, isLoading } = useCouponsList();
 *
 * // Get single coupon
 * const { data: coupon } = useCoupon(couponId);
 *
 * // Generate unique code
 * const { data: codeData } = useGenerateCouponCode();
 * ```
 */

import { useQuery, type UseQueryOptions } from "@tanstack/react-query";
import { couponKeys } from "./coupons.keys";
import { couponsApi } from "./coupons.api";
import type {
    Coupon,
    CouponsListParams,
    GenerateCodeResponse,
    CouponUsage,
} from "../types";

// ============================================================================
// List Queries
// ============================================================================

/**
 * Hook to fetch list of all coupons
 *
 * @param params - Query parameters for filtering
 * @param options - Additional query options
 *
 * @example
 * ```tsx
 * const { data } = useCouponsList({ search: 'SUMMER' });
 * ```
 */
export function useCouponsList(
    params?: CouponsListParams,
    options?: Partial<UseQueryOptions<Coupon[], Error>>
) {
    return useQuery({
        queryKey: couponKeys.list(params),
        queryFn: ({ signal }) => couponsApi.getList(params, signal),
        placeholderData: (previousData) => previousData,
        ...options,
    });
}

// ============================================================================
// Detail Queries
// ============================================================================

/**
 * Hook to fetch single coupon by ID
 *
 * @param id - Coupon ID
 * @param options - Additional query options
 *
 * @example
 * ```tsx
 * const { data: coupon, isLoading, error } = useCoupon(couponId);
 *
 * if (isLoading) return <Spinner />;
 * if (error) return <ErrorMessage error={error} />;
 *
 * return (
 *     <div>
 *         <h1>{coupon.code}</h1>
 *         <p>Discount: {coupon.value}</p>
 *     </div>
 * );
 * ```
 */
export function useCoupon(
    id: string | undefined | null,
    options?: Partial<UseQueryOptions<Coupon, Error>>
) {
    return useQuery({
        queryKey: couponKeys.detail(id ?? ""),
        queryFn: ({ signal }) => couponsApi.getById(id!, signal),
        enabled: !!id,
        ...options,
    });
}

// ============================================================================
// Generate Code Query
// ============================================================================

/**
 * Hook to generate a unique coupon code
 *
 * @param options - Additional query options
 *
 * @example
 * ```tsx
 * const { data, refetch } = useGenerateCouponCode();
 *
 * const handleGenerateCode = () => {
 *     refetch();
 * };
 * ```
 */
export function useGenerateCouponCode(
    options?: Partial<UseQueryOptions<GenerateCodeResponse, Error>>
) {
    return useQuery({
        queryKey: couponKeys.generateCode(),
        queryFn: ({ signal }) => couponsApi.generateCode(signal),
        enabled: false, // Only fetch on demand
        ...options,
    });
}

// ============================================================================
// Usages Queries
// ============================================================================

/**
 * Hook to fetch coupon usages by coupon ID
 *
 * @param couponId - Coupon ID
 * @param options - Additional query options
 */
export function useCouponUsages(
    couponId: string | undefined | null,
    options?: Partial<UseQueryOptions<CouponUsage[], Error>>
) {
    return useQuery({
        queryKey: couponKeys.usage(couponId ?? ""),
        queryFn: ({ signal }) => couponsApi.getUsages(couponId!, signal),
        enabled: !!couponId,
        ...options,
    });
}
