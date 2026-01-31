/**
 * Coupons Feature - Mutation Hooks
 *
 * TanStack Query mutation hooks for creating, updating, and deleting coupons.
 *
 * @example
 * ```tsx
 * const { mutate: createCoupon, isPending } = useCreateCoupon();
 *
 * const handleSubmit = (data: CouponCreatePayload) => {
 *     createCoupon(data, {
 *         onSuccess: () => {
 *             toast.success('Coupon created');
 *             navigate('/coupons');
 *         },
 *     });
 * };
 * ```
 */

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { couponKeys } from "./coupons.keys";
import { couponsApi } from "./coupons.api";
import type { ApiError } from "@/shared/api";
import type {
    Coupon,
    CouponCreatePayload,
    CouponUpdatePayload,
    CouponValidatePayload,
    CouponValidateResponse,
    CouponChangeStatusPayload,
} from "../types";

// ============================================================================
// Create Mutation
// ============================================================================

/**
 * Hook to create a new coupon
 *
 * @example
 * ```tsx
 * const { mutate, mutateAsync, isPending, error } = useCreateCoupon();
 *
 * const handleSubmit = async (data: CouponCreatePayload) => {
 *     try {
 *         const coupon = await mutateAsync(data);
 *         toast.success('Coupon created successfully');
 *     } catch (error) {
 *         // Error toast shown automatically by global handler
 *     }
 * };
 * ```
 */
export function useCreateCoupon() {
    const queryClient = useQueryClient();

    return useMutation<Coupon, ApiError, CouponCreatePayload>({
        mutationFn: couponsApi.create,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: couponKeys.all });
        },
    });
}

// ============================================================================
// Update Mutation
// ============================================================================

/**
 * Hook to update an existing coupon
 *
 * @example
 * ```tsx
 * const { mutate, isPending } = useUpdateCoupon();
 *
 * const handleUpdate = (data: CouponUpdatePayload) => {
 *     mutate(
 *         { id: couponId, data },
 *         {
 *             onSuccess: () => {
 *                 toast.success('Coupon updated');
 *             },
 *         }
 *     );
 * };
 * ```
 */
export function useUpdateCoupon() {
    const queryClient = useQueryClient();

    return useMutation<
        Coupon,
        ApiError,
        { id: string; data: CouponUpdatePayload }
    >({
        mutationFn: ({ id, data }) => couponsApi.update(id, data),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: couponKeys.lists() });
            queryClient.invalidateQueries({
                queryKey: couponKeys.detail(variables.id),
            });
        },
    });
}

// ============================================================================
// Delete Mutation
// ============================================================================

/**
 * Hook to delete a coupon
 *
 * @example
 * ```tsx
 * const { mutate, isPending } = useDeleteCoupon();
 *
 * const handleDelete = () => {
 *     if (confirm('Are you sure?')) {
 *         mutate(couponId, {
 *             onSuccess: () => {
 *                 toast.success('Coupon deleted');
 *                 navigate('/coupons');
 *             },
 *         });
 *     }
 * };
 * ```
 */
export function useDeleteCoupon() {
    const queryClient = useQueryClient();

    return useMutation<void, ApiError, string>({
        mutationFn: (id) => couponsApi.delete(id),
        onSuccess: (_, id) => {
            queryClient.invalidateQueries({ queryKey: couponKeys.all });
            queryClient.removeQueries({ queryKey: couponKeys.detail(id) });
        },
    });
}

// ============================================================================
// Validate Mutation
// ============================================================================

/**
 * Hook to validate a coupon code
 *
 * @example
 * ```tsx
 * const { mutate, isPending } = useValidateCoupon();
 *
 * const handleValidate = (code: string) => {
 *     mutate({ code, level_id: '1', amount: 500, student_id: '1' }, {
 *         onSuccess: (result) => {
 *             if (result.valid) {
 *                 toast.success('Coupon is valid');
 *             } else {
 *                 toast.error(result.message);
 *             }
 *         },
 *     });
 * };
 * ```
 */
export function useValidateCoupon() {
    return useMutation<CouponValidateResponse, ApiError, CouponValidatePayload>(
        {
            mutationFn: couponsApi.validate,
        }
    );
}

// ============================================================================
// Change Status Mutation
// ============================================================================

/**
 * Hook to change coupon status (activate/deactivate)
 *
 * @example
 * ```tsx
 * const { mutate, isPending } = useChangeCouponStatus();
 *
 * const handleActivate = () => {
 *     mutate({ id: couponId, data: { status: 'active' } }, {
 *         onSuccess: () => {
 *             toast.success('Coupon activated');
 *         },
 *     });
 * };
 * ```
 */
export function useChangeCouponStatus() {
    const queryClient = useQueryClient();

    return useMutation<
        Coupon,
        ApiError,
        { id: string; data: CouponChangeStatusPayload }
    >({
        mutationFn: ({ id, data }) => couponsApi.changeStatus(id, data),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: couponKeys.lists() });
            queryClient.invalidateQueries({
                queryKey: couponKeys.detail(variables.id),
            });
        },
    });
}
