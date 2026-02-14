/**
 * Lesson Quiz Attempts Feature - API Functions
 *
 * Raw API functions for lesson quiz attempts domain.
 * These are pure functions that make HTTP requests.
 * They are used by query and mutation hooks.
 *
 * @example
 * ```ts
 * // In a query hook
 * const { data } = useQuery({
 *     queryKey: lessonQuizAttemptKeys.list(params),
 *     queryFn: ({ signal }) => lessonQuizAttemptsApi.getList(params, signal),
 * });
 * ```
 */

import { api } from "@/shared/api/client";
import { ApiResponse, ListQueryParams } from "@/shared/api";
import {
    LessonQuizAttempt,
    LessonQuizAttemptsAnswer,
    LessonQuizAttemptsStore,
    LessonQuizAttemptsMetadata,
} from "../../types";
import { PaginatedData } from "@/shared/api";

const BASE_URL = "/lesson-quiz-attempts";

/**
 * Lesson Quiz Attempts API functions
 */
export const lessonQuizAttemptsApi = {
    /**
     * Get lesson quiz attempts metadata (filters, operators, field types)
     */
    getMetadata: async (
        signal?: AbortSignal
    ): Promise<LessonQuizAttemptsMetadata> => {
        const response = await api.get<ApiResponse<LessonQuizAttemptsMetadata>>(
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
     * Get paginated list of all lesson quiz attempts
     */
    getList: async (
        params?: ListQueryParams,
        signal?: AbortSignal
    ): Promise<PaginatedData<LessonQuizAttempt>> => {
        const response = await api.get<ApiResponse<LessonQuizAttempt[]>>(
            BASE_URL,
            {
                params: params as Record<string, unknown> | undefined,
                signal,
            }
        );

        if (response.error) {
            throw response.error;
        }

        // API returns array directly, wrap in paginated format
        const items = response.data!.data!;
        return {
            items,
            currentPage: 1,
            lastPage: 1,
            perPage: items.length,
            nextPageUrl: null,
        };
    },

    /**
     * Get single lesson quiz attempt by ID
     */
    getById: async (
        lessonQuizAttempt: string,
        signal?: AbortSignal
    ): Promise<LessonQuizAttempt> => {
        const response = await api.get<ApiResponse<LessonQuizAttempt>>(
            `${BASE_URL}/${lessonQuizAttempt}`,
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
     * Get lesson quiz attempt history by lesson quiz attempt ID
     */
    getHistory: async (
        quizId: string,
        signal?: AbortSignal
    ): Promise<LessonQuizAttempt[]> => {
        const response = await api.get<ApiResponse<LessonQuizAttempt[]>>(
            `${BASE_URL}/quiz/${quizId}/history`,
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
     * Answer a lesson quiz attempt
     */
    answer: async (
        payload: LessonQuizAttemptsAnswer,
        id: string
    ): Promise<LessonQuizAttempt> => {
        const response = await api.post<ApiResponse<LessonQuizAttempt>>(
            `${BASE_URL}/${id}/answer`,
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
     * Complete a lesson quiz attempt
     */
    complete: async (id: string): Promise<LessonQuizAttempt> => {
        const response = await api.post<ApiResponse<LessonQuizAttempt>>(
            `${BASE_URL}/${id}/complete`
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
     * Start a lesson quiz attempt
     */
    attempt: async (
        payload: LessonQuizAttemptsStore
    ): Promise<LessonQuizAttempt> => {
        const response = await api.post<ApiResponse<LessonQuizAttempt>>(
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
};

export default lessonQuizAttemptsApi;
