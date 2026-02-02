/**
 * Lesson Quiz Options Feature - API Functions
 *
 * Raw API functions for lesson quiz options domain.
 * These are pure functions that make HTTP requests.
 * They are used by query and mutation hooks.
 *
 * @example
 * ```ts
 * // In a query hook
 * const { data } = useQuery({
 *     queryKey: lessonQuizOptionKeys.list(params),
 *     queryFn: ({ signal }) => lessonQuizOptionsApi.getList(params, signal),
 * });
 * ```
 */

import { api } from "@/shared/api/client";
import { ApiResponse } from "@/shared/api";
import {
    LessonQuizOption,
    LessonQuizOptionCreatePayload,
    LessonQuizOptionsListParams,
    LessonQuizOptionsMetadata,
    LessonQuizOptionUpdatePayload,
} from "../../types";
import { PaginatedData } from "../../../levels";

const BASE_URL = "/lesson-quiz-options";

/**
 * Helper to check if payload is multiple options
 */
const isMultipleOptions = (
    payload: LessonQuizOptionCreatePayload
): payload is {
    questionId: string;
    options: Array<{ optionText: string; isCorrect: boolean; order: number }>;
} => {
    return "options" in payload && Array.isArray(payload.options);
};

/**
 * Lesson Quiz Options API functions
 */
export const lessonQuizOptionsApi = {
    /**
     * Get lesson quiz options metadata (filters, operators, field types)
     */
    getMetadata: async (
        signal?: AbortSignal
    ): Promise<LessonQuizOptionsMetadata> => {
        const response = await api.get<ApiResponse<LessonQuizOptionsMetadata>>(
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
     * Get paginated list of all lesson quiz options
     */
    getList: async (
        params?: LessonQuizOptionsListParams,
        signal?: AbortSignal
    ): Promise<PaginatedData<LessonQuizOption>> => {
        const response = await api.get<ApiResponse<LessonQuizOption[]>>(
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
     * Get paginated list of lesson quiz options by question ID
     */
    getListByQuestionId: async (
        questionId: string,
        params?: LessonQuizOptionsListParams,
        signal?: AbortSignal
    ): Promise<PaginatedData<LessonQuizOption>> => {
        const response = await api.get<
            ApiResponse<PaginatedData<LessonQuizOption>>
        >(`${BASE_URL}/question/${questionId}`, {
            params: params as Record<string, unknown> | undefined,
            signal,
        });

        if (response.error) {
            throw response.error;
        }

        return response.data.data;
    },

    /**
     * Get single lesson quiz option by ID
     */
    getById: async (
        id: string,
        signal?: AbortSignal
    ): Promise<LessonQuizOption> => {
        const response = await api.get<ApiResponse<LessonQuizOption>>(
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
     * Create lesson quiz option(s) - supports single or multiple options
     */
    create: async (
        payload: LessonQuizOptionCreatePayload
    ): Promise<LessonQuizOption | LessonQuizOption[]> => {
        let requestPayload: Record<string, unknown>;

        if (isMultipleOptions(payload)) {
            // Multiple options payload
            requestPayload = {
                questionId: payload.questionId,
                options: payload.options.map((opt) => ({
                    optionText: opt.optionText,
                    isCorrect: opt.isCorrect ? 1 : 0,
                    order: opt.order,
                })),
            };
        } else {
            // Single option payload
            requestPayload = {
                questionId: payload.questionId,
                optionText: payload.optionText,
                isCorrect: payload.isCorrect ? 1 : 0,
                order: payload.order,
            };
        }

        const response = await api.post<
            ApiResponse<LessonQuizOption | LessonQuizOption[]>
        >(BASE_URL, requestPayload);

        if (response.error) {
            throw response.error;
        }

        if (!response.data?.data) {
            throw new Error("No data returned from server");
        }

        return response.data.data;
    },

    /**
     * Update an existing lesson quiz option
     */
    update: async (
        id: string,
        payload: LessonQuizOptionUpdatePayload
    ): Promise<LessonQuizOption> => {
        const response = await api.patch<ApiResponse<LessonQuizOption>>(
            `${BASE_URL}/${id}`,
            {
                questionId: payload.questionId,
                optionText: payload.optionText,
                isCorrect:
                    payload.isCorrect !== undefined
                        ? payload.isCorrect
                            ? 1
                            : 0
                        : undefined,
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
     * Delete a lesson quiz option
     */
    delete: async (id: string): Promise<void> => {
        const response = await api.delete(`${BASE_URL}/${id}`);

        if (response.error) {
            throw response.error;
        }
    },
};

export default lessonQuizOptionsApi;
