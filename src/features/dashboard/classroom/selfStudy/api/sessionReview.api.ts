/**
 * Session Review API Functions
 *
 * API functions for content and teacher reviews in group sessions
 */

import { api } from "@/shared/api/client";
import { ApiResponse } from "@/shared/api";
import type {
    SessionReview,
    SessionReviewPayload,
} from "../types/review.types";

const BASE_URL = "/group-sessions";

/**
 * Session Review API functions
 */
export const sessionReviewApi = {
    /**
     * Get content review for a session
     * GET /group-sessions/:sessionId/reviews/content
     */
    getContentReview: async (
        sessionId: number | string,
        signal?: AbortSignal
    ): Promise<SessionReview | null> => {
        const response = await api.get<ApiResponse<SessionReview>>(
            `${BASE_URL}/${sessionId}/reviews/content`,
            { signal }
        );

        if (response.error) {
            // If 404, return null (no review exists yet)
            if (response.error.message?.includes("404")) {
                return null;
            }
            throw response.error;
        }

        return response.data?.data ?? null;
    },

    /**
     * Create/Update content review for a session
     * POST /group-sessions/:sessionId/reviews/content
     */
    createContentReview: async (
        sessionId: number | string,
        payload: SessionReviewPayload
    ): Promise<SessionReview> => {
        const response = await api.post<ApiResponse<SessionReview>>(
            `${BASE_URL}/${sessionId}/reviews/content`,
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
     * Get teacher review for a session
     * GET /group-sessions/:sessionId/reviews/teacher
     */
    getTeacherReview: async (
        sessionId: number | string,
        signal?: AbortSignal
    ): Promise<SessionReview | null> => {
        const response = await api.get<ApiResponse<SessionReview>>(
            `${BASE_URL}/${sessionId}/reviews/teacher`,
            { signal }
        );

        if (response.error) {
            // If 404, return null (no review exists yet)
            if (response.error.message?.includes("404")) {
                return null;
            }
            throw response.error;
        }

        return response.data?.data ?? null;
    },

    /**
     * Create/Update teacher review for a session
     * POST /group-sessions/:sessionId/reviews/teacher
     */
    createTeacherReview: async (
        sessionId: number | string,
        payload: SessionReviewPayload
    ): Promise<SessionReview> => {
        const response = await api.post<ApiResponse<SessionReview>>(
            `${BASE_URL}/${sessionId}/reviews/teacher`,
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

export default sessionReviewApi;
