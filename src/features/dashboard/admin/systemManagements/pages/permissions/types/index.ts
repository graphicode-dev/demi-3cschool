// ============================================================================
// Permission Types
// ============================================================================

export interface Permission {
    id: number;
    name: string;
    caption: string;
    group: string;
    scope?: string;
    scopeLabel?: string;
    createdAt: string;
    updatedAt: string;
}

export interface PermissionGroup {
    name: string;
    permissions: Permission[];
}

export interface PaginatedPermissionsData {
    perPage: number;
    currentPage: number;
    lastPage: number;
    nextPageUrl: string | null;
    total: number;
    items: PermissionGroup[];
}

// ============================================================================
// Role Permission Types
// ============================================================================

export interface RolePermissionGroup {
    group: string;
    permissions: Permission[];
}

export interface RolePermissionsData {
    id: number;
    name: string;
    caption: string;
    createdAt: string;
    updatedAt: string;
    permissions: RolePermissionGroup[];
}

// ============================================================================
// User Permission Types
// ============================================================================

export interface UserPermissionRole {
    id: number;
    name: string;
    caption: string;
}

export interface UserPermissionsData {
    userId: number;
    userName: string;
    role: UserPermissionRole;
    rolePermissions: RolePermissionGroup[];
    userPermissions: Permission[];
}

// ============================================================================
// Mutation Payloads
// ============================================================================

export interface AssignUserPermissionsPayload {
    permission_ids: number[];
}
