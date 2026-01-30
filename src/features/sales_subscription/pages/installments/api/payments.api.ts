/**
 * Payments Feature - API Functions
 *
 * Raw API functions for payments domain.
 */

import { api } from "@/shared/api/client";
import type {
    Payment,
    PaymentListParams,
    PaymentSubmitPayload,
    PaymentChangeStatusPayload,
    PaginatedPaymentData,
    Installment,
    InstallmentListParams,
} from "../types";
import { ApiResponse } from "@/shared/api";

const BASE_URL = "/subscriptions/payments";

/**
 * Payments API functions
 */
export const paymentsApi = {
    /**
     * Get list of all payments (paginated)
     */
    getList: async (
        params?: PaymentListParams,
        signal?: AbortSignal
    ): Promise<Payment[]> => {
        const response = await api.get<ApiResponse<Payment[]>>(
            "/subscriptions/installments",
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
     * Get single payment by ID
     */
    getById: async (
        id: string | number,
        signal?: AbortSignal
    ): Promise<Payment> => {
        const response = await api.get<ApiResponse<Payment>>(
            `/subscriptions/installments/${id}`,
            {
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
     * Submit a payment for an installment
     */
    submit: async (
        installmentId: string | number,
        payload: PaymentSubmitPayload
    ): Promise<Payment> => {
        const response = await api.post<ApiResponse<Payment>>(
            `/subscriptions/installments/${installmentId}/payments`,
            {
                amount: payload.amount,
                payment_method: payload.paymentMethod,
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
     * Get payment history for an installment
     */
    getHistoryByInstallment: async (
        installmentId: string | number,
        signal?: AbortSignal
    ): Promise<Payment[]> => {
        const response = await api.get<ApiResponse<Payment[]>>(
            `/subscriptions/installments/${installmentId}/payments`,
            {
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
     * Change payment status (approve/reject)
     */
    changeStatus: async (
        paymentId: string | number,
        payload: PaymentChangeStatusPayload
    ): Promise<Payment> => {
        const response = await api.patch<ApiResponse<Payment>>(
            `${BASE_URL}/${paymentId}/change-status`,
            {
                status: payload.status,
                notes: payload.notes,
                rejection_reason: payload.rejectionReason,
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
};

/**
 * Installments API functions
 */
export const installmentsApi = {
    /**
     * Get list of all installments
     */
    getList: async (
        params?: InstallmentListParams,
        signal?: AbortSignal
    ): Promise<Installment[]> => {
        const response = await api.get<ApiResponse<Installment[]>>(
            "/subscriptions/installments",
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
     * Get single installment by ID
     */
    getById: async (
        id: string | number,
        signal?: AbortSignal
    ): Promise<Installment> => {
        const response = await api.get<ApiResponse<Installment>>(
            `/subscriptions/installments/${id}`,
            {
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
};

export default paymentsApi;
