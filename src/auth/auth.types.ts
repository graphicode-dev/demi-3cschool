/**
 * Auth Module - Type Definitions
 *
 * Types for authentication and authorization.
 */

import * as React from "react";
import { UseMutationResult } from "@tanstack/react-query";
import { NavigateFunction } from "react-router-dom";
import { Governorate, Toast, Grade } from "@/shared/types";
import { AcceptanceExamStatus } from "@/features/dashboard/shared/acceptanceTest/types";

// ============================================================================
// Auth Types
// ============================================================================

export type CommonFormProps<T> = {
    StarICon?: () => React.JSX.Element;
    mutationFn: () => UseMutationResult<any, any, T, unknown>;
    addToast?: (toast: Omit<Toast, "id">) => string;
    navigate?: NavigateFunction;
};

export type CommonLoginFormProps<T> = {
    mutationFn: () => UseMutationResult<any, any, T, unknown>;
    addToast?: (toast: Omit<Toast, "id">) => string;
    navigate?: NavigateFunction;
    isPopup?: boolean;
};

export enum AuthSteps {
    Login = "login",
    LoginMagicLink = "loginMagicLink",

    SignUp = "signUp",
    SignUpVerify = "signUpVerify",
    SignUpComplete = "signUpComplete",

    PhoneVerify = "phoneVerify",
    PhoneVerifyComplete = "phoneVerifyComplete",

    EmailReset = "emailReset",
    EmailResetVerify = "emailResetVerify",
    PasswordReset = "passwordReset",
    PasswordResetComplete = "passwordResetComplete",
}

export type AuthState = {
    user: User | null;
    isAuthenticated: boolean;
    authStep: AuthSteps | null;
    signupEmail: string | null;
    resetEmail: string | null;
    error: string | null;
    isLoading: boolean;

    setIsLoading: (isLoading: boolean) => void;
    setError: (error: string | null) => void;
    setIsAuthenticated: (isAuthenticated: boolean) => void;
    setAuthStep: (authStep: AuthSteps | null) => void;
    setUser: (user: User | null) => void;
    setSignupEmail: (email: string | null) => void;
    setResetEmail: (email: string | null) => void;
};

export type LoginData = {
    email: string;
    password: string;
};

export type LoginMagicLinkData = {
    email: string;
};

export type RegisterData = {
    name: string;
    email: string;
    password: string;
    passwordConfirmation: string;
};

export type ResetEmailData = {
    email: string;
};

export type ResetVerifyData = {
    email: string;
    code: string;
};

export type ResetPasswordData = {
    verifyToken: string;
    password: string;
};
export type PhoneVerifyData = {
    phone_code: string;
    phone_number: string;
};

// ============================================================================
// User Types
// ============================================================================

export type Roles = "admin" | "student" | "teacher";

export type Role = {
    id: string;
    name: string;
    caption: string;
    createdAt: string;
    updatedAt: string;
};

export type UserInformation = {
    id: string;
    phoneCode: string;
    phoneNumber: string;
    dateOfBirth: string;
    gender: string;
    grade?: Grade;
    governorate: Governorate;
    nationality: string;
    address: string;
    city: string;
    state: string;
    country: string;
    postalCode: string;
    emergencyContactName: string;
    emergencyContactPhone: string;
    bio: string;
    socialLinks: string;
    acceptanceExam?: AcceptanceExamStatus;
    isVerified: boolean;
    verifiedAt: string;
    createdAt: string;
    updatedAt: string;
};

export type User = {
    id: string;
    name: string;
    email: string;
    image?: string;
    role?: Role;
    userInformation?: UserInformation;
    userServices?: any[];
    permissions?: string[];
    emailVerified?: boolean;
    phoneVerified?: boolean;
    createdAt?: string;
    updatedAt?: string;
    token: string;
    // Convenience properties (flattened from userInformation)
    isActive?: boolean;
    phoneCode?: string;
    phoneNumber?: string;
    gender?: string;
    grade?: Grade;
    bio?: string;
    specialization?: string;
};

// ============================================================================
// Permission Types
// ============================================================================

/**
 * API Permission entity from /auth/permissions endpoint
 */
export interface ApiPermission {
    id: number;
    group: string;
    name: string;
    caption: string;
    createdAt: string;
    updatedAt: string;
}

/**
 * Grouped permissions for UI display
 */
export interface PermissionGroup {
    group: string;
    permissions: ApiPermission[];
}

/**
 * Permission string format: "resource.action"
 * Now accepts any string to support dynamic permissions from API
 */
export type Permission = string;

/**
 * Role with permissions - supports any role name
 */
export type RolePermissions = Record<string, Permission[]>;

/**
 * Permission state for the auth store
 */
export interface PermissionState {
    permissions: Permission[];
    permissionEntities: ApiPermission[];
    permissionGroups: PermissionGroup[];
    isPermissionsLoaded: boolean;
    isPermissionsLoading: boolean;
    permissionsError: string | null;
}

/**
 * Permission state actions
 */
export interface PermissionActions {
    setPermissions: (permissions: Permission[]) => void;
    setPermissionEntities: (entities: ApiPermission[]) => void;
    setIsPermissionsLoaded: (loaded: boolean) => void;
    setIsPermissionsLoading: (loading: boolean) => void;
    setPermissionsError: (error: string | null) => void;
    clearPermissions: () => void;
}

// ============================================================================
// Token Types
// ============================================================================

/**
 * Token pair from auth response
 */
export interface TokenPair {
    accessToken: string;
    refreshToken?: string;
    expiresIn?: number;
}

/**
 * Decoded JWT payload
 */
export interface JwtPayload {
    sub: string;
    exp: number;
    iat: number;
    permissions?: Permission[];
}

// ============================================================================
// Auth State Types
// ============================================================================

/**
 * Auth context value
 */
export interface AuthContextValue {
    user: User | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    permissions: Permission[];
    login: (email: string, password: string) => Promise<void>;
    logout: () => Promise<void>;
    refreshAuth: () => Promise<void>;
}

/**
 * Protected route props
 */
export interface ProtectedRouteProps {
    children: React.ReactNode;
    requireAuth?: boolean;
    roles?: string[];
    permissions?: Permission[];
    /** Require all permissions (true) or any permission (false) */
    requireAllPermissions?: boolean;
    fallback?: React.ReactNode;
    redirectTo?: string;
    /** Loading component while auth state is being determined */
    loadingFallback?: React.ReactNode;
}

/**
 * Has permission props
 */
export interface HasPermissionProps {
    permission: Permission | Permission[];
    requireAll?: boolean;
    children: React.ReactNode;
    fallback?: React.ReactNode;
}
