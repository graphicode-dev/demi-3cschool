/**
 * Payments Feature - Mutation Hooks
 *
 * TanStack Query mutation hooks for creating and updating payments.
 */

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { paymentKeys } from "./payments.keys";
import { paymentsApi } from "./payments.api";
import { levelSubscriptionKeys } from "./levelSubscriptions.keys";
import type {
    Payment,
    PaymentSubmitPayload,
    PaymentChangeStatusPayload,
} from "../types";
import { ApiError } from "@/shared/api";

/**
 * Hook to submit a payment for an installment
 *
 * @returns Mutation for submitting a payment
 */
export function useSubmitPayment() {
    const queryClient = useQueryClient();

    return useMutation<
        Payment,
        ApiError,
        { installmentId: string | number; payload: PaymentSubmitPayload }
    >({
        mutationFn: ({ installmentId, payload }) =>
            paymentsApi.submit(installmentId, payload),
        onSuccess: () => {
            // Invalidate all payment lists
            queryClient.invalidateQueries({
                queryKey: paymentKeys.lists(),
            });
            // Also invalidate subscriptions as payment may affect status
            queryClient.invalidateQueries({
                queryKey: levelSubscriptionKeys.all,
            });
        },
    });
}

/**
 * Hook to change payment status (approve/reject)
 *
 * @returns Mutation for changing payment status
 */
export function useChangePaymentStatus() {
    const queryClient = useQueryClient();

    return useMutation<
        Payment,
        ApiError,
        { paymentId: string | number; payload: PaymentChangeStatusPayload }
    >({
        mutationFn: ({ paymentId, payload }) =>
            paymentsApi.changeStatus(paymentId, payload),
        onSuccess: (data, variables) => {
            // Update the specific payment in cache
            queryClient.setQueryData(
                paymentKeys.detail(variables.paymentId),
                data
            );
            // Invalidate lists to reflect status change
            queryClient.invalidateQueries({
                queryKey: paymentKeys.lists(),
            });
            // Also invalidate subscriptions
            queryClient.invalidateQueries({
                queryKey: levelSubscriptionKeys.all,
            });
        },
    });
}
