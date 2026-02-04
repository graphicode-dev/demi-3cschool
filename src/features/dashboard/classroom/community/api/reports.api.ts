/**
 * Reports API Functions
 *
 * Raw API functions for reports domain.
 */

import { api } from "@/shared/api/client";
import type { ApiResponse, PaginatedData } from "@/shared/api";
import type {
    Report,
    ReportsListParams,
    ReportCreatePayload,
    ReportReviewPayload,
} from "./community.types";

const POSTS_BASE_URL = "/community/posts";
const REPORTS_BASE_URL = "/community/reports";

export const reportsApi = {
    /**
     * Report a post
     */
    create: async (
        postId: number,
        payload: ReportCreatePayload
    ): Promise<Report> => {
        const response = await api.post<ApiResponse<Report>>(
            `${POSTS_BASE_URL}/${postId}/report`,
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
     * Get reports for a post (Admin)
     */
    getByPost: async (
        postId: number,
        signal?: AbortSignal
    ): Promise<Report[]> => {
        const response = await api.get<ApiResponse<Report[]>>(
            `${POSTS_BASE_URL}/${postId}/reports`,
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
     * List all reports (Admin)
     */
    getList: async (
        params?: ReportsListParams,
        signal?: AbortSignal
    ): Promise<PaginatedData<Report>> => {
        const response = await api.get<ApiResponse<PaginatedData<Report>>>(
            REPORTS_BASE_URL,
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
     * Review a report (Admin)
     */
    review: async (
        id: number,
        payload: ReportReviewPayload
    ): Promise<Report> => {
        const response = await api.patch<ApiResponse<Report>>(
            `${REPORTS_BASE_URL}/${id}/review`,
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

export default reportsApi;
