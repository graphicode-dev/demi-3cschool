/**
 * Lesson Quiz Questions Feature - API Functions
 *
 * Raw API functions for lesson quiz questions domain.
 * These are pure functions that make HTTP requests.
 * They are used by query and mutation hooks.
 *
 * @example
 * ```ts
 * // In a query hook
 * const { data } = useQuery({
 *     queryKey: lessonQuizQuestionKeys.list(params),
 *     queryFn: ({ signal }) => lessonQuizQuestionsApi.getList(params, signal),
 * });
 * ```
 */

import { api } from "@/shared/api/client";
import { ApiResponse } from "@/shared/api";
import {
    LessonQuizQuestion,
    LessonQuizQuestionCreatePayload,
    LessonQuizQuestionsListParams,
    LessonQuizQuestionsMetadata,
    LessonQuizQuestionUpdatePayload,
} from "../../types";
import { PaginatedData } from "@/shared/api";

const BASE_URL = "/lesson-quiz-questions";

/**
 * Lesson Quiz Questions API functions
 */
export const lessonQuizQuestionsApi = {
    /**
     * Get lesson quiz questions metadata (filters, operators, field types)
     */
    getMetadata: async (
        signal?: AbortSignal
    ): Promise<LessonQuizQuestionsMetadata> => {
        const response = await api.get<
            ApiResponse<LessonQuizQuestionsMetadata>
        >(`${BASE_URL}/metadata`, { signal });

        if (response.error) {
            throw response.error;
        }

        if (!response.data?.data) {
            throw new Error("No data returned from server");
        }

        return response.data.data;
    },

    /**
     * Get paginated list of all lesson quiz questions
     */
    getList: async (
        params?: LessonQuizQuestionsListParams,
        signal?: AbortSignal
    ): Promise<PaginatedData<LessonQuizQuestion>> => {
        const response = await api.get<ApiResponse<LessonQuizQuestion[]>>(
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
     * Get paginated list of lesson quiz questions by quiz ID
     */
    getListByQuizId: async (
        quizId: string,
        params?: LessonQuizQuestionsListParams,
        signal?: AbortSignal
    ): Promise<PaginatedData<LessonQuizQuestion>> => {
        const response = await api.get<
            ApiResponse<PaginatedData<LessonQuizQuestion>>
        >(`${BASE_URL}/quiz/${quizId}`, {
            params: params as Record<string, unknown> | undefined,
            signal,
        });

        if (response.error) {
            throw response.error;
        }

        return response.data.data;
    },

    /**
     * Get single lesson quiz question by ID
     */
    getById: async (
        id: string,
        signal?: AbortSignal
    ): Promise<LessonQuizQuestion> => {
        const response = await api.get<ApiResponse<LessonQuizQuestion>>(
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
     * Create a new lesson quiz question
     */
    create: async (
        payload: LessonQuizQuestionCreatePayload
    ): Promise<LessonQuizQuestion> => {
        const response = await api.post<ApiResponse<LessonQuizQuestion>>(
            BASE_URL,
            {
                quizId: payload.quizId,
                question: payload.question,
                type: payload.type,
                points: payload.points,
                order: payload.order,
                explanation: payload.explanation,
                isActive: payload.isActive ? 1 : 0,
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
     * Update an existing lesson quiz question
     */
    update: async (
        id: string,
        payload: LessonQuizQuestionUpdatePayload
    ): Promise<LessonQuizQuestion> => {
        const response = await api.patch<ApiResponse<LessonQuizQuestion>>(
            `${BASE_URL}/${id}`,
            {
                quizId: payload.quizId,
                question: payload.question,
                type: payload.type,
                points: payload.points,
                order: payload.order,
                explanation: payload.explanation,
                isActive:
                    payload.isActive !== undefined
                        ? payload.isActive
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
     * Delete a lesson quiz question
     */
    delete: async (id: string): Promise<void> => {
        const response = await api.delete(`${BASE_URL}/${id}`);

        if (response.error) {
            throw response.error;
        }
    },
};

export default lessonQuizQuestionsApi;
