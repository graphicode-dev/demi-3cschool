import { api } from "@/shared/api/client";
import {
    ApiResponse,
    ListQueryParams,
    PaginatedData,
    PaginatedResponse,
} from "@/shared/api";
import type {
    Squad,
    SquadMembersData,
    SquadStats,
    CreateSquadPayload,
    UpdateSquadPayload,
    AssignSquadMembersPayload,
    AssignGroupToSquadPayload,
} from "../types";

// ============================================================================
// Squads API
// ============================================================================

const BASE_URL = "/system-managements/squads";

export const squadsApi = {
    /**
     * Get all squads (paginated)
     */
    getAll: async (
        params?: ListQueryParams,
        signal?: AbortSignal
    ): Promise<PaginatedData<Squad>> => {
        const response = await api.get<PaginatedResponse<Squad>>(BASE_URL, {
            params,
            signal,
        });

        if (response.error) {
            throw response.error;
        }

        return response.data.data;
    },

    /**
     * Get a single squad by ID
     */
    getById: async (id: number, signal?: AbortSignal): Promise<Squad> => {
        const response = await api.get<ApiResponse<Squad>>(
            `${BASE_URL}/${id}`,
            { signal }
        );

        if (response.error) {
            throw response.error;
        }

        return response.data.data;
    },

    /**
     * Get squad stats
     */
    getStats: async (signal?: AbortSignal): Promise<SquadStats> => {
        const response = await api.get<ApiResponse<SquadStats>>(
            `${BASE_URL}/stats`,
            { signal }
        );

        if (response.error) {
            throw response.error;
        }

        return response.data.data;
    },

    /**
     * Get squad members
     */
    getMembers: async (
        id: number,
        signal?: AbortSignal
    ): Promise<SquadMembersData> => {
        const response = await api.get<ApiResponse<SquadMembersData>>(
            `${BASE_URL}/${id}/members`,
            { signal }
        );

        if (response.error) {
            throw response.error;
        }

        return response.data.data;
    },

    /**
     * Create a new squad
     */
    create: async (payload: CreateSquadPayload): Promise<Squad> => {
        const response = await api.post<ApiResponse<Squad>>(BASE_URL, payload);

        if (response.error) {
            throw response.error;
        }

        return response.data.data;
    },

    /**
     * Update a squad
     */
    update: async (id: number, payload: UpdateSquadPayload): Promise<Squad> => {
        const response = await api.patch<ApiResponse<Squad>>(
            `${BASE_URL}/${id}`,
            payload
        );

        if (response.error) {
            throw response.error;
        }

        return response.data.data;
    },

    /**
     * Delete a squad
     */
    delete: async (id: number): Promise<void> => {
        const response = await api.delete<ApiResponse<void>>(
            `${BASE_URL}/${id}`
        );

        if (response.error) {
            throw response.error;
        }
    },

    /**
     * Assign members to a squad
     */
    assignMembers: async (
        id: number,
        payload: AssignSquadMembersPayload
    ): Promise<void> => {
        const response = await api.post<ApiResponse<void>>(
            `${BASE_URL}/${id}/members`,
            payload
        );

        if (response.error) {
            throw response.error;
        }
    },

    /**
     * Remove a member from a squad
     */
    removeMember: async (squadId: number, userId: number): Promise<void> => {
        const response = await api.delete<ApiResponse<void>>(
            `${BASE_URL}/${squadId}/members/${userId}`
        );

        if (response.error) {
            throw response.error;
        }
    },

    /**
     * Assign a group to a squad
     */
    assignGroupToSquad: async (
        groupId: number,
        payload: AssignGroupToSquadPayload
    ): Promise<void> => {
        const response = await api.post<ApiResponse<void>>(
            `/groups/${groupId}/squads`,
            payload
        );

        if (response.error) {
            throw response.error;
        }
    },

    /**
     * Remove a group from a squad
     */
    removeGroupFromSquad: async (
        groupId: number,
        squadId: number
    ): Promise<void> => {
        const response = await api.delete<ApiResponse<void>>(
            `/groups/${groupId}/squads/${squadId}`
        );

        if (response.error) {
            throw response.error;
        }
    },
};
