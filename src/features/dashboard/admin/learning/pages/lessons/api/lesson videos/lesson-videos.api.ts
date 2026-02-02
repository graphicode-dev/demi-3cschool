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
import { ApiResponse, ListResponse } from "@/shared/api";
import {
    LessonVideo,
    LessonVideoCreatePayload,
    LessonVideoUpdatePayload,
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
