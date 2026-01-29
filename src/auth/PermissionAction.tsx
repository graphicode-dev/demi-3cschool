/**
 * Permission Action Components
 *
 * Reusable components for permission-controlled actions.
 * Follows Single Responsibility - each handles one type of action.
 *
 * @example
 * ```tsx
 * import { PermissionButton, PermissionLink } from '@/auth';
 * import { PERMISSIONS } from '@/auth';
 *
 * // Button that only shows if user can create courses
 * <PermissionButton
 *     permission={PERMISSIONS.COURSE.CREATE}
 *     onClick={handleCreate}
 * >
 *     Create Course
 * </PermissionButton>
 *
 * // Link that's disabled without permission
 * <PermissionLink
 *     permission={PERMISSIONS.COURSE.UPDATE}
 *     to={`/courses/edit/${id}`}
 *     fallbackBehavior="disable"
 * >
 *     Edit
 * </PermissionLink>
 * ```
 */

import { type ReactNode, type ButtonHTMLAttributes, forwardRef } from "react";
import { Link, type LinkProps } from "react-router-dom";
import { usePermissions } from "./usePermissions";
import type { Permission } from "./auth.types";

// ============================================================================
// Types
// ============================================================================

type FallbackBehavior = "hide" | "disable";

interface BasePermissionProps {
    permission: Permission | Permission[];
    requireAll?: boolean;
    fallbackBehavior?: FallbackBehavior;
}

// ============================================================================
// PermissionButton
// ============================================================================

interface PermissionButtonProps
    extends BasePermissionProps, ButtonHTMLAttributes<HTMLButtonElement> {
    children: ReactNode;
}

export const PermissionButton = forwardRef<
    HTMLButtonElement,
    PermissionButtonProps
>(
    (
        {
            permission,
            requireAll = false,
            fallbackBehavior = "hide",
            children,
            disabled,
            ...props
        },
        ref
    ) => {
        const { hasPermission, hasAnyPermission, hasAllPermissions } =
            usePermissions();

        const permissions = Array.isArray(permission)
            ? permission
            : [permission];
        const hasAccess = requireAll
            ? hasAllPermissions(permissions)
            : permissions.length === 1
              ? hasPermission(permissions[0])
              : hasAnyPermission(permissions);

        if (!hasAccess && fallbackBehavior === "hide") {
            return null;
        }

        return (
            <button ref={ref} disabled={disabled || !hasAccess} {...props}>
                {children}
            </button>
        );
    }
);

PermissionButton.displayName = "PermissionButton";

// ============================================================================
// PermissionLink
// ============================================================================

interface PermissionLinkProps
    extends BasePermissionProps, Omit<LinkProps, "to"> {
    to: string;
    children: ReactNode;
}

export const PermissionLink = forwardRef<
    HTMLAnchorElement,
    PermissionLinkProps
>(
    (
        {
            permission,
            requireAll = false,
            fallbackBehavior = "hide",
            to,
            children,
            className,
            ...props
        },
        ref
    ) => {
        const { hasPermission, hasAnyPermission, hasAllPermissions } =
            usePermissions();

        const permissions = Array.isArray(permission)
            ? permission
            : [permission];
        const hasAccess = requireAll
            ? hasAllPermissions(permissions)
            : permissions.length === 1
              ? hasPermission(permissions[0])
              : hasAnyPermission(permissions);

        if (!hasAccess && fallbackBehavior === "hide") {
            return null;
        }

        if (!hasAccess && fallbackBehavior === "disable") {
            return (
                <span
                    className={`${className || ""} pointer-events-none opacity-50`}
                    aria-disabled="true"
                >
                    {children}
                </span>
            );
        }

        return (
            <Link ref={ref} to={to} className={className} {...props}>
                {children}
            </Link>
        );
    }
);

PermissionLink.displayName = "PermissionLink";

// ============================================================================
// PermissionWrapper
// ============================================================================

interface PermissionWrapperProps extends BasePermissionProps {
    children: ReactNode;
    fallback?: ReactNode;
}

export function PermissionWrapper({
    permission,
    requireAll = false,
    fallbackBehavior = "hide",
    children,
    fallback,
}: PermissionWrapperProps) {
    const { hasPermission, hasAnyPermission, hasAllPermissions } =
        usePermissions();

    const permissions = Array.isArray(permission) ? permission : [permission];
    const hasAccess = requireAll
        ? hasAllPermissions(permissions)
        : permissions.length === 1
          ? hasPermission(permissions[0])
          : hasAnyPermission(permissions);

    if (!hasAccess) {
        if (fallbackBehavior === "hide") {
            return fallback ? <>{fallback}</> : null;
        }
        // For disable behavior, wrap children with disabled styling
        return (
            <div
                className="pointer-events-none opacity-50"
                aria-disabled="true"
            >
                {children}
            </div>
        );
    }

    return <>{children}</>;
}

// ============================================================================
// useActionPermissions Hook
// ============================================================================

interface ActionPermissions {
    canView: boolean;
    canCreate: boolean;
    canEdit: boolean;
    canDelete: boolean;
    canRestore?: boolean;
    canForceDelete?: boolean;
}

/**
 * Hook for checking CRUD permissions on a resource
 */
export function useActionPermissions(resourcePermissions: {
    viewAny: string;
    view: string;
    create: string;
    update: string;
    delete: string;
    restore?: string;
    forceDelete?: string;
}): ActionPermissions {
    const { hasPermission } = usePermissions();

    return {
        canView:
            hasPermission(resourcePermissions.viewAny) ||
            hasPermission(resourcePermissions.view),
        canCreate: hasPermission(resourcePermissions.create),
        canEdit: hasPermission(resourcePermissions.update),
        canDelete: hasPermission(resourcePermissions.delete),
        canRestore: resourcePermissions.restore
            ? hasPermission(resourcePermissions.restore)
            : undefined,
        canForceDelete: resourcePermissions.forceDelete
            ? hasPermission(resourcePermissions.forceDelete)
            : undefined,
    };
}
