/**
 * Payments Feature - API Functions
 *
 * Raw API functions for payments domain.
 */

import { api } from "@/shared/api/client";
import {
    Payment,
    PaymentListParams,
    PaymentSubmitPayload,
    PaymentChangeStatusPayload,
    PaginatedPaymentData,
    Installment,
    InstallmentListParams,
} from "../types";
import { ApiResponse } from "@/shared/api";
import { USE_MOCK_API } from "../../../api.config";
import { mockPayment, mockInstallment, mockPaginatedPayments } from "./mock";

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
        if (USE_MOCK_API) {
            return new Promise((resolve) => setTimeout(() => resolve([...mockPaginatedPayments.items]), 500));
        }

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
        if (USE_MOCK_API) {
            const mock = mockPaginatedPayments.items.find(p => p.id === Number(id)) || mockPayment;
            return new Promise((resolve) => setTimeout(() => resolve({ ...mock }), 500));
        }

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
        if (USE_MOCK_API) {
            const newPayment: Payment = {
                ...mockPayment,
                id: Math.floor(Math.random() * 1000) + 10,
                installmentId: Number(installmentId),
                amount: payload.amount,
                paymentMethod: payload.paymentMethod,
                paymentMethodLabel: payload.paymentMethod.toUpperCase(),
                createdAt: new Date().toISOString()
            };
            return new Promise((resolve) => setTimeout(() => resolve(newPayment), 500));
        }

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
        if (USE_MOCK_API) {
            const history = mockPaginatedPayments.items.filter(p => p.installmentId === Number(installmentId));
            return new Promise((resolve) => setTimeout(() => resolve(history.length ? history : [mockPayment]), 500));
        }

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
        if (USE_MOCK_API) {
            const mock = mockPaginatedPayments.items.find(p => p.id === Number(paymentId)) || mockPayment;
            const updated = { ...mock, paymentStatus: payload.status, reviewNotes: payload.notes || "", rejectionReason: payload.rejectionReason || null } as Payment;
            return new Promise((resolve) => setTimeout(() => resolve(updated), 500));
        }

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
        if (USE_MOCK_API) {
            return new Promise((resolve) => setTimeout(() => resolve([mockInstallment]), 500));
        }

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
        if (USE_MOCK_API) {
            const mock = { ...mockInstallment, id: Number(id) };
            return new Promise((resolve) => setTimeout(() => resolve(mock), 500));
        }

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
