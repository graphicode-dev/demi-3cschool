/**
 * Lesson Materials Feature - API Functions
 *
 * Raw API functions for lesson materials domain.
 * These are pure functions that make HTTP requests.
 * Uses FormData for create and update operations.
 *
 * @example
 * ```ts
 * // In a query hook
 * const { data } = useQuery({
 *     queryKey: lessonMaterialKeys.list(),
 *     queryFn: ({ signal }) => lessonMaterialsApi.getList(signal),
 * });
 * ```
 */

import { api } from "@/shared/api/client";
import { ApiResponse, PaginatedData } from "@/shared/api";
import {
    LessonMaterial,
    LessonMaterialCreatePayload,
    LessonMaterialUpdatePayload,
    LessonMaterialsListParams,
} from "../../types";
import { ListResponse } from "@/features/dashboard/admin/groupsManagement/api";

const BASE_URL = "/lesson-materials";

/**
 * Helper to convert payload to FormData
 */
const toFormData = (
    payload: LessonMaterialCreatePayload | LessonMaterialUpdatePayload
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
 * Lesson Materials API functions
 */
export const lessonMaterialsApi = {
    /**
     * Get list of all lesson materials
     */
    getList: async (signal?: AbortSignal): Promise<LessonMaterial[]> => {
        const response = await api.get<ListResponse<LessonMaterial>>(BASE_URL, {
            signal,
        });

        if (response.error) {
            throw response.error;
        }

        if (!response.data?.data) {
            throw new Error("No data returned from server");
        }

        return response.data.data;
    },

    /**
     * Get paginated list of lesson materials by lesson ID
     */
    getListByLessonId: async (
        lessonId: string,
        params?: LessonMaterialsListParams,
        signal?: AbortSignal
    ): Promise<PaginatedData<LessonMaterial>> => {
        const response = await api.get<
            ApiResponse<{
                currentPage: number;
                perPage: number;
                lastPage: number;
                nextPageUrl: string | null;
                data: LessonMaterial[];
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
     * Get single lesson material by ID
     */
    getById: async (
        id: string,
        signal?: AbortSignal
    ): Promise<LessonMaterial> => {
        const response = await api.get<ApiResponse<LessonMaterial>>(
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
     * Create a new lesson material (FormData)
     */
    create: async (
        payload: LessonMaterialCreatePayload
    ): Promise<LessonMaterial> => {
        const formData = toFormData(payload);
        const response = await api.post<ApiResponse<LessonMaterial>>(
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
     * Update an existing lesson material (FormData via POST)
     */
    update: async (
        id: string,
        payload: LessonMaterialUpdatePayload
    ): Promise<LessonMaterial> => {
        const formData = toFormData(payload);
        const response = await api.patch<ApiResponse<LessonMaterial>>(
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
     * Delete a lesson material
     */
    delete: async (id: string): Promise<void> => {
        const response = await api.delete(`${BASE_URL}/${id}`);

        if (response.error) {
            throw response.error;
        }
    },
};

export default lessonMaterialsApi;
