/**
 * Acceptance Exam Options Feature - API Functions
 */

import { api } from "@/shared/api/client";
import { ApiResponse } from "@/shared/api";
import {
    AcceptanceExamOption,
    AcceptanceExamOptionCreatePayload,
    AcceptanceExamOptionsListParams,
    AcceptanceExamOptionsMetadata,
    AcceptanceExamOptionUpdatePayload,
} from "../../../../types/acceptance-exam-options.types";
import { PaginatedData } from "@/shared/api";

const BASE_URL = "/acceptance-exam-options";

/**
 * Acceptance Exam Options API functions
 */
export const acceptanceExamOptionsApi = {
    /**
     * Get options metadata (filters, operators, field types)
     */
    getMetadata: async (
        signal?: AbortSignal
    ): Promise<AcceptanceExamOptionsMetadata> => {
        const response = await api.get<
            ApiResponse<AcceptanceExamOptionsMetadata>
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
     * Get options by question ID
     */
    getByQuestionId: async (
        questionId: string,
        params?: AcceptanceExamOptionsListParams,
        signal?: AbortSignal
    ): Promise<PaginatedData<AcceptanceExamOption>> => {
        const response = await api.get<
            ApiResponse<PaginatedData<AcceptanceExamOption>>
        >(`${BASE_URL}/question/${questionId}`, {
            params: params as Record<string, unknown> | undefined,
            signal,
        });

        if (response.error) {
            throw response.error;
        }

        const paginatedData = response.data!.data!;
        return {
            items: paginatedData.items || [],
            perPage: paginatedData.perPage,
            currentPage: paginatedData.currentPage,
            lastPage: paginatedData.lastPage,
            nextPageUrl: paginatedData.nextPageUrl,
        };
    },

    /**
     * Get single option by ID
     */
    getById: async (
        id: string,
        signal?: AbortSignal
    ): Promise<AcceptanceExamOption> => {
        const response = await api.get<ApiResponse<AcceptanceExamOption>>(
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
     * Create options (batch)
     */
    create: async (
        payload: AcceptanceExamOptionCreatePayload
    ): Promise<AcceptanceExamOption[]> => {
        const response = await api.post<ApiResponse<AcceptanceExamOption[]>>(
            BASE_URL,
            {
                questionId: payload.questionId,
                options: payload.options,
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
     * Update an existing option
     */
    update: async (
        id: string,
        payload: AcceptanceExamOptionUpdatePayload
    ): Promise<AcceptanceExamOption> => {
        const response = await api.patch<ApiResponse<AcceptanceExamOption>>(
            `${BASE_URL}/${id}`,
            {
                option_text: payload.option_text,
                is_correct: payload.is_correct,
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
     * Delete an option
     */
    delete: async (id: string): Promise<void> => {
        const response = await api.delete(`${BASE_URL}/${id}`);

        if (response.error) {
            throw response.error;
        }
    },
};

export default acceptanceExamOptionsApi;
