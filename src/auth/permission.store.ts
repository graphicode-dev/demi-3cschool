/**
 * Permission Store
 *
 * Zustand store for managing user permissions state.
 * Separated from auth store for better separation of concerns.
 */

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { API_CONFIG } from "@/shared/api/config/env";
import type {
    ApiPermission,
    Permission,
    PermissionGroup,
    PermissionState,
    PermissionActions,
} from "./auth.types";

interface PermissionStoreState extends PermissionState, PermissionActions {
    _hasHydrated: boolean;
    setHasHydrated: (state: boolean) => void;
}

/**
 * Helper function to group permissions by their group property
 */
function groupPermissions(permissions: ApiPermission[]): PermissionGroup[] {
    const groupMap = new Map<string, ApiPermission[]>();

    permissions.forEach((permission) => {
        const existing = groupMap.get(permission.group) || [];
        groupMap.set(permission.group, [...existing, permission]);
    });

    return Array.from(groupMap.entries()).map(([group, perms]) => ({
        group,
        permissions: perms,
    }));
}

export const permissionStore = create<PermissionStoreState>()(
    persist(
        (set, get) => ({
            permissions: [],
            permissionEntities: [],
            permissionGroups: [],
            isPermissionsLoaded: false,
            isPermissionsLoading: false,
            permissionsError: null,
            _hasHydrated: false,

            setPermissions: (permissions: Permission[]) => {
                set({ permissions });
            },

            setPermissionEntities: (entities: ApiPermission[]) => {
                const permissionNames = entities.map((p) => p.name);
                const permissionGroups = groupPermissions(entities);
                set({
                    permissionEntities: entities,
                    permissions: permissionNames,
                    permissionGroups,
                    isPermissionsLoaded: true,
                    isPermissionsLoading: false,
                    permissionsError: null,
                });
            },

            setIsPermissionsLoaded: (loaded: boolean) => {
                set({ isPermissionsLoaded: loaded });
            },

            setIsPermissionsLoading: (loading: boolean) => {
                set({ isPermissionsLoading: loading });
            },

            setPermissionsError: (error: string | null) => {
                set({
                    permissionsError: error,
                    isPermissionsLoading: false,
                });
            },

            clearPermissions: () => {
                set({
                    permissions: [],
                    permissionEntities: [],
                    permissionGroups: [],
                    isPermissionsLoaded: false,
                    isPermissionsLoading: false,
                    permissionsError: null,
                });
            },

            setHasHydrated: (state: boolean) => {
                set({ _hasHydrated: state });
            },
        }),
        {
            name: API_CONFIG.PROJECT_NAME + "-permissions",
            partialize: (state) => ({
                permissions: state.permissions,
                permissionEntities: state.permissionEntities,
                permissionGroups: state.permissionGroups,
                isPermissionsLoaded: state.isPermissionsLoaded,
            }),
            onRehydrateStorage: () => (state) => {
                state?.setHasHydrated(true);
            },
        }
    )
);

/**
 * Selector hooks for common permission state access
 */
export const usePermissionState = () =>
    permissionStore((state) => ({
        permissions: state.permissions,
        permissionEntities: state.permissionEntities,
        permissionGroups: state.permissionGroups,
        isPermissionsLoaded: state.isPermissionsLoaded,
        isPermissionsLoading: state.isPermissionsLoading,
        permissionsError: state.permissionsError,
    }));

export const usePermissionActions = () =>
    permissionStore((state) => ({
        setPermissions: state.setPermissions,
        setPermissionEntities: state.setPermissionEntities,
        setIsPermissionsLoaded: state.setIsPermissionsLoaded,
        setIsPermissionsLoading: state.setIsPermissionsLoading,
        setPermissionsError: state.setPermissionsError,
        clearPermissions: state.clearPermissions,
    }));
