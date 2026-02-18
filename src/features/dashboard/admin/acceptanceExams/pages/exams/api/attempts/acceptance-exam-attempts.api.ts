/**
 * Acceptance Exam Attempts Feature - API Functions
 */

import { api } from "@/shared/api/client";
import { ApiResponse } from "@/shared/api";
import {
    AcceptanceExamAttempt,
    AcceptanceExamAttemptAnswerPayload,
    AcceptanceExamAttemptsListParams,
} from "../../../../types/acceptance-exam-attempts.types";
import { PaginatedData } from "@/shared/api";

const BASE_URL = "/acceptance-exam-attempts";

/**
 * Acceptance Exam Attempts API functions
 */
export const acceptanceExamAttemptsApi = {
    /**
     * Get current user's attempts
     */
    getMyAttempts: async (
        signal?: AbortSignal
    ): Promise<AcceptanceExamAttempt[]> => {
        const response = await api.get<ApiResponse<AcceptanceExamAttempt[]>>(
            `${BASE_URL}/my-attempts`,
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
     * Get attempt history for an exam
     */
    getExamHistory: async (
        examId: string,
        params?: AcceptanceExamAttemptsListParams,
        signal?: AbortSignal
    ): Promise<PaginatedData<AcceptanceExamAttempt>> => {
        const response = await api.get<
            ApiResponse<{
                perPage: number;
                currentPage: number;
                lastPage: number;
                nextPageUrl: string | null;
                items: AcceptanceExamAttempt[];
            }>
        >(`${BASE_URL}/exam/${examId}/history`, {
            params: params as Record<string, unknown> | undefined,
            signal,
        });

        if (response.error) {
            throw response.error;
        }

        if (!response.data?.data) {
            throw new Error("No data returned from server");
        }

        const apiData = response.data.data;
        return {
            items: apiData.items,
            perPage: apiData.perPage,
            currentPage: apiData.currentPage,
            lastPage: apiData.lastPage,
            nextPageUrl: apiData.nextPageUrl,
        };
    },

    /**
     * Start an attempt for an exam
     */
    start: async (examId: string): Promise<AcceptanceExamAttempt> => {
        const response = await api.post<ApiResponse<AcceptanceExamAttempt>>(
            `${BASE_URL}/start/${examId}`
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
     * Answer a question in an attempt
     */
    answer: async (
        attemptId: string,
        questionId: string,
        payload: AcceptanceExamAttemptAnswerPayload
    ): Promise<void> => {
        const response = await api.post(
            `${BASE_URL}/${attemptId}/answer/${questionId}`,
            payload
        );

        if (response.error) {
            throw response.error;
        }
    },

    /**
     * Complete an attempt
     */
    complete: async (attemptId: string): Promise<void> => {
        const response = await api.post(
            `${BASE_URL}/${attemptId}/complete`
        );

        if (response.error) {
            throw response.error;
        }
    },

    /**
     * Get attempt result
     */
    getResult: async (
        attemptId: string,
        signal?: AbortSignal
    ): Promise<AcceptanceExamAttempt> => {
        const response = await api.get<ApiResponse<AcceptanceExamAttempt>>(
            `${BASE_URL}/${attemptId}/result`,
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
};

export default acceptanceExamAttemptsApi;
