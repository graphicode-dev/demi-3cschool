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
import {
    InvoiceItem,
    InvoiceStats,
    InvoiceListParams,
    InvoiceCreatePayload,
    InvoiceUpdatePayload,
    PaginatedInvoiceData,
} from "../types";
import { ApiResponse } from "@/shared/api";
import { USE_MOCK_API } from "../../../api.config";
import { mockInvoiceStats, mockPaginatedInvoices, mockInvoiceItem } from "./mock";

const BASE_URL = "/invoices";

/**
 * Invoices API functions
 */
export const invoicesApi = {
    /**
     * Get invoices statistics
     */
    getStats: async (signal?: AbortSignal): Promise<InvoiceStats> => {
        if (USE_MOCK_API) {
            return new Promise((resolve) => setTimeout(() => resolve(mockInvoiceStats), 500));
        }

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
        if (USE_MOCK_API) {
            return new Promise((resolve) => setTimeout(() => resolve(mockPaginatedInvoices), 500));
        }

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
        if (USE_MOCK_API) {
            const mock = mockPaginatedInvoices.items.find(i => i.id === id) || mockInvoiceItem;
            return new Promise((resolve) => setTimeout(() => resolve({ ...mock }), 500));
        }

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
        if (USE_MOCK_API) {
            const newInvoice: InvoiceItem = {
                ...mockInvoiceItem,
                id: "INV-" + Math.floor(Math.random() * 10000),
                studentName: payload.studentName,
                programType: payload.programType,
                courseName: payload.courseName,
                courseLevel: payload.courseLevel,
                groupType: payload.groupType,
                total: payload.total,
                installments: payload.installments,
                status: payload.status || "unpaid",
                createdAt: new Date().toISOString()
            };
            return new Promise((resolve) => setTimeout(() => resolve(newInvoice), 500));
        }

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
        if (USE_MOCK_API) {
            const mock = mockPaginatedInvoices.items.find(i => i.id === id) || mockInvoiceItem;
            const updated = { ...mock, ...payload };
            return new Promise((resolve) => setTimeout(() => resolve(updated as InvoiceItem), 500));
        }

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
        if (USE_MOCK_API) {
            return new Promise((resolve) => setTimeout(resolve, 500));
        }

        const response = await api.delete(`${BASE_URL}/${id}`);

        if (response.error) {
            throw response.error;
        }
    },
};

export default invoicesApi;
