/**
 * usePermissions Hook
 *
 * Hook for checking user permissions.
 * Integrates with the permission store and supports API-fetched permissions.
 */

import { useMemo, useCallback, useEffect } from "react";
import { authStore } from "@/auth/auth.store";
import { permissionStore } from "@/auth/permission.store";
import { usePermissionsQuery } from "@/features/auth/api/auth.queries";
import type { Permission } from "./auth.types";

/**
 * Check if a permission matches (supports wildcards)
 */
function permissionMatches(
    userPermission: Permission,
    requiredPermission: Permission
): boolean {
    // Wildcard matches everything
    if (userPermission === "*") return true;

    // Exact match
    if (userPermission === requiredPermission) return true;

    // Resource wildcard (e.g., "course.*" matches "course.view")
    if (userPermission.endsWith(".*")) {
        const resource = userPermission.slice(0, -2);
        return requiredPermission.startsWith(`${resource}.`);
    }

    // Prefix wildcard (e.g., "*.view" matches "course.view")
    if (userPermission.startsWith("*.")) {
        const action = userPermission.slice(2);
        return requiredPermission.endsWith(`.${action}`);
    }

    return false;
}

/**
 * Hook for checking user permissions
 *
 * @example
 * ```tsx
 * const { hasPermission, hasAnyPermission, hasAllPermissions } = usePermissions();
 *
 * if (hasPermission('course.create')) {
 *     // Show create button
 * }
 *
 * if (hasAnyPermission(['course.update', 'course.delete'])) {
 *     // Show actions menu
 * }
 * ```
 */
export function usePermissions() {
    const user = authStore((state) => state.user);
    const isAuthenticated = authStore((state) => state.isAuthenticated);

    const {
        permissions: storedPermissions,
        permissionEntities,
        permissionGroups,
        isPermissionsLoaded,
        isPermissionsLoading,
        permissionsError,
    } = permissionStore();

    const {
        setPermissionEntities,
        setIsPermissionsLoading,
        setPermissionsError,
        clearPermissions,
    } = permissionStore();

    // Fetch permissions from API when authenticated
    const {
        data: permissionsData,
        isLoading: isQueryLoading,
        error: queryError,
        refetch: refetchPermissions,
    } = usePermissionsQuery({
        enabled: isAuthenticated && !isPermissionsLoaded,
    });

    // Sync query state with store
    useEffect(() => {
        if (isQueryLoading) {
            setIsPermissionsLoading(true);
        }
    }, [isQueryLoading, setIsPermissionsLoading]);

    useEffect(() => {
        if (queryError) {
            setPermissionsError(
                queryError instanceof Error
                    ? queryError.message
                    : "Failed to fetch permissions"
            );
        }
    }, [queryError, setPermissionsError]);

    useEffect(() => {
        if (permissionsData?.data) {
            setPermissionEntities(permissionsData.data);
        }
    }, [permissionsData, setPermissionEntities]);

    // Clear permissions on logout
    // Note: clearPermissions is handled by PermissionProvider, no need to duplicate here

    /**
     * Get user's permissions from store
     */
    const permissions = useMemo<Permission[]>(() => {
        // Use permissions from user object if available (from login response)
        if (user?.permissions && user.permissions.length > 0) {
            return user.permissions;
        }
        // Otherwise use permissions from store (fetched from API)
        return storedPermissions;
    }, [user?.permissions, storedPermissions]);

    /**
     * Check if user has a specific permission
     */
    const hasPermission = useCallback(
        (permission: Permission): boolean => {
            return permissions.some((p) => permissionMatches(p, permission));
        },
        [permissions]
    );

    /**
     * Check if user has any of the specified permissions
     */
    const hasAnyPermission = useCallback(
        (requiredPermissions: Permission[]): boolean => {
            return requiredPermissions.some((p) => hasPermission(p));
        },
        [hasPermission]
    );

    /**
     * Check if user has all of the specified permissions
     */
    const hasAllPermissions = useCallback(
        (requiredPermissions: Permission[]): boolean => {
            return requiredPermissions.every((p) => hasPermission(p));
        },
        [hasPermission]
    );

    /**
     * Check if user has a specific role
     */
    const hasRole = useCallback(
        (role: string): boolean => {
            if (!user?.role?.name) return false;
            return user.role.name.toLowerCase() === role.toLowerCase();
        },
        [user?.role?.name]
    );

    /**
     * Check if user has any of the specified roles
     */
    const hasAnyRole = useCallback(
        (roles: string[]): boolean => {
            return roles.some((r) => hasRole(r));
        },
        [hasRole]
    );

    /**
     * Check if user has all of the specified roles
     */
    const hasAllRoles = useCallback(
        (roles: string[]): boolean => {
            return roles.every((r) => hasRole(r));
        },
        [hasRole]
    );

    /**
     * Get permissions by group name
     */
    const getPermissionsByGroup = useCallback(
        (groupName: string) => {
            const group = permissionGroups.find(
                (g) => g.group.toLowerCase() === groupName.toLowerCase()
            );
            return group?.permissions || [];
        },
        [permissionGroups]
    );

    return {
        // Permission data
        permissions,
        permissionEntities,
        permissionGroups,

        // Loading states
        isPermissionsLoaded,
        isPermissionsLoading: isPermissionsLoading || isQueryLoading,
        permissionsError,

        // Permission check methods
        hasPermission,
        hasAnyPermission,
        hasAllPermissions,

        // Role check methods
        hasRole,
        hasAnyRole,
        hasAllRoles,

        // Utility methods
        getPermissionsByGroup,
        refetchPermissions,
    };
}

export default usePermissions;
