/**
 * HasPermission Component
 *
 * Conditional rendering based on user permissions.
 * Shows children only if user has required permission(s).
 *
 * @example
 * ```tsx
 * // Single permission
 * <HasPermission permission="courses.create">
 *     <CreateCourseButton />
 * </HasPermission>
 *
 * // Multiple permissions (any)
 * <HasPermission permission={['courses.edit', 'courses.delete']}>
 *     <ActionsMenu />
 * </HasPermission>
 *
 * // Multiple permissions (all required)
 * <HasPermission permission={['courses.edit', 'courses.publish']} requireAll>
 *     <PublishButton />
 * </HasPermission>
 *
 * // With fallback
 * <HasPermission permission="courses.delete" fallback={<DisabledButton />}>
 *     <DeleteButton />
 * </HasPermission>
 * ```
 */

import { usePermissions } from "./usePermissions";
import type { HasPermissionProps } from "./auth.types";

/**
 * Conditional render based on permissions
 */
export function HasPermission({
    permission,
    requireAll = false,
    children,
    fallback = null,
}: HasPermissionProps) {
    const { hasPermission, hasAnyPermission, hasAllPermissions } =
        usePermissions();

    const permissions = Array.isArray(permission) ? permission : [permission];

    const hasAccess = requireAll
        ? hasAllPermissions(permissions)
        : permissions.length === 1
          ? hasPermission(permissions[0])
          : hasAnyPermission(permissions);

    if (hasAccess) {
        return <>{children}</>;
    }

    return <>{fallback}</>;
}

export default HasPermission;
