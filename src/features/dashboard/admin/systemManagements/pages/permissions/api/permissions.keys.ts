/**
 * Permissions Feature - Query Keys
 *
 * Stable query key factory for TanStack Query.
 * Keys are hierarchical for easy invalidation.
 *
 * @example
 * ```ts
 * // Invalidate all permissions data
 * queryClient.invalidateQueries({ queryKey: permissionKeys.all });
 *
 * // Invalidate role permissions for a specific role
 * queryClient.invalidateQueries({ queryKey: permissionKeys.rolePermissions(roleId) });
 *
 * // Invalidate user permissions for a specific user
 * queryClient.invalidateQueries({ queryKey: permissionKeys.userPermissions(userId, params) });
 * ```
 */

import { ListQueryParams } from "@/shared/api";

// ============================================================================
// Permission Query Keys
// ============================================================================

/**
 * Query key factory for permissions
 *
 * Hierarchy:
 * - all: ['permissions']
 * - list: ['permissions', 'list']
 * - rolePermissions(roleId): ['permissions', 'role', roleId]
 * - rolePermissionsPage(roleId, params): ['permissions', 'role', roleId, params]
 * - userPermissions(userId, params): ['permissions', 'user', userId, params]
 */
export const permissionKeys = {
    /**
     * Root key for all permission queries
     */
    all: ["permissions"] as const,

    /**
     * Key for all permissions list (grouped)
     */
    list: () => [...permissionKeys.all, "list"] as const,

    /**
     * Key for role permissions by role ID
     */
    rolePermissions: (roleId: number) =>
        [...permissionKeys.all, "role", roleId] as const,

    /**
     * Key for role permissions with pagination
     */
    rolePermissionsPage: (roleId: number, params?: ListQueryParams) =>
        [...permissionKeys.all, "role", roleId, params] as const,

    /**
     * Key for user permissions by user ID
     */
    userPermissions: (userId: number, params?: ListQueryParams) =>
        [...permissionKeys.all, "user", userId, params] as const,
};

/**
 * Type for permission query keys
 */
export type PermissionQueryKey =
    | typeof permissionKeys.all
    | ReturnType<typeof permissionKeys.list>
    | ReturnType<typeof permissionKeys.rolePermissions>
    | ReturnType<typeof permissionKeys.rolePermissionsPage>
    | ReturnType<typeof permissionKeys.userPermissions>;
