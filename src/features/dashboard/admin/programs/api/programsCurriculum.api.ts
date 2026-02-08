/**
 * Programs Curriculum Feature - API Functions
 *
 * Raw API functions for programs curriculum domain.
 * These are pure functions that make HTTP requests.
 * They are used by query and mutation hooks.
 *
 * @example
 * ```ts
 * // In a query hook
 * const { data } = useQuery({
 *     queryKey: programsCurriculumKeys.list(params),
 *     queryFn: ({ signal }) => programsCurriculumApi.getList(params, signal),
 * });
 * ```
 */

import { api } from "@/shared/api/client";
import { ApiResponse, ListQueryParams, PaginatedData } from "@/shared/api";
import type {
    ProgramCurriculum,
    ProgramCurriculumCreatePayload,
    ProgramCurriculumUpdatePayload,
    ProgramsCurriculumMetadata,
} from "../types";

const BASE_URL = "/programs-curriculums";

/**
 * Programs Curriculum API functions
 */
export const programsCurriculumApi = {
    /**
     * Get programs curriculum metadata (filters, operators, field types)
     */
    getMetadata: async (
        signal?: AbortSignal
    ): Promise<ProgramsCurriculumMetadata> => {
        const response = await api.get<ApiResponse<ProgramsCurriculumMetadata>>(
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
     * Get list of all programs curriculums
     */
    getList: async (
        params?: ListQueryParams,
        signal?: AbortSignal
    ): Promise<ProgramCurriculum[]> => {
        const { search, ...restParams } = params ?? {};

        // Build query params, only include non-empty values
        const queryParams: Record<string, unknown> = { ...restParams };

        if (search?.trim()) {
            queryParams.search = search.trim();
        }

        const response = await api.get<
            ApiResponse<PaginatedData<ProgramCurriculum>>
        >(BASE_URL, {
            params: queryParams,
            signal,
        });

        if (response.error) {
            throw response.error;
        }

        // API returns paginated response with items array
        const data = response.data?.data;
        return data?.items ?? [];
    },

    /**
     * Get single programs curriculum by ID
     */
    getById: async (
        id: string | number,
        signal?: AbortSignal
    ): Promise<ProgramCurriculum> => {
        const response = await api.get<ApiResponse<ProgramCurriculum>>(
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
     * Create a new programs curriculum
     */
    create: async (
        payload: ProgramCurriculumCreatePayload
    ): Promise<ProgramCurriculum> => {
        const response = await api.post<ApiResponse<ProgramCurriculum>>(
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
     * Update an existing programs curriculum
     */
    update: async (
        id: string | number,
        payload: ProgramCurriculumUpdatePayload
    ): Promise<ProgramCurriculum> => {
        const response = await api.patch<ApiResponse<ProgramCurriculum>>(
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
     * Delete a programs curriculum
     */
    delete: async (id: string | number): Promise<void> => {
        const response = await api.delete(`${BASE_URL}/${id}`);

        if (response.error) {
            throw response.error;
        }
    },
};

export default programsCurriculumApi;
