/**
 * Invoices Feature - API Functions
 *
 * Raw API functions for invoices domain.
 * These are pure functions that make HTTP requests.
 * They are used by query and mutation hooks.
 *
 * @example
 * ```ts
 * // In a query hook
 * const { data } = useQuery({
 *     queryKey: invoiceKeys.list(params),
 *     queryFn: ({ signal }) => invoicesApi.getList(params, signal),
 * });
 * ```
 */

import { api } from "@/shared/api/client";
import type {
    InvoiceItem,
    InvoiceStats,
    InvoiceListParams,
    InvoiceCreatePayload,
    InvoiceUpdatePayload,
    PaginatedInvoiceData,
} from "../types";
import { ApiResponse } from "@/shared/api";

const BASE_URL = "/invoices";

/**
 * Invoices API functions
 */
export const invoicesApi = {
    /**
     * Get invoices statistics
     */
    getStats: async (signal?: AbortSignal): Promise<InvoiceStats> => {
        const response = await api.get<ApiResponse<InvoiceStats>>(
            `${BASE_URL}/stats`,
            { signal }
        );

        if (response.error) {
            throw response.error;
        }

        if (!response.data?.data) {
            throw new Error("No data returned from server");
        }

        return response.data.data;
    },

    /**
     * Get list of all invoices (paginated)
     */
    getList: async (
        params?: InvoiceListParams,
        signal?: AbortSignal
    ): Promise<PaginatedInvoiceData> => {
        const response = await api.get<ApiResponse<PaginatedInvoiceData>>(
            BASE_URL,
            {
                params: params as Record<string, unknown>,
                signal,
            }
        );

        if (response.error) {
            throw response.error;
        }

        if (!response.data?.data) {
            throw new Error("No data returned from server");
        }

        return response.data.data;
    },

    /**
     * Get single invoice by ID
     */
    getById: async (id: string, signal?: AbortSignal): Promise<InvoiceItem> => {
        const response = await api.get<ApiResponse<InvoiceItem>>(
            `${BASE_URL}/${id}`,
            { signal }
        );

        if (response.error) {
            throw response.error;
        }

        if (!response.data?.data) {
            throw new Error("No data returned from server");
        }

        return response.data.data;
    },

    /**
     * Create a new invoice
     */
    create: async (payload: InvoiceCreatePayload): Promise<InvoiceItem> => {
        const response = await api.post<ApiResponse<InvoiceItem>>(
            BASE_URL,
            payload
        );

        if (response.error) {
            throw response.error;
        }

        if (!response.data?.data) {
            throw new Error("No data returned from server");
        }

        return response.data.data;
    },

    /**
     * Update an existing invoice
     */
    update: async (
        id: string,
        payload: InvoiceUpdatePayload
    ): Promise<InvoiceItem> => {
        const response = await api.patch<ApiResponse<InvoiceItem>>(
            `${BASE_URL}/${id}`,
            payload
        );

        if (response.error) {
            throw response.error;
        }

        if (!response.data?.data) {
            throw new Error("No data returned from server");
        }

        return response.data.data;
    },

    /**
     * Delete an invoice
     */
    delete: async (id: string): Promise<void> => {
        const response = await api.delete(`${BASE_URL}/${id}`);

        if (response.error) {
            throw response.error;
        }
    },
};

export default invoicesApi;
