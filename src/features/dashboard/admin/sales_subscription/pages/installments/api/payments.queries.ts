/**
 * Payments Feature - Query Hooks
 *
 * TanStack Query hooks for reading payment data.
 */

import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { paymentKeys, installmentKeys } from "./payments.keys";
import { paymentsApi, installmentsApi } from "./payments.api";
import type { PaymentListParams, InstallmentListParams } from "../types";

/**
 * Hook to fetch list of payments
 *
 * @param params - Optional filter/pagination params
 * @returns Query result with payment data
 */
export function usePaymentsList(params?: PaymentListParams) {
    return useQuery({
        queryKey: paymentKeys.list(params),
        queryFn: ({ signal }) => paymentsApi.getList(params, signal),
        placeholderData: keepPreviousData,
        staleTime: 1000 * 60 * 2, // 2 minutes
    });
}

/**
 * Hook to fetch a single payment by ID
 *
 * @param id - Payment ID
 * @returns Query result with payment data
 */
export function usePayment(id: string | number | undefined) {
    return useQuery({
        queryKey: paymentKeys.detail(id!),
        queryFn: ({ signal }) => paymentsApi.getById(id!, signal),
        enabled: !!id,
        staleTime: 1000 * 60 * 5, // 5 minutes
    });
}

/**
 * Hook to fetch payment history for an installment
 *
 * @param installmentId - Installment ID
 * @returns Query result with payment history data
 */
export function usePaymentHistory(installmentId: string | number | undefined) {
    return useQuery({
        queryKey: paymentKeys.history(installmentId!),
        queryFn: ({ signal }) =>
            paymentsApi.getHistoryByInstallment(installmentId!, signal),
        enabled: !!installmentId,
        staleTime: 1000 * 60 * 2, // 2 minutes
    });
}

/**
 * Hook to fetch list of installments
 *
 * @param params - Optional filter/pagination params
 * @returns Query result with installment data
 */
export function useInstallmentsList(params?: InstallmentListParams) {
    return useQuery({
        queryKey: installmentKeys.list(params),
        queryFn: ({ signal }) => installmentsApi.getList(params, signal),
        placeholderData: keepPreviousData,
        staleTime: 1000 * 60 * 2, // 2 minutes
    });
}

/**
 * Hook to fetch a single installment by ID
 *
 * @param id - Installment ID
 * @returns Query result with installment data
 */
export function useInstallment(id: string) {
    return useQuery({
        queryKey: installmentKeys.detail(id!),
        queryFn: ({ signal }) => installmentsApi.getById(id!, signal),
        enabled: !!id,
        staleTime: 1000 * 60 * 5, // 5 minutes
    });
}
