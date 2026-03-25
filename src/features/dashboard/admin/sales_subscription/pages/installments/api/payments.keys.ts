/**
 * Payments Feature - Query Keys
 *
 * Stable query key factory for TanStack Query.
 * Keys are hierarchical for easy invalidation.
 */

import type { PaymentListParams, InstallmentListParams } from "../types";

/**
 * Query key factory for payments
 */
export const paymentKeys = {
    /**
     * Root key for all payment queries
     */
    all: ["payments"] as const,

    /**
     * Key for all list queries
     */
    lists: () => [...paymentKeys.all, "list"] as const,

    /**
     * Key for specific list with params
     */
    list: (params?: PaymentListParams) =>
        params
            ? ([...paymentKeys.lists(), params] as const)
            : paymentKeys.lists(),

    /**
     * Key for all detail queries
     */
    details: () => [...paymentKeys.all, "detail"] as const,

    /**
     * Key for specific payment detail
     */
    detail: (id: string | number) =>
        [...paymentKeys.details(), String(id)] as const,

    /**
     * Key for all installment history queries
     */
    histories: () => [...paymentKeys.all, "history"] as const,

    /**
     * Key for specific installment payment history
     */
    history: (installmentId: string | number) =>
        [...paymentKeys.histories(), String(installmentId)] as const,
};

/**
 * Type for payment query keys
 */
export type PaymentQueryKey =
    | typeof paymentKeys.all
    | ReturnType<typeof paymentKeys.lists>
    | ReturnType<typeof paymentKeys.list>
    | ReturnType<typeof paymentKeys.details>
    | ReturnType<typeof paymentKeys.detail>
    | ReturnType<typeof paymentKeys.histories>
    | ReturnType<typeof paymentKeys.history>;

/**
 * Query key factory for installments
 */
export const installmentKeys = {
    /**
     * Root key for all installment queries
     */
    all: ["installments"] as const,

    /**
     * Key for all list queries
     */
    lists: () => [...installmentKeys.all, "list"] as const,

    /**
     * Key for specific list with params
     */
    list: (params?: InstallmentListParams) =>
        params
            ? ([...installmentKeys.lists(), params] as const)
            : installmentKeys.lists(),

    /**
     * Key for all detail queries
     */
    details: () => [...installmentKeys.all, "detail"] as const,

    /**
     * Key for specific installment detail
     */
    detail: (id: string | number) =>
        [...installmentKeys.details(), String(id)] as const,
};

/**
 * Type for installment query keys
 */
export type InstallmentQueryKey =
    | typeof installmentKeys.all
    | ReturnType<typeof installmentKeys.lists>
    | ReturnType<typeof installmentKeys.list>
    | ReturnType<typeof installmentKeys.details>
    | ReturnType<typeof installmentKeys.detail>;
