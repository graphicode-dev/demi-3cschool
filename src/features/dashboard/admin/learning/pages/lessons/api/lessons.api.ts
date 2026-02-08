/**
 * Lessons Feature - API Functions
 *
 * Raw API functions for lessons domain.
 * These are pure functions that make HTTP requests.
 * They are used by query and mutation hooks.
 *
 * @example
 * ```ts
 * // In a query hook
 * const { data } = useQuery({
 *     queryKey: lessonKeys.list(params),
 *     queryFn: ({ signal }) => lessonsApi.getList(params, signal),
 * });
 * ```
 */

import { api } from "@/shared/api/client";
import type {
    Lesson,
    LessonGroup,
    LessonsListParams,
    LessonsByLevelParams,
    LessonCreatePayload,
    LessonUpdatePayload,
    LessonsMetadata,
} from "../types/lessons.types";
import { ApiResponse } from "@/shared/api";
import { PaginatedData, PaginatedResponse } from "@/shared/api/types";

const BASE_URL = "/lessons";

/**
 * Lessons API functions
 */
export const lessonsApi = {
    /**
     * Get lessons metadata (filters, operators, field types)
     */
    getMetadata: async (signal?: AbortSignal): Promise<LessonsMetadata> => {
        const response = await api.get<ApiResponse<LessonsMetadata>>(
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
     * Get list of all lessons (paginated or grouped based on type param)
     */
    getList: async <T extends LessonsListParams | undefined>(
        params?: T,
        signal?: AbortSignal
    ): Promise<
        T extends { type: "group" } ? LessonGroup[] : PaginatedData<Lesson>
    > => {
        const { programs_curriculum, ...restParams } = params ?? {};

        const response = await api.get<
            PaginatedResponse<Lesson> | PaginatedResponse<LessonGroup>
        >(BASE_URL, {
            params: {
                ...restParams,
                ...(programs_curriculum && { programs_curriculum }),
            } as Record<string, unknown>,
            signal,
        });

        if (response.error) {
            throw response.error;
        }

        return response.data!.data as T extends { type: "group" }
            ? LessonGroup[]
            : PaginatedData<Lesson>;
    },

    /**
     * Get list of lessons by level ID (paginated or grouped based on type param)
     */
    getByLevel: async (
        params: LessonsByLevelParams,
        signal?: AbortSignal
    ): Promise<PaginatedData<Lesson>> => {
        const { levelId, page = 1, type, programs_curriculum } = params;

        const response = await api.get<ApiResponse<PaginatedData<Lesson>>>(
            `${BASE_URL}/level/${levelId}`,
            {
                params: {
                    page,
                    ...(type && { type }),
                    ...(programs_curriculum && { programs_curriculum }),
                } as Record<string, unknown>,
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
     * Get single lesson by Level ID
     */
    getById: async (levelId: string, signal?: AbortSignal): Promise<Lesson> => {
        const response = await api.get<ApiResponse<Lesson>>(
            `${BASE_URL}/${levelId}`,
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
     * Create a new lesson
     */
    create: async (payload: LessonCreatePayload): Promise<Lesson> => {
        const response = await api.post<ApiResponse<Lesson>>(BASE_URL, {
            levelId: payload.levelId,
            title: payload.title,
            description: payload.description,
            isActive: payload.isActive ? 1 : 0,
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
     * Update an existing lesson
     */
    update: async (
        id: string,
        payload: LessonUpdatePayload
    ): Promise<Lesson> => {
        const response = await api.patch<ApiResponse<Lesson>>(
            `${BASE_URL}/${id}`,
            {
                levelId: payload.levelId,
                title: payload.title,
                description: payload.description,
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
     * Delete a lesson
     */
    delete: async (id: string): Promise<void> => {
        const response = await api.delete(`${BASE_URL}/${id}`);

        if (response.error) {
            throw response.error;
        }
    },
};

export default lessonsApi;
