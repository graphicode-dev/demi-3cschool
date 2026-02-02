/**
 * Lesson Video Quizzes Feature - API Functions
 *
 * Raw API functions for lesson video quizzes domain.
 * These are pure functions that make HTTP requests.
 * They are used by query and mutation hooks.
 */

import { api } from "@/shared/api/client";
import { ApiResponse, PaginatedData } from "@/shared/api";
import {
    LessonVideoQuiz,
    LessonVideoQuizCreatePayload,
    LessonVideoQuizUpdatePayload,
    LessonVideoQuizzesListParams,
    LessonVideoQuizzesMetadata,
    LessonVideoQuizzesPaginatedResponse,
} from "../../types";

const BASE_URL = "/lesson-video-quizzes";

/**
 * Lesson Video Quizzes API functions
 */
export const lessonVideoQuizzesApi = {
    /**
     * Get lesson video quizzes metadata (filters, operators, field types)
     */
    getMetadata: async (
        signal?: AbortSignal
    ): Promise<LessonVideoQuizzesMetadata> => {
        const response = await api.get<ApiResponse<LessonVideoQuizzesMetadata>>(
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
     * Get list of all lesson video quizzes (paginated)
     */
    getList: async (
        params?: LessonVideoQuizzesListParams,
        signal?: AbortSignal
    ): Promise<LessonVideoQuizzesPaginatedResponse> => {
        // Convert params to snake_case for API
        const apiParams: Record<string, unknown> = {};
        if (params?.page) apiParams.page = params.page;
        if (params?.perPage) apiParams.per_page = params.perPage;
        if (params?.lessonVideoId)
            apiParams.lesson_video_id = params.lessonVideoId;

        const response = await api.get<ApiResponse<unknown>>(BASE_URL, {
            params: Object.keys(apiParams).length > 0 ? apiParams : undefined,
            signal,
        });

        if (response.error) {
            throw response.error;
        }

        if (!response.data?.data) {
            throw new Error("No data returned from server");
        }

        // Handle both array and paginated response formats
        const responseData = response.data.data;

        // Check if response is already paginated (has items array)
        if (
            responseData &&
            typeof responseData === "object" &&
            "items" in responseData
        ) {
            const paginatedData = responseData as {
                items: LessonVideoQuiz[];
                perPage?: number;
                currentPage?: number;
                lastPage?: number;
                total?: number;
            };

            const perPage = paginatedData.perPage ?? 100;
            const lastPage = paginatedData.lastPage ?? 1;
            const itemsCount = paginatedData.items?.length ?? 0;
            // Calculate total: if on last page, use (lastPage-1)*perPage + itemsCount, otherwise estimate
            const total = paginatedData.total ?? lastPage * perPage;

            return {
                data: paginatedData.items ?? [],
                pagination: {
                    currentPage: paginatedData.currentPage ?? params?.page ?? 1,
                    lastPage: lastPage,
                    perPage: perPage,
                    total: total,
                },
            };
        }

        // If response is an array, wrap it
        if (Array.isArray(responseData)) {
            return {
                data: responseData as LessonVideoQuiz[],
                pagination: {
                    currentPage: params?.page ?? 1,
                    lastPage: 1,
                    perPage: 15,
                    total: responseData.length,
                },
            };
        }

        // Fallback - try to extract from meta
        const rawResponse = response.data as unknown as {
            data: LessonVideoQuiz[];
            meta?: {
                current_page?: number;
                last_page?: number;
                per_page?: number;
                total?: number;
            };
        };

        const dataArray = Array.isArray(rawResponse.data)
            ? rawResponse.data
            : [];

        return {
            data: dataArray,
            pagination: {
                currentPage:
                    rawResponse.meta?.current_page ?? params?.page ?? 1,
                lastPage: rawResponse.meta?.last_page ?? 1,
                perPage: rawResponse.meta?.per_page ?? 15,
                total: rawResponse.meta?.total ?? dataArray.length,
            },
        };
    },

    /**
     * Get paginated list of lesson video quizzes by video ID
     */
    getListByVideoId: async (
        videoId: string,
        params?: LessonVideoQuizzesListParams,
        signal?: AbortSignal
    ): Promise<PaginatedData<LessonVideoQuiz>> => {
        const response = await api.get<
            ApiResponse<{
                currentPage: number;
                perPage: number;
                lastPage: number;
                nextPageUrl: string | null;
                items: LessonVideoQuiz[];
            }>
        >(`${BASE_URL}/video/${videoId}`, {
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
     * Get single lesson video quiz by ID
     */
    getById: async (
        id: string,
        signal?: AbortSignal
    ): Promise<LessonVideoQuiz> => {
        const response = await api.get<ApiResponse<LessonVideoQuiz>>(
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
     * Create a new lesson video quiz
     */
    create: async (
        payload: LessonVideoQuizCreatePayload
    ): Promise<LessonVideoQuiz> => {
        const response = await api.post<ApiResponse<LessonVideoQuiz>>(
            BASE_URL,
            {
                lesson_video_id: payload.lessonVideoId,
                time_limit: payload.timeLimit,
                passing_score: String(payload.passingScore),
                max_attempts: String(payload.maxAttempts),
                shuffle_questions: payload.shuffleQuestions,
                show_answers: payload.showAnswers,
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
     * Update an existing lesson video quiz
     */
    update: async (
        id: string,
        payload: LessonVideoQuizUpdatePayload
    ): Promise<LessonVideoQuiz> => {
        const requestPayload: Record<string, unknown> = {};

        if (payload.lessonVideoId !== undefined) {
            requestPayload.lesson_video_id = payload.lessonVideoId;
        }
        if (payload.timeLimit !== undefined) {
            requestPayload.time_limit = payload.timeLimit;
        }
        if (payload.passingScore !== undefined) {
            requestPayload.passing_score = String(payload.passingScore);
        }
        if (payload.maxAttempts !== undefined) {
            requestPayload.max_attempts = String(payload.maxAttempts);
        }
        if (payload.shuffleQuestions !== undefined) {
            requestPayload.shuffle_questions = payload.shuffleQuestions;
        }
        if (payload.showAnswers !== undefined) {
            requestPayload.show_answers = payload.showAnswers;
        }

        const response = await api.patch<ApiResponse<LessonVideoQuiz>>(
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
     * Delete a lesson video quiz
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
