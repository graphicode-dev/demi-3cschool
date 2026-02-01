/**
 * Lesson Video Quizzes Feature - API Functions
 *
 * Raw API functions for lesson video quizzes domain.
 * These are pure functions that make HTTP requests.
 * They are used by query and mutation hooks.
 */

import { api } from "@/shared/api/client";
import { ApiResponse } from "@/shared/api";
import {
    LessonVideoQuiz,
    LessonVideoQuizCreatePayload,
    LessonVideoQuizUpdatePayload,
    LessonVideoQuizzesListParams,
    LessonVideoQuizzesMetadata,
    PaginatedData,
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
     * Get list of all lesson video quizzes
     */
    getList: async (
        params?: LessonVideoQuizzesListParams,
        signal?: AbortSignal
    ): Promise<LessonVideoQuiz[]> => {
        const response = await api.get<ApiResponse<LessonVideoQuiz[]>>(
            BASE_URL,
            {
                params: params as Record<string, unknown> | undefined,
                signal,
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
