/**
 * Levels Feature - API Functions
 *
 * Raw API functions for levels domain.
 * These are pure functions that make HTTP requests.
 * They are used by query and mutation hooks.
 *
 * @example
 * ```ts
 * // In a query hook
 * const { data } = useQuery({
 *     queryKey: levelKeys.list(params),
 *     queryFn: ({ signal }) => levelsApi.getList(params, signal),
 * });
 * ```
 */

import { api } from "@/shared/api/client";
import type {
    Level,
    LevelGroup,
    LevelByGrade,
    LevelsListParams,
    LevelsByCourseParams,
    LevelCreatePayload,
    LevelUpdatePayload,
    LevelsMetadata,
    PaginatedResponse,
    GroupedResponse,
    PaginatedData,
} from "../types/levels.types";
import { ApiResponse } from "@/shared/api";

const BASE_URL = "/levels";

/**
 * Levels API functions
 */
export const levelsApi = {
    /**
     * Get levels metadata (filters, operators, field types)
     */
    getMetadata: async (signal?: AbortSignal): Promise<LevelsMetadata> => {
        const response = await api.get<ApiResponse<LevelsMetadata>>(
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
     * Get list of all levels (paginated or grouped based on type param)
     */
    getList: async <T extends LevelsListParams | undefined>(
        params?: T,
        signal?: AbortSignal
    ): Promise<
        T extends { type: "group" } ? LevelGroup[] : PaginatedData<Level>
    > => {
        const { programs_curriculum, ...restParams } = params ?? {};

        const response = await api.get<
            PaginatedResponse<Level> | GroupedResponse<LevelGroup>
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
            ? LevelGroup[]
            : PaginatedData<Level>;
    },

    /**
     * Get list of levels by course ID (paginated or grouped based on type param)
     */
    getByCourse: async <T extends LevelsByCourseParams>(
        params: T,
        signal?: AbortSignal
    ): Promise<
        T extends { type: "group" } ? LevelGroup[] : PaginatedData<Level>
    > => {
        const { courseId, page, type, programs_curriculum } = params;

        const response = await api.get<
            PaginatedResponse<Level> | GroupedResponse<LevelGroup>
        >(`${BASE_URL}/courses/${courseId}`, {
            params: {
                ...(page && { page }),
                ...(type && { type }),
                ...(programs_curriculum && { programs_curriculum }),
            } as Record<string, unknown>,
            signal,
        });

        if (response.error) {
            throw response.error;
        }

        return response.data!.data as T extends { type: "group" }
            ? LevelGroup[]
            : PaginatedData<Level>;
    },

    /**
     * Get single level by ID
     */
    getById: async (id: string, signal?: AbortSignal): Promise<Level> => {
        const response = await api.get<ApiResponse<Level>>(
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
     * Create a new level
     */
    create: async (payload: LevelCreatePayload): Promise<Level[]> => {
        const response = await api.post<ApiResponse<Level[]>>(BASE_URL, {
            courseId: payload.courseId,
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
     * Update an existing level
     */
    update: async (id: string, payload: LevelUpdatePayload): Promise<Level> => {
        const response = await api.patch<ApiResponse<Level>>(
            `${BASE_URL}/${id}`,
            {
                courseId: payload.courseId,
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
     * Delete a level
     */
    delete: async (id: string): Promise<void> => {
        const response = await api.delete(`${BASE_URL}/${id}`);

        if (response.error) {
            throw response.error;
        }
    },

    /**
     * Get levels by grade ID
     */
    getByGrade: async (
        gradeId: string | number,
        signal?: AbortSignal
    ): Promise<LevelByGrade[]> => {
        const response = await api.get<ApiResponse<LevelByGrade[]>>(
            `${BASE_URL}/grade/${gradeId}`,
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
};

export default levelsApi;
