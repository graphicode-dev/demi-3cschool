/**
 * Invoices Feature - Query Keys
 *
 * Stable query key factory for TanStack Query.
 * Keys are hierarchical for easy invalidation.
 *
 * @example
 * ```ts
 * // Invalidate all invoices data
 * queryClient.invalidateQueries({ queryKey: invoiceKeys.all });
 *
 * // Invalidate only lists (keeps detail cache)
 * queryClient.invalidateQueries({ queryKey: invoiceKeys.lists() });
 *
 * // Invalidate specific invoice
 * queryClient.invalidateQueries({ queryKey: invoiceKeys.detail(invoiceId) });
 * ```
 */

import type { InvoiceListParams } from "../types";

/**
 * Query key factory for invoices
 *
 * Hierarchy:
 * - all: ['invoices']
 * - stats: ['invoices', 'stats']
 * - lists: ['invoices', 'list']
 * - list(params): ['invoices', 'list', params]
 * - details: ['invoices', 'detail']
 * - detail(id): ['invoices', 'detail', id]
 */
export const invoiceKeys = {
    /**
     * Root key for all invoice queries
     */
    all: ["invoices"] as const,

    /**
     * Key for stats query
     */
    stats: () => [...invoiceKeys.all, "stats"] as const,

    /**
     * Key for all list queries
     */
    lists: () => [...invoiceKeys.all, "list"] as const,

    /**
     * Key for specific list with params
     */
    list: (params?: InvoiceListParams) =>
        params
            ? ([...invoiceKeys.lists(), params] as const)
            : invoiceKeys.lists(),

    /**
     * Key for all detail queries
     */
    details: () => [...invoiceKeys.all, "detail"] as const,

    /**
     * Key for specific invoice detail
     */
    detail: (id: string) => [...invoiceKeys.details(), id] as const,
};

/**
 * Type for invoice query keys
 */
export type InvoiceQueryKey =
    | typeof invoiceKeys.all
    | ReturnType<typeof invoiceKeys.stats>
    | ReturnType<typeof invoiceKeys.lists>
    | ReturnType<typeof invoiceKeys.list>
    | ReturnType<typeof invoiceKeys.details>
    | ReturnType<typeof invoiceKeys.detail>;
