/**
 * Auth Module - Public Exports
 *
 * Centralized auth and permissions system.
 *
 * @example
 * ```tsx
 * import {
 *     ProtectedRoute,
 *     HasPermission,
 *     PermissionProvider,
 *     usePermissions,
 *     tokenService,
 *     PERMISSIONS,
 * } from '@/auth';
 *
 * // Route protection
 * <ProtectedRoute roles={['admin']} permissions={[PERMISSIONS.COURSE.VIEW]}>
 *     <CoursesPage />
 * </ProtectedRoute>
 *
 * // Conditional rendering
 * <HasPermission permission={PERMISSIONS.COURSE.CREATE}>
 *     <CreateButton />
 * </HasPermission>
 *
 * // Hook usage
 * const { hasPermission } = usePermissions();
 * if (hasPermission(PERMISSIONS.COURSE.UPDATE)) { ... }
 * ```
 */

// Types
export type {
    Permission,
    RolePermissions,
    TokenPair,
    JwtPayload,
    AuthContextValue,
    ProtectedRouteProps,
    HasPermissionProps,
    ApiPermission,
    PermissionGroup,
    PermissionState,
    PermissionActions,
} from "./auth.types";

// Permission Constants
export { PERMISSIONS, PERMISSION_GROUPS } from "./permissions.constants";
export type {
    PermissionValue,
    PermissionGroupName,
} from "./permissions.constants";

// Stores
export { authStore } from "./auth.store";
export {
    permissionStore,
    usePermissionState,
    usePermissionActions,
} from "./permission.store";

// Token Service
export { tokenService } from "./tokenService";

// Hooks
export { usePermissions } from "./usePermissions";
export {
    useFilteredNavigation,
    useNavItemVisible,
} from "./useFilteredNavigation";

// Components
export { ProtectedRoute } from "./ProtectedRoute";
export { HasPermission } from "./HasPermission";
export { PermissionProvider } from "./PermissionProvider";
export { PermissionRoute } from "./PermissionRoute";
export { AuthSyncProvider } from "./AuthSyncProvider";
export {
    PermissionButton,
    PermissionLink,
    PermissionWrapper,
    useActionPermissions,
} from "./PermissionAction";

// Permission Config
export {
    createResourcePermissions,
    createCrudPermissionConfig,
    learningPermissions,
    groupsPermissions,
    salesPermissions,
    systemPermissions,
    supportPermissions,
    accountPermissions,
    dashboardPermissions,
    eligibleStudentsPermissions,
    featurePermissions,
} from "./permission.config";
export type {
    ResourcePermissions,
    FeaturePermissionConfig,
    RoutePermissionConfig,
    ActionPermissionConfig,
} from "./permission.config";
