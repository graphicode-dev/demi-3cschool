/**
 * Invoices Feature - Query Hooks
 *
 * TanStack Query hooks for reading invoice data.
 * All queries support AbortSignal for cancellation.
 *
 * TODO: Remove mock data imports and uncomment real API calls when backend is ready.
 *
 * @example
 * ```tsx
 * // Get invoices stats
 * const { data: stats } = useInvoicesStats();
 *
 * // List all invoices with pagination
 * const { data, isLoading } = useInvoicesList({ page: 1 });
 *
 * // Get single invoice
 * const { data: invoice } = useInvoice(invoiceId);
 * ```
 */

import {
    useQuery,
    keepPreviousData,
    type UseQueryOptions,
} from "@tanstack/react-query";
import { invoiceKeys } from "./invoices.keys";
import type {
    InvoiceItem,
    InvoiceStats,
    InvoiceListParams,
    PaginatedInvoiceData,
} from "../types";
import invoicesApi from "./invoices.api";

// ============================================================================
// Stats Query
// ============================================================================

/**
 * Hook to fetch invoices statistics
 *
 * @param options - Additional query options
 *
 * @example
 * ```tsx
 * const { data: stats, isLoading } = useInvoicesStats();
 *
 * if (isLoading) return <Spinner />;
 *
 * return (
 *     <StatsRow
 *         totalInvoices={stats.totalInvoices}
 *         totalRevenue={stats.totalRevenue}
 *     />
 * );
 * ```
 */
export function useInvoicesStats(
    options?: Partial<UseQueryOptions<InvoiceStats, Error>>
) {
    return useQuery({
        queryKey: invoiceKeys.stats(),
        // TODO: Uncomment when using real API
        queryFn: ({ signal }) => invoicesApi.getStats(signal),
        staleTime: 1000 * 60 * 5, // 5 minutes
        ...options,
    });
}

// ============================================================================
// List Queries
// ============================================================================

/**
 * Hook to fetch list of all invoices (paginated)
 *
 * @param params - Query parameters for pagination and filtering
 * @param options - Additional query options
 *
 * @example
 * ```tsx
 * const { data } = useInvoicesList({ page: 1, search: 'Emma' });
 * ```
 */
export function useInvoicesList(
    params?: InvoiceListParams,
    options?: Partial<UseQueryOptions<PaginatedInvoiceData, Error>>
) {
    return useQuery({
        queryKey: invoiceKeys.list(params),
        // TODO: Uncomment when using real API
        queryFn: ({ signal }) => invoicesApi.getList(params, signal),
        placeholderData: keepPreviousData,
        staleTime: 1000 * 60 * 2, // 2 minutes
        ...options,
    });
}

// ============================================================================
// Detail Queries
// ============================================================================

/**
 * Hook to fetch single invoice by ID
 *
 * @param id - Invoice ID
 * @param options - Additional query options
 *
 * @example
 * ```tsx
 * const { data: invoice, isLoading, error } = useInvoice(invoiceId);
 *
 * if (isLoading) return <Spinner />;
 * if (error) return <ErrorMessage error={error} />;
 *
 * return (
 *     <div>
 *         <h1>{invoice.studentName}</h1>
 *         <p>Total: ${invoice.total}</p>
 *     </div>
 * );
 * ```
 */
export function useInvoice(
    id: string | undefined | null,
    options?: Partial<UseQueryOptions<InvoiceItem, Error>>
) {
    return useQuery({
        queryKey: invoiceKeys.detail(id ?? ""),
        // TODO: Uncomment when using real API
        // queryFn: ({ signal }) => invoicesApi.getById(id!, signal),
        queryFn: () => {
            // TODO: Replace with actual API call
            return Promise.reject(
                new Error("Invoice detail API not implemented")
            );
        },
        enabled: !!id,
        ...options,
    });
}
