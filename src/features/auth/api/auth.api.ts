/**
 * Auth API
 *
 * Raw API calls for the auth feature.
 */

import {
    ApiPermission,
    LoginData,
    LoginMagicLinkData,
    PhoneVerifyData,
    RegisterData,
    ResetPasswordData,
    User,
} from "@/auth/auth.types";
import { api, SingleResponse } from "@/shared/api";

export const authApi = {
    /**
     * Login
     */
    login: async (credentials?: LoginData): Promise<any> => {
        const response = await api.post<SingleResponse<User>>(
            "/login",
            credentials
        );
        if (response.error) {
            throw new Error(response.error.message || "Failed to login");
        }
        return response.data!;
    },

    /**
     * Login with magic link
     */
    loginWithMagicLink: async (data: LoginMagicLinkData) => {
        const response = await api.post<SingleResponse<User>>(
            "/magic/request",
            data
        );
        if (response.error) {
            throw new Error(
                response.error.message || "Failed to login with magic link"
            );
        }
        return response.data!;
    },

    /**
     * Verify magic link
     */
    verifyMagicLink: async (magicToken: string) => {
        const response = await api.get<SingleResponse<User>>(
            `/login/magic/${magicToken}/verify`
        );
        if (response.error) {
            throw new Error(
                response.error.message || "Failed to verify magic link"
            );
        }
        return response.data!;
    },

    /**
     * Sign up
     */
    signUp: async (data: RegisterData, role: "student" | "teacher") => {
        const response = await api.post<SingleResponse<User>>("/signup", {
            data,
            role,
        });
        if (response.error) {
            throw new Error(response.error.message || "Failed to sign up");
        }
        return response.data!;
    },

    /**
     * Logout
     */
    logout: async () => {
        const response = await api.post("/logout");
        if (response.error) {
            throw new Error(response.error.message || "Failed to logout");
        }
        return response.data!;
    },

    /**
     * Send sign up verification code
     */
    sendSignUpVerificationCode: async (email: string) => {
        const response = await api.post("/verify/email/send-otp", { email });
        if (response.error) {
            throw new Error(
                response.error.message || "Failed to send verification code"
            );
        }
        return response.data!;
    },

    /**
     * Verify sign up
     */
    verifySignUp: async (data: { email: string; code: string }) => {
        const response = await api.post<SingleResponse<{ message: string }>>(
            "/verify/email",
            data
        );
        if (response.error) {
            throw new Error(
                response.error.message || "Failed to verify sign up"
            );
        }
        return response.data!;
    },

    /**
     * Send phone verification code
     */
    sendPhoneVerificationCode: async (data: PhoneVerifyData) => {
        const response = await api.post<SingleResponse<{ message: string }>>(
            "/verify/phone/send-otp",
            data
        );
        if (response.error) {
            throw new Error(
                response.error.message || "Failed to send verification code"
            );
        }
        return response.data!;
    },

    /**
     * Verify phone
     */
    verifyPhone: async (data: PhoneVerifyData & { code: string }) => {
        const response = await api.post<SingleResponse<{ message: string }>>(
            "/verify/phone",
            data
        );
        if (response.error) {
            throw new Error(response.error.message || "Failed to verify phone");
        }
        return response.data!;
    },

    /**
     * Get profile
     */
    profile: async () => {
        const response = await api.get<SingleResponse<User>>("/auth/profile");
        if (response.error) {
            throw new Error(response.error.message || "Failed to get profile");
        }
        return response.data!;
    },

    /**
     * Update profile
     */
    updateProfile: async (data: FormData) => {
        const response = await api.post<SingleResponse<User>>(
            "/auth/profile",
            data
        );
        if (response.error) {
            throw new Error(
                response.error.message || "Failed to update profile"
            );
        }
        return response.data!;
    },

    /**
     * Send forgot password verification code
     */
    sendForgotPasswordVerificationCode: async (data: { email: string }) => {
        const response = await api.post<SingleResponse<{ message: string }>>(
            "/forgot-password",
            data
        );
        if (response.error) {
            throw new Error(
                response.error.message ||
                    "Failed to send forgot password verification code"
            );
        }
        return response.data!;
    },

    /**
     * Verify forgot password verification code
     */
    verifyForgotPasswordVerificationCode: async (data: {
        email: string;
        code: string;
    }) => {
        const response = await api.post<SingleResponse<{ message: string }>>(
            "/forgot-verify-code",
            data
        );
        if (response.error) {
            throw new Error(
                response.error.message || "Failed to verify forgot password"
            );
        }
        return response.data!;
    },

    /**
     * Reset password
     */
    resetPassword: async (data: ResetPasswordData) => {
        const response = await api.post<SingleResponse<ResetPasswordData>>(
            "/reset-password",
            data
        );
        if (response.error) {
            throw new Error(
                response.error.message || "Failed to reset password"
            );
        }
        return response.data!;
    },

    /**
     * Change password
     */
    changePassword: async (data: {
        currentPassword: string;
        newPassword: string;
        newPasswordConfirmation: string;
    }) => {
        const response = await api.put<SingleResponse<{ message: string }>>(
            "/change-password",
            data
        );
        if (response.error) {
            throw new Error(
                response.error.message || "Failed to change password"
            );
        }
        return response.data!;
    },

    /**
     * Get user permissions
     * Fetches all permissions assigned to the authenticated user
     */
    getPermissions: async (): Promise<SingleResponse<ApiPermission[]>> => {
        const response =
            await api.get<SingleResponse<ApiPermission[]>>("/auth/permissions");
        if (response.error) {
            throw new Error(
                response.error.message || "Failed to fetch permissions"
            );
        }
        return response.data!;
    },
} as const;
