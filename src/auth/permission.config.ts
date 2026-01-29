/**
 * Permission Configuration
 *
 * Reusable permission configuration pattern for features.
 * Follows SOLID principles - Single Responsibility for each config.
 *
 * @example
 * ```ts
 * // Define feature permissions
 * const coursePermissions = createResourcePermissions('course');
 *
 * // Use in routes
 * { path: 'courses', permissions: [coursePermissions.viewAny] }
 *
 * // Use in navigation
 * { href: '/courses', permissions: [coursePermissions.viewAny] }
 * ```
 */

import { PERMISSIONS } from "./permissions.constants";

// ============================================================================
// Types
// ============================================================================

/**
 * Standard CRUD permission set for a resource
 */
export interface ResourcePermissions {
    viewAny: string;
    view: string;
    create: string;
    update: string;
    delete: string;
    restore?: string;
    forceDelete?: string;
}

/**
 * Permission configuration for a feature
 */
export interface FeaturePermissionConfig {
    /** Feature identifier */
    featureId: string;
    /** Resource permissions map */
    resources: Record<string, ResourcePermissions>;
}

/**
 * Route permission configuration
 */
export interface RoutePermissionConfig {
    /** Required permissions (user must have at least one) */
    permissions?: string[];
    /** Require all permissions instead of any */
    requireAll?: boolean;
    /** Required roles */
    roles?: string[];
}

/**
 * Action permission configuration for UI components
 */
export interface ActionPermissionConfig {
    /** Permission required for this action */
    permission: string;
    /** Fallback behavior when no permission */
    fallbackBehavior?: "hide" | "disable";
}

// ============================================================================
// Permission Builders
// ============================================================================

/**
 * Creates a standard CRUD permission set for a resource
 * Maps to the API permission naming convention: resource.action
 */
export function createResourcePermissions(
    resourceKey: keyof typeof PERMISSIONS
): ResourcePermissions {
    const resource = PERMISSIONS[resourceKey] as Record<string, string>;
    const key = resourceKey.toLowerCase().replace(/_/g, "_");

    return {
        viewAny: resource.VIEW_ANY ?? `${key}.viewAny`,
        view: resource.VIEW ?? `${key}.view`,
        create: resource.CREATE ?? `${key}.create`,
        update: resource.UPDATE ?? `${key}.update`,
        delete: resource.DELETE ?? `${key}.delete`,
        restore: resource.RESTORE,
        forceDelete: resource.FORCE_DELETE,
    };
}

/**
 * Creates permission config for list/view/create/edit/delete actions
 */
export function createCrudPermissionConfig(permissions: ResourcePermissions) {
    return {
        list: { permissions: [permissions.viewAny] },
        view: { permissions: [permissions.view] },
        create: { permissions: [permissions.create] },
        edit: { permissions: [permissions.update] },
        delete: { permissions: [permissions.delete] },
        restore: permissions.restore
            ? { permissions: [permissions.restore] }
            : undefined,
        forceDelete: permissions.forceDelete
            ? { permissions: [permissions.forceDelete] }
            : undefined,
    };
}

// ============================================================================
// Learning Feature Permissions
// ============================================================================

export const learningPermissions = {
    course: createResourcePermissions("COURSE"),
    level: createResourcePermissions("LEVEL"),
    lesson: createResourcePermissions("LESSON"),
    levelQuiz: createResourcePermissions("LEVEL_QUIZ"),
    lessonQuiz: createResourcePermissions("LESSON_QUIZ"),
    lessonVideo: createResourcePermissions("LESSON_VIDEO"),
    lessonAssignment: createResourcePermissions("LESSON_ASSIGNMENT"),
    lessonMaterial: createResourcePermissions("LESSON_MATERIAL"),
} as const;

// ============================================================================
// Groups Feature Permissions
// ============================================================================

export const groupsPermissions = {
    group: createResourcePermissions("GROUP"),
    groupSession: createResourcePermissions("GROUP_SESSION"),
    studentAttendance: createResourcePermissions("STUDENT_ATTENDANCE"),
    teacherAttendance: createResourcePermissions("TEACHER_ATTENDANCE"),
} as const;

// ============================================================================
// Sales Feature Permissions
// ============================================================================

export const salesPermissions = {
    levelPrice: createResourcePermissions("LEVEL_PRICE"),
    coupon: createResourcePermissions("COUPON"),
    subscription: createResourcePermissions("LEVEL_SUBSCRIPTION"),
    installment: createResourcePermissions("INSTALLMENT"),
    installmentPayment: createResourcePermissions("INSTALLMENT_PAYMENT"),
} as const;

// ============================================================================
// System Management Permissions
// ============================================================================

export const systemPermissions = {
    user: createResourcePermissions("USER"),
    role: createResourcePermissions("ROLE"),
    permission: createResourcePermissions("PERMISSION"),
    staff: createResourcePermissions("STAFF"),
    audit: createResourcePermissions("AUDIT"),
    notification: createResourcePermissions("NOTIFICATION"),
    setting: createResourcePermissions("SETTING"),
    faq: createResourcePermissions("FAQ"),
} as const;

// ============================================================================
// Support Feature Permissions
// ============================================================================

export const supportPermissions = {
    ticket: createResourcePermissions("SUPPORT_TICKETS"),
    ticketReply: createResourcePermissions("SUPPORT_TICKET_REPLY"),
} as const;

// ============================================================================
// Account Feature Permissions
// ============================================================================

export const accountPermissions = {
    conversation: createResourcePermissions("CONVERSATION"),
    message: createResourcePermissions("MESSAGE"),
    notification: createResourcePermissions("NOTIFICATION"),
    setting: createResourcePermissions("SETTING"),
    certificate: createResourcePermissions("CERTIFICATE"),
    report: createResourcePermissions("REPORT"),
} as const;

// ============================================================================
// Dashboard Permissions
// ============================================================================

export const dashboardPermissions = {
    view: PERMISSIONS.DASHBOARD.VIEW,
    stats: PERMISSIONS.DASHBOARD.STATS,
} as const;

// ============================================================================
// Eligible Students Permissions
// ============================================================================

export const eligibleStudentsPermissions = {
    viewAny: PERMISSIONS.ELIGIBLE_STUDENT.VIEW_ANY,
} as const;

// ============================================================================
// All Feature Permissions Export
// ============================================================================

export const featurePermissions = {
    learning: learningPermissions,
    groups: groupsPermissions,
    sales: salesPermissions,
    system: systemPermissions,
    support: supportPermissions,
    account: accountPermissions,
    dashboard: dashboardPermissions,
} as const;
