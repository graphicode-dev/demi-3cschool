/**
 * Level Quiz Options Feature - API Functions
 *
 * Raw API functions for level quiz options domain.
 * These are pure functions that make HTTP requests.
 * They are used by query and mutation hooks.
 *
 * @example
 * ```ts
 * // In a query hook
 * const { data } = useQuery({
 *     queryKey: levelQuizOptionKeys.list(params),
 *     queryFn: ({ signal }) => levelQuizOptionsApi.getList(params, signal),
 * });
 * ```
 */

import { api } from "@/shared/api/client";
import { ApiResponse } from "@/shared/api";
import {
    LevelQuizOption,
    LevelQuizOptionCreatePayload,
    LevelQuizOptionsListParams,
    LevelQuizOptionsMetadata,
    LevelQuizOptionUpdatePayload,
} from "../../types/level-quiz-options.types";
import { PaginatedData } from "@/shared/api";

const BASE_URL = "/level-quiz-options";

/**
 * Level Quiz Options API functions
 */
export const levelQuizOptionsApi = {
    /**
     * Get level quiz options metadata (filters, operators, field types)
     */
    getMetadata: async (
        signal?: AbortSignal
    ): Promise<LevelQuizOptionsMetadata> => {
        const response = await api.get<ApiResponse<LevelQuizOptionsMetadata>>(
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
     * Get list of all level quiz options
     */
    getList: async (
        params?: LevelQuizOptionsListParams,
        signal?: AbortSignal
    ): Promise<PaginatedData<LevelQuizOption>> => {
        const response = await api.get<ApiResponse<LevelQuizOption[]>>(
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
     * Get list of level quiz options by question ID
     */
    getByQuestionId: async (
        questionId: string,
        params?: LevelQuizOptionsListParams,
        signal?: AbortSignal
    ): Promise<PaginatedData<LevelQuizOption>> => {
        const response = await api.get<
            ApiResponse<PaginatedData<LevelQuizOption>>
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
     * Get single level quiz option by ID
     */
    getById: async (
        id: string,
        signal?: AbortSignal
    ): Promise<LevelQuizOption> => {
        const response = await api.get<ApiResponse<LevelQuizOption>>(
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
     * Create level quiz option(s)
     * Supports both single option and multiple options payload
     */
    create: async (
        payload: LevelQuizOptionCreatePayload
    ): Promise<LevelQuizOption[]> => {
        const response = await api.post<ApiResponse<LevelQuizOption[]>>(
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

    /**
     * Update an existing level quiz option
     */
    update: async (
        id: string,
        payload: LevelQuizOptionUpdatePayload
    ): Promise<LevelQuizOption> => {
        const response = await api.patch<ApiResponse<LevelQuizOption>>(
            `${BASE_URL}/${id}`,
            {
                questionId: payload.questionId,
                optionText: payload.optionText,
                isCorrect: payload.isCorrect,
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
     * Delete a level quiz option
     */
    delete: async (id: string): Promise<void> => {
        const response = await api.delete(`${BASE_URL}/${id}`);

        if (response.error) {
            throw response.error;
        }
    },
};

export default levelQuizOptionsApi;
