/**
 * PermissionRoute Component
 *
 * A wrapper for lazy-loaded routes that applies permission checks.
 * Used by the route builder to wrap routes with permission requirements.
 *
 * @example
 * ```tsx
 * // In route config
 * {
 *     path: 'courses',
 *     lazy: () => import('./CoursesPage'),
 *     permissions: [PERMISSIONS.COURSE.VIEW_ANY],
 * }
 * ```
 */

import { Suspense, type ComponentType, type ReactNode } from "react";
import { ProtectedRoute } from "./ProtectedRoute";
import type { Permission } from "./auth.types";

interface PermissionRouteProps {
    component: ComponentType<unknown>;
    permissions?: Permission[];
    requireAllPermissions?: boolean;
    roles?: string[];
    fallback?: ReactNode;
    loadingFallback?: ReactNode;
}

export function PermissionRoute({
    component: Component,
    permissions,
    requireAllPermissions,
    roles,
    fallback,
    loadingFallback,
}: PermissionRouteProps) {
    const content = (
        <Suspense fallback={loadingFallback || null}>
            <Component />
        </Suspense>
    );

    // If no permissions or roles specified, render directly
    if (!permissions?.length && !roles?.length) {
        return content;
    }

    return (
        <ProtectedRoute
            permissions={permissions}
            requireAllPermissions={requireAllPermissions}
            roles={roles}
            fallback={fallback}
        >
            {content}
        </ProtectedRoute>
    );
}

export default PermissionRoute;
