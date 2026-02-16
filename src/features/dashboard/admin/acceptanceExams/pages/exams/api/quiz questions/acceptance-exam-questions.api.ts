/**
 * Level Quiz Questions Feature - API Functions
 *
 * Raw API functions for level quiz questions domain.
 * These are pure functions that make HTTP requests.
 * They are used by query and mutation hooks.
 *
 * @example
 * ```ts
 * // In a query hook
 * const { data } = useQuery({
 *     queryKey: acceptanceExamQuestionKeys.list(params),
 *     queryFn: ({ signal }) => acceptanceExamQuestionsApi.getList(params, signal),
 * });
 * ```
 */

import { api } from "@/shared/api/client";
import { ApiResponse } from "@/shared/api";
import {
    AcceptanceExamQuestion,
    AcceptanceExamQuestionCreatePayload,
    AcceptanceExamQuestionsListParams,
    AcceptanceExamQuestionsMetadata,
    AcceptanceExamQuestionUpdatePayload,
} from "../../../../types/acceptance-exam-questions.types";
import { PaginatedData } from "@/shared/api";

const BASE_URL = "/level-quiz-questions";

/**
 * Level Quiz Questions API functions
 */
export const acceptanceExamQuestionsApi = {
    /**
     * Get level quiz questions metadata (filters, operators, field types)
     */
    getMetadata: async (
        signal?: AbortSignal
    ): Promise<AcceptanceExamQuestionsMetadata> => {
        const response = await api.get<ApiResponse<AcceptanceExamQuestionsMetadata>>(
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
     * Get list of all level quiz questions
     */
    getList: async (
        params?: AcceptanceExamQuestionsListParams,
        signal?: AbortSignal
    ): Promise<PaginatedData<AcceptanceExamQuestion>> => {
        const response = await api.get<ApiResponse<AcceptanceExamQuestion[]>>(
            BASE_URL,
            {
                params: params as Record<string, unknown> | undefined,
                signal,
            }
        );

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
     * Get list of level quiz questions by quiz ID
     */
    getByQuizId: async (
        quizId: string,
        params?: AcceptanceExamQuestionsListParams,
        signal?: AbortSignal
    ): Promise<PaginatedData<AcceptanceExamQuestion>> => {
        const response = await api.get<
            ApiResponse<{
                perPage: number;
                currentPage: number;
                lastPage: number;
                nextPageUrl: string | null;
                items: AcceptanceExamQuestion[];
            }>
        >(`${BASE_URL}/quiz/${quizId}`, {
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
            perPage: apiData.perPage,
            currentPage: apiData.currentPage,
            lastPage: apiData.lastPage,
            nextPageUrl: apiData.nextPageUrl,
        };
    },

    /**
     * Get single level quiz question by ID
     */
    getById: async (
        id: string,
        signal?: AbortSignal
    ): Promise<AcceptanceExamQuestion> => {
        const response = await api.get<ApiResponse<AcceptanceExamQuestion>>(
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
     * Create a new level quiz question
     */
    create: async (
        payload: AcceptanceExamQuestionCreatePayload
    ): Promise<AcceptanceExamQuestion[]> => {
        const response = await api.post<ApiResponse<AcceptanceExamQuestion[]>>(
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
     * Update an existing level quiz question
     */
    update: async (
        id: string,
        payload: AcceptanceExamQuestionUpdatePayload
    ): Promise<AcceptanceExamQuestion> => {
        const response = await api.patch<ApiResponse<AcceptanceExamQuestion>>(
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
     * Delete a level quiz question
     */
    delete: async (id: string): Promise<void> => {
        const response = await api.delete(`${BASE_URL}/${id}`);

        if (response.error) {
            throw response.error;
        }
    },
};

export default acceptanceExamQuestionsApi;
