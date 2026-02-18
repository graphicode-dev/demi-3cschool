/**
 * Acceptance Exam Questions Feature - API Functions
 *
 * Raw API functions for acceptance exam questions domain.
 * These are pure functions that make HTTP requests.
 * They are used by query and mutation hooks.
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

const BASE_URL = "/acceptance-exam-questions";

/**
 * Acceptance Exam Questions API functions
 */
export const acceptanceExamQuestionsApi = {
    /**
     * Get acceptance exam questions metadata (filters, operators, field types)
     */
    getMetadata: async (
        signal?: AbortSignal
    ): Promise<AcceptanceExamQuestionsMetadata> => {
        const response = await api.get<
            ApiResponse<AcceptanceExamQuestionsMetadata>
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
     * Get list of questions by exam ID
     */
    getByExamId: async (
        examId: string,
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
        >(`${BASE_URL}/exam/${examId}`, {
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
     * Get single question by ID
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
     * Create a new question
     */
    create: async (
        payload: AcceptanceExamQuestionCreatePayload
    ): Promise<AcceptanceExamQuestion> => {
        const response = await api.post<ApiResponse<AcceptanceExamQuestion>>(
            BASE_URL,
            {
                acceptanceExamId: payload.acceptanceExamId,
                question: payload.question,
                type: payload.type,
                points: payload.points,
                order: payload.order,
                explanation: payload.explanation,
                isActive: payload.isActive,
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
     * Update an existing question
     */
    update: async (
        id: string,
        payload: AcceptanceExamQuestionUpdatePayload
    ): Promise<AcceptanceExamQuestion> => {
        const response = await api.patch<ApiResponse<AcceptanceExamQuestion>>(
            `${BASE_URL}/${id}`,
            {
                question: payload.question,
                type: payload.type,
                points: payload.points,
                order: payload.order,
                explanation: payload.explanation,
                isActive: payload.isActive,
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
     * Delete a question
     */
    delete: async (id: string): Promise<void> => {
        const response = await api.delete(`${BASE_URL}/${id}`);

        if (response.error) {
            throw response.error;
        }
    },
};

export default acceptanceExamQuestionsApi;
