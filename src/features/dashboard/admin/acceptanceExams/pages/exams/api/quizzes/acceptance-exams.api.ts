/**
 * Acceptance Exams Feature - API Functions
 *
 * Raw API functions for acceptance exams domain.
 * These are pure functions that make HTTP requests.
 * They are used by query and mutation hooks.
 *
 * @example
 * ```ts
 * // In a query hook
 * const { data } = useQuery({
 *     queryKey: acceptanceExamKeys.list(params),
 *     queryFn: ({ signal }) => acceptanceExamApi.getList(params, signal),
 * });
 * ```
 */

import { api } from "@/shared/api/client";
import { ApiResponse } from "@/shared/api";
import {
    AcceptanceExamCreatePayload,
    AcceptanceExamUpdatePayload,
    AcceptanceExamsListParams,
    AcceptanceExamsMetadata,
} from "../../../../types/acceptance-exams.types";
import { AcceptanceExam } from "../../../../types";
import { PaginatedData } from "@/shared/api";

const BASE_URL = "/acceptance-exams";

/**
 * Acceptance Exams API functions
 */
export const acceptanceExamApi = {
    /**
     * Get acceptance exams metadata (filters, operators, field types)
     */
    getMetadata: async (
        signal?: AbortSignal
    ): Promise<AcceptanceExamsMetadata> => {
        const response = await api.get<ApiResponse<AcceptanceExamsMetadata>>(
            `${BASE_URL}/metadata`,
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
     * Get list of acceptance exams
     */
    getList: async (
        params?: AcceptanceExamsListParams,
        signal?: AbortSignal
    ): Promise<PaginatedData<AcceptanceExam>> => {
        const response = await api.get<
            ApiResponse<{
                currentPage: number;
                perPage: number;
                lastPage: number;
                nextPageUrl: string | null;
                items: AcceptanceExam[];
            }>
        >(BASE_URL, {
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
            currentPage: apiData.currentPage,
            perPage: apiData.perPage,
            lastPage: apiData.lastPage,
            nextPageUrl: apiData.nextPageUrl,
        };
    },

    /**
     * Get single acceptance exam by ID
     */
    getById: async (
        id: string,
        signal?: AbortSignal
    ): Promise<AcceptanceExam> => {
        const response = await api.get<ApiResponse<AcceptanceExam>>(
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
     * Create a new acceptance exam
     */
    create: async (
        payload: AcceptanceExamCreatePayload
    ): Promise<AcceptanceExam> => {
        const response = await api.post<ApiResponse<AcceptanceExam>>(BASE_URL, {
            gradeId: payload.gradeId,
            title: payload.title,
            description: payload.description,
            timeLimit: payload.timeLimit,
            passingScore: payload.passingScore,
            maxAttempts: payload.maxAttempts,
            shuffleQuestions: payload.shuffleQuestions,
            showAnswers: payload.showAnswers,
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
     * Update an existing acceptance exam
     */
    update: async (
        id: string,
        payload: AcceptanceExamUpdatePayload
    ): Promise<AcceptanceExam> => {
        const response = await api.patch<ApiResponse<AcceptanceExam>>(
            `${BASE_URL}/${id}`,
            {
                gradeId: payload.gradeId,
                title: payload.title,
                description: payload.description,
                timeLimit: payload.timeLimit,
                passingScore: payload.passingScore,
                maxAttempts: payload.maxAttempts,
                shuffleQuestions: payload.shuffleQuestions,
                showAnswers: payload.showAnswers,
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
     * Delete an acceptance exam
     */
    delete: async (id: string): Promise<void> => {
        const response = await api.delete(`${BASE_URL}/${id}`);

        if (response.error) {
            throw response.error;
        }
    },
};

export default acceptanceExamApi;
