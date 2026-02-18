/**
 * Permissions Feature - Query Hooks
 *
 * TanStack Query hooks for reading permissions data.
 * All queries support AbortSignal for cancellation.
 *
 * @example
 * ```tsx
 * // Get all permissions grouped
 * const { data: permissions } = useAllPermissions();
 *
 * // Get role permissions
 * const { data: rolePerms } = useRolePermissions(roleId);
 *
 * // Get user permissions
 * const { data: userPerms } = useUserPermissions(userId);
 * ```
 */

import {
    useQuery,
    keepPreviousData,
    type UseQueryOptions,
} from "@tanstack/react-query";
import type {
    PaginatedPermissionsData,
    RolePermissionsData,
    UserPermissionsData,
} from "../types";
import { permissionKeys } from "./permissions.keys";
import { permissionsApi } from "./permissions.api";
import { ListQueryParams } from "@/shared/api";

// ============================================================================
// All Permissions Query
// ============================================================================

/**
 * Hook to fetch all permissions grouped
 *
 * @param options - Additional query options
 *
 * @example
 * ```tsx
 * const { data: permissions } = useAllPermissions();
 * ```
 */
export function useAllPermissions(
    params?: ListQueryParams,
    options?: Partial<UseQueryOptions<PaginatedPermissionsData, Error>>
) {
    return useQuery({
        queryKey: [...permissionKeys.list(), params] as const,
        queryFn: ({ signal }) =>
            permissionsApi.getAllPermissions(params, signal),
        placeholderData: keepPreviousData,
        staleTime: 1000 * 60 * 10, // 10 minutes - permissions don't change often
        ...options,
    });
}

// ============================================================================
// Role Permissions Query
// ============================================================================

/**
 * Hook to fetch permissions for a specific role
 *
 * @param roleId - Role ID
 * @param page - Optional page number for pagination
 * @param options - Additional query options
 *
 * @example
 * ```tsx
 * const { data: rolePerms } = useRolePermissions(roleId);
 * const { data: rolePermsPage2 } = useRolePermissions(roleId, 2);
 * ```
 */
export function useRolePermissions(
    roleId: number,
    params?: ListQueryParams,
    options?: Partial<UseQueryOptions<RolePermissionsData, Error>>
) {
    return useQuery({
        queryKey: permissionKeys.rolePermissionsPage(roleId, params),
        queryFn: ({ signal }) =>
            permissionsApi.getRolePermissions(roleId, params, signal),
        placeholderData: keepPreviousData,
        staleTime: 1000 * 60 * 2, // 2 minutes
        enabled: !!roleId,
        ...options,
    });
}

// ============================================================================
// User Permissions Query
// ============================================================================

/**
 * Hook to fetch permissions for a specific user
 *
 * @param userId - User ID
 * @param options - Additional query options
 *
 * @example
 * ```tsx
 * const { data: userPerms } = useUserPermissions(userId);
 * ```
 */
export function useUserPermissions(
    userId: number,
    params?: ListQueryParams,
    options?: Partial<UseQueryOptions<UserPermissionsData, Error>>
) {
    return useQuery({
        queryKey: permissionKeys.userPermissions(userId, params),
        queryFn: ({ signal }) =>
            permissionsApi.getUserPermissions(userId, params, signal),
        staleTime: 1000 * 60 * 2, // 2 minutes
        enabled: !!userId,
        ...options,
    });
}
