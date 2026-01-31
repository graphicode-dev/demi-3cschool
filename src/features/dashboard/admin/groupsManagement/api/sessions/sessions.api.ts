/**
 * Group Sessions Management Feature - API Functions
 *
 * Raw API functions for sessions domain.
 * These are pure functions that make HTTP requests.
 * They are used by query and mutation hooks.
 *
 * @example
 * ```ts
 * // In a query hook
 * const { data } = useQuery({
 *     queryKey: sessionKeys.list(params),
 *     queryFn: ({ signal }) => sessionsApi.getList(params, signal),
 * });
 * ```
 */

import { api } from "@/shared/api/client";
import type {
    GroupSession,
    SessionsListParams,
    GroupSessionCreatePayload,
    GroupSessionReschedulePayload,
    SessionsMetadata,
} from "../../types/sessions.types";
import type { ListResponse } from "../../types/groups.types";
import { ApiResponse } from "@/shared/api";

const BASE_URL = "/group-sessions";

/**
 * Sessions API functions
 */
export const sessionsApi = {
    /**
     * Get sessions metadata (filters, operators, searchable columns)
     */
    getMetadata: async (signal?: AbortSignal): Promise<SessionsMetadata> => {
        const response = await api.get<ApiResponse<SessionsMetadata>>(
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
     * Get list of sessions with filtering and pagination
     */
    getList: async (
        params: SessionsListParams,
        signal?: AbortSignal
    ): Promise<GroupSession[]> => {
        const response = await api.get<ListResponse<GroupSession>>(BASE_URL, {
            params: params as Record<string, unknown>,
            signal,
        });

        if (response.error) {
            throw response.error;
        }

        return response.data!.data;
    },

    /**
     * Get single session by ID
     */
    getById: async (
        id: number,
        signal?: AbortSignal
    ): Promise<GroupSession> => {
        const response = await api.get<ApiResponse<GroupSession>>(
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
     * Create a new session
     */
    create: async (
        payload: GroupSessionCreatePayload
    ): Promise<GroupSession> => {
        const response = await api.post<ApiResponse<GroupSession>>(
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
     * Reschedule an existing session
     */
    reschedule: async (
        id: number,
        payload: GroupSessionReschedulePayload
    ): Promise<GroupSession> => {
        const response = await api.patch<ApiResponse<GroupSession>>(
            `${BASE_URL}/${id}/reschedule`,
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
     * Delete a session
     */
    delete: async (id: string): Promise<void> => {
        const response = await api.delete(`${BASE_URL}/${id}`);

        if (response.error) {
            throw response.error;
        }
    },
};

export default sessionsApi;
