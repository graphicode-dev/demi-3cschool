/**
 * PermissionProvider Component
 *
 * Initializes and manages permission state for the application.
 * Should wrap the app after authentication is established.
 *
 * @example
 * ```tsx
 * <PermissionProvider>
 *     <App />
 * </PermissionProvider>
 * ```
 */

import { useEffect, type ReactNode } from "react";
import { authStore } from "@/auth/auth.store";
import { permissionStore } from "@/auth/permission.store";
import { usePermissionsQuery } from "@/features/auth/api/auth.queries";

interface PermissionProviderProps {
    children: ReactNode;
    loadingFallback?: ReactNode;
    errorFallback?: ReactNode;
}

export function PermissionProvider({
    children,
    loadingFallback,
    errorFallback,
}: PermissionProviderProps) {
    const isAuthenticated = authStore((state) => state.isAuthenticated);
    const user = authStore((state) => state.user);

    const {
        isPermissionsLoaded,
        isPermissionsLoading,
        permissionsError,
        setPermissionEntities,
        setIsPermissionsLoading,
        setPermissionsError,
        clearPermissions,
    } = permissionStore();

    // Fetch permissions when authenticated
    const {
        data: permissionsData,
        isLoading: isQueryLoading,
        error: queryError,
        isSuccess,
    } = usePermissionsQuery({
        enabled: isAuthenticated && !isPermissionsLoaded,
    });

    // Sync loading state
    useEffect(() => {
        setIsPermissionsLoading(isQueryLoading);
    }, [isQueryLoading, setIsPermissionsLoading]);

    // Handle error
    useEffect(() => {
        if (queryError) {
            setPermissionsError(
                queryError instanceof Error
                    ? queryError.message
                    : "Failed to fetch permissions"
            );
        }
    }, [queryError, setPermissionsError]);

    // Store permissions on success
    useEffect(() => {
        if (isSuccess && permissionsData?.data) {
            setPermissionEntities(permissionsData.data);
        }
    }, [isSuccess, permissionsData, setPermissionEntities]);

    // Clear permissions on logout - use stable reference from store
    useEffect(() => {
        if (!isAuthenticated) {
            permissionStore.getState().clearPermissions();
        }
    }, [isAuthenticated]);

    // If user has permissions in their object (from login), use those
    useEffect(() => {
        if (
            user?.permissions &&
            user.permissions.length > 0 &&
            !isPermissionsLoaded
        ) {
            // Permissions are already in user object, mark as loaded
            permissionStore.setState({
                permissions: user.permissions,
                isPermissionsLoaded: true,
                isPermissionsLoading: false,
            });
        }
    }, [user?.permissions, isPermissionsLoaded]);

    // Show loading state if needed
    if (
        isAuthenticated &&
        (isPermissionsLoading || isQueryLoading) &&
        !isPermissionsLoaded
    ) {
        if (loadingFallback) {
            return <>{loadingFallback}</>;
        }
    }

    // Show error state if needed
    if (permissionsError && errorFallback) {
        return <>{errorFallback}</>;
    }

    return <>{children}</>;
}

export default PermissionProvider;
