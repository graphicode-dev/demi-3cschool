/**
 * Auth Feature - Routes
 *
 * Route configuration for the auth feature.
 * Uses the new FeatureRouteModule format.
 *
 */

import type { FeatureRouteModule } from "@/router/routes.types";

/**
 * Auth feature route module
 *
 * Note: Use i18n keys as strings. Translations are resolved at runtime
 * by components that consume these meta values.
 */
export const authRoutes: FeatureRouteModule = {
    id: "auth",
    name: "Auth",
    basePath: "/auth",
    layout: "auth",
    routes: {
        meta: {
            requiresAuth: false,
        },
        children: [
            {
                path: "login",
                lazy: () => import("../pages/Login"),
                meta: {
                    titleKey: "auth:auth.meta.login",
                },
                handle: {
                    crumb: "auth:auth.meta.login",
                },
            },
            {
                path: "magic-link",
                lazy: () => import("../pages/VerifyMagicLink"),
                meta: {
                    titleKey: "auth:auth.meta.verifyMagicLink",
                },
                handle: {
                    crumb: "auth:auth.meta.verifyMagicLink",
                },
            },
            {
                path: "signup",
                lazy: () => import("../pages/SignUp"),
                meta: {
                    titleKey: "auth:auth.meta.signup",
                },
                handle: {
                    crumb: "auth:auth.meta.signup",
                },
            },
            {
                path: "reset-password",
                lazy: () => import("../pages/ResetPassword"),
                meta: {
                    titleKey: "auth:auth.meta.resetPassword",
                },
                handle: {
                    crumb: "auth:auth.meta.resetPassword",
                },
            },
        ],
    },
};

export default authRoutes;
