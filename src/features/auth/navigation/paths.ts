/**
 * Reports Feature - Path Builders
 *
 * Centralized, type-safe path builders for the reports feature.
 * Import these instead of hardcoding path strings.
 *
 * @example
 * ```ts
 * import { authPaths } from '@/features/auth/paths';
 *
 * navigate(authPaths.login());
 * navigate(authPaths.magicLink(token));
 * navigate(authPaths.signup());
 * navigate(authPaths.resetPassword());
 * ```
 */

import { registerFeaturePaths } from "@/router/paths.registry";

const BASE = "/auth";

export const authPaths = registerFeaturePaths("auth", {
    /**
     * Login (index route)
     */
    login: () => `${BASE}/login`,

    /**
     * Magic link verification
     */
    magicLink: (token: string) => `${BASE}/magic-link?token=${token}`,

    /**
     * Sign up
     */
    signup: () => `${BASE}/signup`,

    /**
     * Reset password
     */
    resetPassword: () => `${BASE}/reset-password`,
});

export type AuthPaths = typeof authPaths;
