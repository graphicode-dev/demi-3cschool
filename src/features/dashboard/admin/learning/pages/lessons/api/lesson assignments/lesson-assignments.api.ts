/**
 * Lesson Assignments Feature - API Functions
 *
 * Raw API functions for lesson assignments domain.
 * These are pure functions that make HTTP requests.
 * Uses FormData for create and update operations.
 *
 * @example
 * ```ts
 * // In a query hook
 * const { data } = useQuery({
 *     queryKey: lessonAssignmentKeys.list(),
 *     queryFn: ({ signal }) => lessonAssignmentsApi.getList(signal),
 * });
 * ```
 */

import { api } from "@/shared/api/client";
import { ApiResponse, PaginatedData } from "@/shared/api";
import {
    LessonAssignment,
    LessonAssignmentCreatePayload,
    LessonAssignmentUpdatePayload,
    LessonAssignmentsListParams,
} from "../../types/lesson-assignments.types";
import { ListResponse } from "@/features/dashboard/admin/groupsManagement/api";

const BASE_URL = "/lesson-assignments";

/**
 * Helper to convert payload to FormData
 */
const toFormData = (
    payload: LessonAssignmentCreatePayload | LessonAssignmentUpdatePayload
): FormData => {
    const formData = new FormData();

    if ("lessonId" in payload && payload.lessonId !== undefined) {
        formData.append("lessonId", payload.lessonId);
    }
    if ("title" in payload && payload.title !== undefined) {
        formData.append("title", payload.title);
    }
    if ("file" in payload && payload.file !== undefined) {
        formData.append("file", payload.file);
    }

    return formData;
};

/**
 * Lesson Assignments API functions
 */
export const lessonAssignmentsApi = {
    /**
     * Get list of all lesson assignments
     */
    getList: async (signal?: AbortSignal): Promise<LessonAssignment[]> => {
        const response = await api.get<ListResponse<LessonAssignment>>(
            BASE_URL,
            {
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
     * Get paginated list of lesson assignments by lesson ID
     */
    getListByLessonId: async (
        lessonId: string,
        params?: LessonAssignmentsListParams,
        signal?: AbortSignal
    ): Promise<PaginatedData<LessonAssignment>> => {
        const response = await api.get<
            ApiResponse<{
                currentPage: number;
                perPage: number;
                lastPage: number;
                nextPageUrl: string | null;
                data: LessonAssignment[];
            }>
        >(`${BASE_URL}/lesson/${lessonId}`, {
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
            items: apiData.data,
            currentPage: apiData.currentPage,
            perPage: apiData.perPage,
            lastPage: apiData.lastPage,
            nextPageUrl: apiData.nextPageUrl,
        };
    },

    /**
     * Get single lesson assignment by ID
     */
    getById: async (
        id: string,
        signal?: AbortSignal
    ): Promise<LessonAssignment> => {
        const response = await api.get<ApiResponse<LessonAssignment>>(
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
     * Create a new lesson assignment (FormData)
     */
    create: async (
        payload: LessonAssignmentCreatePayload
    ): Promise<LessonAssignment> => {
        const formData = toFormData(payload);
        const response = await api.post<ApiResponse<LessonAssignment>>(
            BASE_URL,
            formData
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
     * Update an existing lesson assignment (FormData via POST)
     */
    update: async (
        id: string,
        payload: LessonAssignmentUpdatePayload
    ): Promise<LessonAssignment> => {
        const formData = toFormData(payload);
        const response = await api.patch<ApiResponse<LessonAssignment>>(
            `${BASE_URL}/${id}`,
            formData
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
     * Delete a lesson assignment
     */
    delete: async (id: string): Promise<void> => {
        const response = await api.delete(`${BASE_URL}/${id}`);

        if (response.error) {
            throw response.error;
        }
    },
};

export default lessonAssignmentsApi;
