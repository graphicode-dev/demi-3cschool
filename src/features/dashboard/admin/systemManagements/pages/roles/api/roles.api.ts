import { api } from "@/shared/api/client";
import { ApiResponse, ListQueryParams, PaginatedData } from "@/shared/api";
import type {
    Role,
    RoleMetadata,
    CreateRolePayload,
    UpdateRolePayload,
} from "../types";

// ============================================================================
// Roles API
// ============================================================================

const ROLES_BASE_URL = "/system-managements/roles";

export const rolesApi = {
    /**
     * Get list of all roles
     */
    getList: async (
        params?: ListQueryParams,
        signal?: AbortSignal
    ): Promise<PaginatedData<Role>> => {
        const response = await api.get<ApiResponse<PaginatedData<Role>>>(
            ROLES_BASE_URL,
            { signal, params }
        );

        if (response.error) {
            throw response.error;
        }

        return response.data.data;
    },

    /**
     * Get a single role by ID
     */
    getById: async (id: number, signal?: AbortSignal): Promise<Role> => {
        const response = await api.get<ApiResponse<Role>>(
            `${ROLES_BASE_URL}/${id}`,
            { signal }
        );

        if (response.error) {
            throw response.error;
        }

        return response.data.data;
    },

    /**
     * Get roles metadata (filters, operators, field types)
     */
    getMetadata: async (signal?: AbortSignal): Promise<RoleMetadata> => {
        const response = await api.get<ApiResponse<RoleMetadata>>(
            `${ROLES_BASE_URL}/metadata`,
            { signal }
        );

        if (response.error) {
            throw response.error;
        }

        return response.data.data;
    },

    /**
     * Create a new role
     */
    create: async (payload: CreateRolePayload): Promise<Role> => {
        const response = await api.post<ApiResponse<Role>>(
            ROLES_BASE_URL,
            payload
        );

        if (response.error) {
            throw response.error;
        }

        return response.data.data;
    },

    /**
     * Update an existing role
     */
    update: async (id: number, payload: UpdateRolePayload): Promise<Role> => {
        const response = await api.patch<ApiResponse<Role>>(
            `${ROLES_BASE_URL}/${id}`,
            payload
        );

        if (response.error) {
            throw response.error;
        }

        return response.data.data;
    },

    /**
     * Delete a role
     */
    delete: async (id: number): Promise<void> => {
        const response = await api.delete<ApiResponse<void>>(
            `${ROLES_BASE_URL}/${id}`
        );

        if (response.error) {
            throw response.error;
        }
    },
};
