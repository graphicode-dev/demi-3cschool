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
 *     queryKey: levelQuizKeys.list(params),
 *     queryFn: ({ signal }) => levelQuizzesApi.getList(params, signal),
 * });
 * ```
 */

import { api } from "@/shared/api/client";
import { ApiResponse } from "@/shared/api";
import {
    LevelQuizCreatePayload,
    LevelQuizUpdatePayload,
    LevelQuizzesListParams,
    LevelQuizzesMetadata,
} from "../../types/level-quizzes.types";
import { LevelQuiz } from "../../types";
import { PaginatedData } from "@/features/sales_subscription";

const BASE_URL = "/level-quizzes";

/**
 * Level Quizzes API functions
 */
export const levelQuizzesApi = {
    /**
     * Get level quizzes metadata (filters, operators, field types)
     */
    getMetadata: async (
        signal?: AbortSignal
    ): Promise<LevelQuizzesMetadata> => {
        const response = await api.get<ApiResponse<LevelQuizzesMetadata>>(
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
     * Get list of all level quizzes
     */
    getList: async (
        params?: LevelQuizzesListParams,
        signal?: AbortSignal
    ): Promise<PaginatedData<LevelQuiz>> => {
        const response = await api.get<ApiResponse<LevelQuiz[]>>(BASE_URL, {
            params: params as Record<string, unknown> | undefined,
            signal,
        });

        if (response.error) {
            throw response.error;
        }

        const items = response.data!.data!;
        return {
            items,
            perPage: items.length,
            currentPage: 1,
            lastPage: 1,
            nextPageUrl: null,
        };
    },

    /**
     * Get single level quiz by ID
     */
    getById: async (id: string, signal?: AbortSignal): Promise<LevelQuiz> => {
        const response = await api.get<ApiResponse<LevelQuiz>>(
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
    create: async (payload: LevelQuizCreatePayload): Promise<LevelQuiz[]> => {
        const response = await api.post<ApiResponse<LevelQuiz[]>>(BASE_URL, {
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
        payload: LevelQuizUpdatePayload
    ): Promise<LevelQuiz> => {
        const response = await api.patch<ApiResponse<LevelQuiz>>(
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

export default levelQuizzesApi;
