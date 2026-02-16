/**
 * Level Quizzes Feature - API Functions
 *
 * Raw API functions for level quizzes domain.
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

const BASE_URL = "/level-quizzes";

/**
 * Level Quizzes API functions
 */
export const acceptanceExamApi = {
    /**
     * Get level quizzes metadata (filters, operators, field types)
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
     * Get list of level quizzes by level ID
     */
    getByLevelId: async (
        levelId: string,
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
        >(`${BASE_URL}/${levelId}/quizzes`, {
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
     * Get single level quiz by ID
     */
    getById: async (id: string, signal?: AbortSignal): Promise<AcceptanceExam> => {
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
     * Create a new level quiz
     */
    create: async (payload: AcceptanceExamCreatePayload): Promise<AcceptanceExam> => {
        const response = await api.post<ApiResponse<AcceptanceExam>>(BASE_URL, {
            levelId: payload.levelId,
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
     * Update an existing level quiz
     */
    update: async (
        id: string,
        payload: AcceptanceExamUpdatePayload
    ): Promise<AcceptanceExam> => {
        const response = await api.patch<ApiResponse<AcceptanceExam>>(
            `${BASE_URL}/${id}`,
            {
                levelId: payload.levelId,
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
     * Delete a level quiz
     */
    delete: async (id: string): Promise<void> => {
        const response = await api.delete(`${BASE_URL}/${id}`);

        if (response.error) {
            throw response.error;
        }
    },
};

export default acceptanceExamApi;
