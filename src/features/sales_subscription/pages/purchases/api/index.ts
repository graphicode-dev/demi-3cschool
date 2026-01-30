/**
 * Invoices Feature - API Module
 *
 * Public exports for the invoices API layer.
 * Import from '@/features/sales_subscription/pages/purchases/api' or '@/features/sales_subscription/pages/purchases'.
 *
 * @example
 * ```ts
 * import {
 *     useInvoicesList,
 *     useInvoice,
 *     useDeleteInvoice,
 *     useInvoicesStats,
 *     invoiceKeys,
 * } from '@/features/sales_subscription/pages/purchases';
 * ```
 */

// Types
export type {
    InvoiceItem,
    InvoiceStats,
    InvoiceListParams,
    PaginatedInvoiceData,
    InvoiceCreatePayload,
    InvoiceUpdatePayload,
    PaymentStatus,
    ProgramType,
    GroupType,
    PaginatedData,
} from "../types";

// Query Keys
export { invoiceKeys, type InvoiceQueryKey } from "./invoices.keys";

// API Functions
export { invoicesApi } from "./invoices.api";

// Query Hooks
export {
    useInvoicesStats,
    useInvoicesList,
    useInvoice,
} from "./invoices.queries";

// Mutation Hooks
export {
    useCreateInvoice,
    useUpdateInvoice,
    useDeleteInvoice,
} from "./invoices.mutations";
