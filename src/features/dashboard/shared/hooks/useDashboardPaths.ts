/**
 * Hook for dynamic dashboard path resolution
 *
 * Returns paths that are resolved based on the current user's role.
 */

import { useMemo } from "react";
import { authStore } from "@/auth/auth.store";
import type { DashboardSection } from "../navigation/paths";

/**
 * Hook to get the current dashboard section based on user role
 */
export const useDashboardSection = (): DashboardSection => {
    const user = authStore.getState().user;

    return useMemo(() => {
        if (
            user?.role?.name === "admin" ||
            user?.role?.name === "super_admin"
        ) {
            return "admin";
        }
        return "classroom";
    }, [user?.role?.name]);
};

/**
 * Hook to get dynamic paths based on current user's dashboard section
 */
export const useDashboardPaths = () => {
    const section = useDashboardSection();
    const basePath = `/${section}`;

    return useMemo(
        () => ({
            section,
            basePath,
            profile: `${basePath}/profile`,
            chat: `${basePath}/chat`,
            certificates: `${basePath}/certificates`,
            reports: `${basePath}/reports`,
            // Settings is admin-only, but we include it for convenience
            settings: section === "admin" ? `${basePath}/settings` : null,
        }),
        [section, basePath]
    );
};

export default useDashboardPaths;
