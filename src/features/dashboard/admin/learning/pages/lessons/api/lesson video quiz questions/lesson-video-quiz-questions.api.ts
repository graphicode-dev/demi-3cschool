/**
 * Lesson Video Quiz Questions Feature - API Functions
 *
 * Raw API functions for lesson video quiz questions domain.
 * These are pure functions that make HTTP requests.
 * They are used by query and mutation hooks.
 */

import { api } from "@/shared/api/client";
import { ApiResponse } from "@/shared/api";
import {
    LessonVideoQuizQuestion,
    LessonVideoQuizQuestionCreatePayload,
    LessonVideoQuizQuestionUpdatePayload,
    LessonVideoQuizQuestionsListParams,
    LessonVideoQuizQuestionsMetadata,
} from "../../types";

const BASE_URL = "/lesson-video-quiz-questions";

/**
 * Lesson Video Quiz Questions API functions
 */
export const lessonVideoQuizQuestionsApi = {
    /**
     * Get lesson video quiz questions metadata (filters, operators, field types)
     */
    getMetadata: async (
        signal?: AbortSignal
    ): Promise<LessonVideoQuizQuestionsMetadata> => {
        const response = await api.get<
            ApiResponse<LessonVideoQuizQuestionsMetadata>
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
     * Get list of all lesson video quiz questions
     */
    getList: async (
        params?: LessonVideoQuizQuestionsListParams,
        signal?: AbortSignal
    ): Promise<LessonVideoQuizQuestion[]> => {
        const response = await api.get<ApiResponse<LessonVideoQuizQuestion[]>>(
            BASE_URL,
            {
                params: params as Record<string, unknown> | undefined,
                signal,
            }
        );

        if (response.error) {
            throw response.error;
        }

        return response.data?.data ?? [];
    },

    /**
     * Get single lesson video quiz question by ID
     */
    getById: async (
        id: string,
        signal?: AbortSignal
    ): Promise<LessonVideoQuizQuestion> => {
        const response = await api.get<ApiResponse<LessonVideoQuizQuestion>>(
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
     * Create a new lesson video quiz question
     */
    create: async (
        payload: LessonVideoQuizQuestionCreatePayload
    ): Promise<LessonVideoQuizQuestion> => {
        const response = await api.post<ApiResponse<LessonVideoQuizQuestion>>(
            BASE_URL,
            {
                quiz_id: payload.quizId,
                question: payload.question,
                type: payload.type,
                points: String(payload.points),
                order: payload.order,
                explanation: payload.explanation ?? "",
                is_active: payload.isActive ? 1 : 0,
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
     * Update an existing lesson video quiz question
     */
    update: async (
        id: string,
        payload: LessonVideoQuizQuestionUpdatePayload
    ): Promise<LessonVideoQuizQuestion> => {
        const requestPayload: Record<string, unknown> = {};

        if (payload.quizId !== undefined) {
            requestPayload.quiz_id = payload.quizId;
        }
        if (payload.question !== undefined) {
            requestPayload.question = payload.question;
        }
        if (payload.type !== undefined) {
            requestPayload.type = payload.type;
        }
        if (payload.points !== undefined) {
            requestPayload.points = String(payload.points);
        }
        if (payload.order !== undefined) {
            requestPayload.order = payload.order;
        }
        if (payload.explanation !== undefined) {
            requestPayload.explanation = payload.explanation;
        }
        if (payload.isActive !== undefined) {
            requestPayload.is_active = payload.isActive ? 1 : 0;
        }

        const response = await api.patch<ApiResponse<LessonVideoQuizQuestion>>(
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
     * Delete a lesson video quiz question
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
