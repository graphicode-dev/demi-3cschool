import { api } from "@/shared/api/client";
import { ApiResponse, ListQueryParams } from "@/shared/api";
import type {
    PaginatedPermissionsData,
    RolePermissionsData,
    UserPermissionsData,
    AssignUserPermissionsPayload,
} from "../types";

// ============================================================================
// Permissions API
// ============================================================================

const PERMISSIONS_BASE_URL = "/system-managements/permissions";
const ROLE_PERMISSIONS_BASE_URL = "/system-managements/role-permissions/role";
const USER_PERMISSIONS_BASE_URL = "/system-managements/user-permissions";

export const permissionsApi = {
    /**
     * Get all permissions grouped
     */
    getAllPermissions: async (
        params?: ListQueryParams,
        signal?: AbortSignal
    ): Promise<PaginatedPermissionsData> => {
        const response = await api.get<ApiResponse<PaginatedPermissionsData>>(
            PERMISSIONS_BASE_URL,
            { signal, params: { group: true, ...params } }
        );

        if (response.error) {
            throw response.error;
        }

        return response.data.data;
    },

    /**
     * Get role permissions by role ID (grouped)
     */
    getRolePermissions: async (
        roleId: number,
        params?: ListQueryParams,
        signal?: AbortSignal
    ): Promise<RolePermissionsData> => {
        const response = await api.get<ApiResponse<RolePermissionsData>>(
            `${ROLE_PERMISSIONS_BASE_URL}/${roleId}`,
            { signal, params: { group: true, ...params } }
        );

        if (response.error) {
            throw response.error;
        }

        return response.data.data;
    },

    /**
     * Get user permissions by user ID
     */
    getUserPermissions: async (
        userId: number,
        params?: ListQueryParams,
        signal?: AbortSignal
    ): Promise<UserPermissionsData> => {
        const response = await api.get<ApiResponse<UserPermissionsData>>(
            `${USER_PERMISSIONS_BASE_URL}/${userId}`,
            { signal, params: { group: true, ...params } }
        );

        if (response.error) {
            throw response.error;
        }

        return response.data.data;
    },

    /**
     * Assign permissions to a user
     */
    assignUserPermissions: async (
        userId: number,
        payload: AssignUserPermissionsPayload
    ): Promise<void> => {
        const response = await api.post<ApiResponse<void>>(
            `${USER_PERMISSIONS_BASE_URL}/${userId}`,
            payload
        );

        if (response.error) {
            throw response.error;
        }
    },

    /**
     * Remove a permission from a user
     */
    removeUserPermission: async (
        userId: number,
        permissionId: number
    ): Promise<void> => {
        const response = await api.delete<ApiResponse<void>>(
            `${USER_PERMISSIONS_BASE_URL}/${userId}/${permissionId}`
        );

        if (response.error) {
            throw response.error;
        }
    },
};
