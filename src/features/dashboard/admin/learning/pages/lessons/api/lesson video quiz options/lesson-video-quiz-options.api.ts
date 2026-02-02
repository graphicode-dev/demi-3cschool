/**
 * Lesson Video Quiz Options Feature - API Functions
 *
 * Raw API functions for lesson video quiz options domain.
 * These are pure functions that make HTTP requests.
 * They are used by query and mutation hooks.
 */

import { api } from "@/shared/api/client";
import { ApiResponse } from "@/shared/api";
import {
    LessonVideoQuizOption,
    LessonVideoQuizOptionCreatePayload,
    LessonVideoQuizOptionUpdatePayload,
    LessonVideoQuizOptionsListParams,
    LessonVideoQuizOptionsMetadata,
    LessonVideoQuizOptionsPaginatedResponse,
} from "../../types";

const BASE_URL = "/lesson-video-quiz-options";

/**
 * Lesson Video Quiz Options API functions
 */
export const lessonVideoQuizOptionsApi = {
    /**
     * Get lesson video quiz options metadata (filters, operators, field types)
     */
    getMetadata: async (
        signal?: AbortSignal
    ): Promise<LessonVideoQuizOptionsMetadata> => {
        const response = await api.get<
            ApiResponse<LessonVideoQuizOptionsMetadata>
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
     * Get list of all lesson video quiz options (paginated)
     */
    getList: async (
        params?: LessonVideoQuizOptionsListParams,
        signal?: AbortSignal
    ): Promise<LessonVideoQuizOptionsPaginatedResponse> => {
        const response = await api.get<ApiResponse<unknown>>(BASE_URL, {
            params: params as Record<string, unknown> | undefined,
            signal,
        });

        if (response.error) {
            throw response.error;
        }

        if (!response.data?.data) {
            return {
                data: [],
                pagination: {
                    currentPage: 1,
                    lastPage: 1,
                    perPage: 15,
                    total: 0,
                },
            };
        }

        const responseData = response.data.data;

        // Check if response is already paginated (has items array)
        if (
            responseData &&
            typeof responseData === "object" &&
            "items" in responseData
        ) {
            const paginatedData = responseData as {
                items: LessonVideoQuizOption[];
                perPage?: number;
                currentPage?: number;
                lastPage?: number;
                total?: number;
            };
            return {
                data: paginatedData.items ?? [],
                pagination: {
                    currentPage: paginatedData.currentPage ?? params?.page ?? 1,
                    lastPage: paginatedData.lastPage ?? 1,
                    perPage: paginatedData.perPage ?? 15,
                    total:
                        paginatedData.total ?? paginatedData.items?.length ?? 0,
                },
            };
        }

        // If response is an array, wrap it
        if (Array.isArray(responseData)) {
            return {
                data: responseData as LessonVideoQuizOption[],
                pagination: {
                    currentPage: params?.page ?? 1,
                    lastPage: 1,
                    perPage: 15,
                    total: responseData.length,
                },
            };
        }

        return {
            data: [],
            pagination: { currentPage: 1, lastPage: 1, perPage: 15, total: 0 },
        };
    },

    /**
     * Get single lesson video quiz option by ID
     */
    getById: async (
        id: string,
        signal?: AbortSignal
    ): Promise<LessonVideoQuizOption> => {
        const response = await api.get<ApiResponse<LessonVideoQuizOption>>(
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
     * Create a new lesson video quiz option
     */
    create: async (
        payload: LessonVideoQuizOptionCreatePayload
    ): Promise<LessonVideoQuizOption> => {
        const response = await api.post<ApiResponse<LessonVideoQuizOption>>(
            BASE_URL,
            {
                question_id: payload.questionId,
                option_text: payload.optionText,
                is_correct: payload.isCorrect,
                order: payload.order,
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
     * Update an existing lesson video quiz option
     */
    update: async (
        id: string,
        payload: LessonVideoQuizOptionUpdatePayload
    ): Promise<LessonVideoQuizOption> => {
        const requestPayload: Record<string, unknown> = {};

        if (payload.questionId !== undefined) {
            requestPayload.question_id = payload.questionId;
        }
        if (payload.optionText !== undefined) {
            requestPayload.option_text = payload.optionText;
        }
        if (payload.isCorrect !== undefined) {
            requestPayload.is_correct = payload.isCorrect;
        }
        if (payload.order !== undefined) {
            requestPayload.order = payload.order;
        }

        const response = await api.patch<ApiResponse<LessonVideoQuizOption>>(
            `${BASE_URL}/${id}`,
            requestPayload
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
     * Delete a lesson video quiz option
     */
    delete: async (id: string): Promise<void> => {
        const response = await api.delete<ApiResponse<void>>(
            `${BASE_URL}/${id}`
        );

        if (response.error) {
            throw response.error;
        }
    },
};
