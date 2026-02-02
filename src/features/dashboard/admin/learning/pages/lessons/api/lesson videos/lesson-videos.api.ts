/**
 * Lesson Videos Feature - API Functions
 *
 * Raw API functions for lesson videos domain.
 * These are pure functions that make HTTP requests.
 * They are used by query and mutation hooks.
 *
 * @example
 * ```ts
 * // In a query hook
 * const { data } = useQuery({
 *     queryKey: lessonVideoKeys.list(),
 *     queryFn: ({ signal }) => lessonVideosApi.getList(signal),
 * });
 * ```
 */

import { api } from "@/shared/api/client";
import { ApiResponse, ListResponse, PaginatedData } from "@/shared/api";
import {
    LessonVideo,
    LessonVideoCreatePayload,
    LessonVideoUpdatePayload,
    LessonVideosListParams,
} from "../../types";

const BASE_URL = "/lesson-videos";

/**
 * Lesson Videos API functions
 */
export const lessonVideosApi = {
    /**
     * Get list of all lesson videos
     */
    getList: async (signal?: AbortSignal): Promise<LessonVideo[]> => {
        const response = await api.get<ListResponse<LessonVideo>>(BASE_URL, {
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
     * Get lesson videos by level ID
     */
    getByLevelId: async (
        levelId: string,
        signal?: AbortSignal
    ): Promise<LessonVideo[]> => {
        const response = await api.get<ListResponse<LessonVideo>>(
            `${BASE_URL}/level/${levelId}`,
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
     * Get paginated list of lesson videos by lesson ID
     */
    getListByLessonId: async (
        lessonId: string,
        params?: LessonVideosListParams,
        signal?: AbortSignal
    ): Promise<PaginatedData<LessonVideo>> => {
        const response = await api.get<
            ApiResponse<{
                currentPage: number;
                perPage: number;
                lastPage: number;
                nextPageUrl: string | null;
                items: LessonVideo[];
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
            items: apiData.items,
            currentPage: apiData.currentPage,
            perPage: apiData.perPage,
            lastPage: apiData.lastPage,
            nextPageUrl: apiData.nextPageUrl,
        };
    },

    /**
     * Get single lesson video by ID
     */
    getById: async (id: string, signal?: AbortSignal): Promise<LessonVideo> => {
        const response = await api.get<ApiResponse<LessonVideo>>(
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
     * Create a new lesson video
     */
    create: async (payload: LessonVideoCreatePayload): Promise<LessonVideo> => {
        const response = await api.post<ApiResponse<LessonVideo>>(
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
     * Update an existing lesson video
     */
    update: async (
        id: string,
        payload: LessonVideoUpdatePayload
    ): Promise<LessonVideo> => {
        const response = await api.patch<ApiResponse<LessonVideo>>(
            `${BASE_URL}/${id}`,
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
     * Delete a lesson video
     */
    delete: async (id: string): Promise<void> => {
        const response = await api.delete(`${BASE_URL}/${id}`);

        if (response.error) {
            throw response.error;
        }
    },
};

export default lessonVideosApi;
