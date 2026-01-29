/**
 * ProtectedRoute Component
 *
 * Enhanced route protection with role and permission checks.
 * Integrates with the auth store and usePermissions hook.
 *
 * @example
 * ```tsx
 * import { PERMISSIONS } from '@/auth';
 *
 * <ProtectedRoute
 *     requireAuth={true}
 *     roles={['admin', 'teacher']}
 *     permissions={[PERMISSIONS.COURSE.VIEW]}
 * >
 *     <CoursesPage />
 * </ProtectedRoute>
 * ```
 */

import { Navigate, To, useLocation } from "react-router-dom";
import { authStore } from "@/auth/auth.store";
import { usePermissions } from "./usePermissions";
import type { ProtectedRouteProps } from "./auth.types";
import UnauthorizedPage from "@/shared/pages/UnauthorizedPage";
import { paths } from "@/router";

/**
 * Protected route component with auth, role, and permission checks
 */
export function ProtectedRoute({
    children,
    requireAuth = true,
    roles,
    permissions,
    requireAllPermissions,
    fallback,
    redirectTo,
    loadingFallback,
}: ProtectedRouteProps) {
    const location = useLocation();
    const { user, isAuthenticated } = authStore();
    const {
        hasAnyRole,
        hasAllPermissions: checkAllPermissions,
        hasAnyPermission,
        isPermissionsLoading,
        isPermissionsLoaded,
    } = usePermissions();

    // Check authentication
    if (requireAuth && !isAuthenticated) {
        const loginPath = redirectTo || (paths.auth.login as To);
        return <Navigate to={loginPath} replace state={{ from: location }} />;
    }

    // Show loading state while permissions are being fetched
    if (
        isAuthenticated &&
        permissions &&
        permissions.length > 0 &&
        isPermissionsLoading &&
        !isPermissionsLoaded
    ) {
        if (loadingFallback) {
            return <>{loadingFallback}</>;
        }
        // Default loading - can be customized
        return null;
    }

    // Check roles if specified
    if (roles && roles.length > 0) {
        if (!user || !hasAnyRole(roles)) {
            return fallback ? <>{fallback}</> : <UnauthorizedPage />;
        }
    }

    // Check permissions if specified
    if (permissions && permissions.length > 0) {
        const hasRequiredPermissions =
            requireAllPermissions !== false
                ? checkAllPermissions(permissions)
                : hasAnyPermission(permissions);

        if (!hasRequiredPermissions) {
            return fallback ? <>{fallback}</> : <UnauthorizedPage />;
        }
    }

    return <>{children}</>;
}

export default ProtectedRoute;
