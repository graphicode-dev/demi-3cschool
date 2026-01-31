/**
 * Lesson Quizzes Feature - API Functions
 *
 * Raw API functions for lesson quizzes domain.
 * These are pure functions that make HTTP requests.
 * They are used by query and mutation hooks.
 *
 * @example
 * ```ts
 * // In a query hook
 * const { data } = useQuery({
 *     queryKey: lessonQuizKeys.list(params),
 *     queryFn: ({ signal }) => lessonQuizzesApi.getList(params, signal),
 * });
 * ```
 */

import { api } from "@/shared/api/client";
import { ApiResponse } from "@/shared/api";
import {
    LessonQuiz,
    LessonQuizCreatePayload,
    LessonQuizUpdatePayload,
    LessonQuizzesListParams,
    LessonQuizzesMetadata,
    PaginatedData,
} from "../../types";

const BASE_URL = "/lesson-quizzes";

/**
 * Lesson Quizzes API functions
 */
export const lessonQuizzesApi = {
    /**
     * Get lesson quizzes metadata (filters, operators, field types)
     */
    getMetadata: async (
        signal?: AbortSignal
    ): Promise<LessonQuizzesMetadata> => {
        const response = await api.get<ApiResponse<LessonQuizzesMetadata>>(
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
     * Get paginated list of all lesson quizzes
     */
    getList: async (
        params?: LessonQuizzesListParams,
        signal?: AbortSignal
    ): Promise<PaginatedData<LessonQuiz>> => {
        const response = await api.get<ApiResponse<LessonQuiz[]>>(BASE_URL, {
            params: params as Record<string, unknown> | undefined,
            signal,
        });

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
     * Get single lesson quiz by ID
     */
    getById: async (id: string, signal?: AbortSignal): Promise<LessonQuiz> => {
        const response = await api.get<ApiResponse<LessonQuiz>>(
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
     * Create a new lesson quiz
     */
    create: async (payload: LessonQuizCreatePayload): Promise<LessonQuiz> => {
        const response = await api.post<ApiResponse<LessonQuiz>>(BASE_URL, {
            lessonId: payload.lessonId,
            timeLimit: payload.timeLimit,
            passingScore: payload.passingScore,
            maxAttempts: payload.maxAttempts,
            shuffleQuestions: payload.shuffleQuestions ? 1 : 0,
            showAnswers: payload.showAnswers ? 1 : 0,
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
     * Update an existing lesson quiz
     */
    update: async (
        id: string,
        payload: LessonQuizUpdatePayload
    ): Promise<LessonQuiz> => {
        const response = await api.patch<ApiResponse<LessonQuiz>>(
            `${BASE_URL}/${id}`,
            {
                lessonId: payload.lessonId,
                timeLimit: payload.timeLimit,
                passingScore: payload.passingScore,
                maxAttempts: payload.maxAttempts,
                shuffleQuestions:
                    payload.shuffleQuestions !== undefined
                        ? payload.shuffleQuestions
                            ? 1
                            : 0
                        : undefined,
                showAnswers:
                    payload.showAnswers !== undefined
                        ? payload.showAnswers
                            ? 1
                            : 0
                        : undefined,
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
     * Delete a lesson quiz
     */
    delete: async (id: string): Promise<void> => {
        const response = await api.delete(`${BASE_URL}/${id}`);

        if (response.error) {
            throw response.error;
        }
    },
};

export default lessonQuizzesApi;
