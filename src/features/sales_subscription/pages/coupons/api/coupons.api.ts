/**
 * Coupons Feature - API Functions
 *
 * Raw API functions for coupons domain.
 * These are pure functions that make HTTP requests.
 * They are used by query and mutation hooks.
 *
 * @example
 * ```ts
 * // In a query hook
 * const { data } = useQuery({
 *     queryKey: couponKeys.list(params),
 *     queryFn: ({ signal }) => couponsApi.getList(params, signal),
 * });
 * ```
 */

import { api } from "@/shared/api/client";
import type {
    Coupon,
    CouponsListParams,
    CouponCreatePayload,
    CouponUpdatePayload,
    CouponValidatePayload,
    CouponValidateResponse,
    CouponChangeStatusPayload,
    GenerateCodeResponse,
    CouponUsage,
} from "../types";
import { ApiResponse } from "@/shared/api";

const BASE_URL = "/coupons";

/**
 * Coupons API functions
 */
export const couponsApi = {
    /**
     * Get list of all coupons
     */
    getList: async (
        params?: CouponsListParams,
        signal?: AbortSignal
    ): Promise<Coupon[]> => {
        const response = await api.get<ApiResponse<Coupon[]>>(BASE_URL, {
            params: params as Record<string, unknown>,
            signal,
        });

        if (response.error) {
            throw response.error;
        }

        if (!response.data?.data) {
            throw new Error("No data returned from server");
        }

        return response.data.data;
    },

    /**
     * Get single coupon by ID
     */
    getById: async (id: string, signal?: AbortSignal): Promise<Coupon> => {
        const response = await api.get<ApiResponse<Coupon>>(
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
     * Get list of coupon usages
     */
    getUsages: async (
        couponId: string | number,
        signal?: AbortSignal
    ): Promise<CouponUsage[]> => {
        const response = await api.get<ApiResponse<CouponUsage[]>>(
            `${BASE_URL}/${couponId}/usages`,
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
     * Create a new coupon
     */
    create: async (payload: CouponCreatePayload): Promise<Coupon> => {
        const response = await api.post<ApiResponse<Coupon>>(BASE_URL, payload);

        if (response.error) {
            // Throw the full error object to preserve field-level errors
            throw response.error;
        }

        if (!response.data?.data) {
            throw new Error("No data returned from server");
        }

        return response.data.data;
    },

    /**
     * Update an existing coupon
     */
    update: async (
        id: string,
        payload: CouponUpdatePayload
    ): Promise<Coupon> => {
        const response = await api.patch<ApiResponse<Coupon>>(
            `${BASE_URL}/${id}`,
            payload
        );

        if (response.error) {
            // Throw the full error object to preserve field-level errors
            throw response.error;
        }

        if (!response.data?.data) {
            throw new Error("No data returned from server");
        }

        return response.data.data;
    },

    /**
     * Delete a coupon
     */
    delete: async (id: string): Promise<void> => {
        const response = await api.delete(`${BASE_URL}/${id}`);

        if (response.error) {
            throw response.error;
        }
    },

    /**
     * Generate a unique coupon code
     */
    generateCode: async (
        signal?: AbortSignal
    ): Promise<GenerateCodeResponse> => {
        const response = await api.get<ApiResponse<GenerateCodeResponse>>(
            `${BASE_URL}/generate-code`,
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
     * Validate a coupon code
     */
    validate: async (
        payload: CouponValidatePayload
    ): Promise<CouponValidateResponse> => {
        const response = await api.post<ApiResponse<CouponValidateResponse>>(
            `${BASE_URL}/validate`,
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
     * Change coupon status (activate/deactivate)
     */
    changeStatus: async (
        id: string,
        payload: CouponChangeStatusPayload
    ): Promise<Coupon> => {
        const response = await api.patch<ApiResponse<Coupon>>(
            `${BASE_URL}/${id}/activate`,
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
};

export default couponsApi;
