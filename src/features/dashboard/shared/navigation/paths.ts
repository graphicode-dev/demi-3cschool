/**
 * Shared Dashboard Features - Dynamic Path Definitions
 *
 * Paths that change based on user role (admin vs classroom).
 */

import { authStore } from "@/auth/auth.store";
import { CLASSROOM_PATH } from "../../classroom/navigation/constant";
import { ADMIN_PATH } from "../../admin/navigation/constant";

export type DashboardSection = "admin" | "classroom";

/**
 * Get the current dashboard section based on user role
 */
export const getDashboardSection = (): DashboardSection => {
    const user = authStore.getState().user;
    // Admin users go to admin section, others go to classroom
    // Check role.name since Role is an object with name property
    if (user?.role?.name === "admin" || user?.role?.name === "super_admin") {
        return "admin";
    }
    return "classroom";
};

/**
 * Get the base path for the current user's dashboard section
 */
export const getDashboardBasePath = (): string => {
    const section = getDashboardSection();
    // Classroom uses /classroom, admin uses /admin
    if (section === "classroom") {
        return CLASSROOM_PATH;
    }
    return ADMIN_PATH;
};

/**
 * Shared feature paths - dynamically resolved based on user role
 */
export const sharedPaths = {
    profile: () => `${getDashboardBasePath()}/profile`,
    chat: () => `${getDashboardBasePath()}/chat`,
    certificates: () => `${getDashboardBasePath()}/certificates`,
    reports: () => `${getDashboardBasePath()}/reports`,
} as const;

/**
 * Static paths for specific sections (when you need to link to a specific section)
 */
export const staticPaths = {
    classroom: {
        profile: () => `${CLASSROOM_PATH}/profile`,
        chat: () => `${CLASSROOM_PATH}/chat`,
        certificates: () => `${CLASSROOM_PATH}/certificates`,
        reports: () => `${CLASSROOM_PATH}/reports`,
    },
    admin: {
        profile: () => `${ADMIN_PATH}/profile`,
        chat: () => `${ADMIN_PATH}/chat`,
        certificates: () => `${ADMIN_PATH}/certificates`,
        reports: () => `${ADMIN_PATH}/reports`,
        settings: () => `${ADMIN_PATH}/settings`,
    },
} as const;

export type SharedPaths = typeof sharedPaths;
