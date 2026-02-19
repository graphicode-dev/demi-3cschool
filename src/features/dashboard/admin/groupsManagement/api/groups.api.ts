/**
 * Groups Management Feature - API Functions
 *
 * Raw API functions for groups domain.
 * These are pure functions that make HTTP requests.
 * They are used by query and mutation hooks.
 *
 * @example
 * ```ts
 * // In a query hook
 * const { data } = useQuery({
 *     queryKey: groupKeys.list(params),
 *     queryFn: ({ signal }) => groupsApi.getList(params, signal),
 * });
 * ```
 */

import { api } from "@/shared/api/client";
import type {
    Group,
    GroupsListParams,
    GroupsByLevelParams,
    GroupCreatePayload,
    GroupUpdatePayload,
    GroupsMetadata,
    GroupRecommendPayload,
    GroupRecommendationsData,
    ListResponse,
    AssignBlocksPayload,
} from "../types/groups.types";
import type { GroupSession } from "../types/sessions.types";
import {
    ApiResponse,
    ListQueryParams,
    PaginatedData,
    PaginatedResponse,
} from "@/shared/api";

const BASE_URL = "/groups";

/**
 * Groups API functions
 */
export const groupsApi = {
    /**
     * Get groups metadata (filters, operators, searchable columns)
     */
    getMetadata: async (signal?: AbortSignal): Promise<GroupsMetadata> => {
        const response = await api.get<ApiResponse<GroupsMetadata>>(
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
     * Get list of groups by type (paginated if page param provided, otherwise returns array)
     */
    getList: async (
        params: ListQueryParams,
        signal?: AbortSignal
    ): Promise<PaginatedData<Group>> => {
        const response = await api.get<PaginatedResponse<Group>>(
            `${BASE_URL}`,
            {
                params: params as Record<string, unknown>,
                signal,
            }
        );

        if (response.error) {
            throw response.error;
        }

        return response.data!.data;
    },

    /**
     * Get single group by ID
     */
    getById: async (id: string, signal?: AbortSignal): Promise<Group> => {
        const response = await api.get<ApiResponse<Group>>(
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
     * Create a new group
     */
    create: async (payload: GroupCreatePayload): Promise<Group> => {
        const response = await api.post<ApiResponse<Group>>(BASE_URL, payload);

        if (response.error) {
            throw response.error;
        }

        if (!response.data?.data) {
            throw new Error("No data returned from server");
        }

        return response.data.data;
    },

    /**
     * Update an existing group
     */
    update: async (id: string, payload: GroupUpdatePayload): Promise<Group> => {
        const response = await api.patch<ApiResponse<Group>>(
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
     * Delete a group
     */
    delete: async (id: string): Promise<void> => {
        const response = await api.delete(`${BASE_URL}/${id}`);

        if (response.error) {
            throw response.error;
        }
    },

    /**
     * Get groups by level ID
     */
    getByLevel: async (
        params: GroupsByLevelParams,
        signal?: AbortSignal
    ): Promise<PaginatedData<Group>> => {
        const { levelId, page, search } = params;

        const response = await api.get<PaginatedResponse<Group>>(
            `${BASE_URL}/level/${levelId}`,
            {
                params: {
                    ...(page ? { page } : {}),
                    ...(search ? { search } : {}),
                },
                signal,
            }
        );

        if (response.error) {
            throw response.error;
        }

        return response.data!.data;
    },

    /**
     * Get group recommendations based on criteria
     */
    getRecommendations: async (
        payload: GroupRecommendPayload,
        signal?: AbortSignal
    ): Promise<GroupRecommendationsData> => {
        const response = await api.post<ApiResponse<GroupRecommendationsData>>(
            `${BASE_URL}/recommend`,
            payload,
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
     * Get sessions for a specific group
     */
    getSessions: async (
        groupId: number,
        signal?: AbortSignal
    ): Promise<GroupSession[]> => {
        const response = await api.get<ApiResponse<GroupSession[]>>(
            `${BASE_URL}/${groupId}/sessions`,
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
     * Assign blocks to a group
     */
    assignBlocks: async (
        groupId: number,
        payload: AssignBlocksPayload
    ): Promise<void> => {
        const response = await api.post<ApiResponse<void>>(
            `${BASE_URL}/${groupId}/blocks`,
            payload
        );

        if (response.error) {
            throw response.error;
        }
    },

    /**
     * Reassign instructor to a group
     */
    reassignInstructor: async (
        groupId: number,
        instructorId: number
    ): Promise<void> => {
        const response = await api.put<ApiResponse<void>>(
            `${BASE_URL}/${groupId}/instructor`,
            { instructorId }
        );

        if (response.error) {
            throw response.error;
        }
    },
};

export default groupsApi;
