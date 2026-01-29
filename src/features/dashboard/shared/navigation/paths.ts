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
    ticketsManagement: {
        root: () => `${getDashboardBasePath()}/tickets-management`,
        overview: () => `${getDashboardBasePath()}/tickets-management/overview`,
        teamStructure: () => `${getDashboardBasePath()}/tickets-management/team-structure`,
        manageTeam: () => `${getDashboardBasePath()}/tickets-management/team-structure/manage`,
        addLead: () =>
            `${getDashboardBasePath()}/tickets-management/team-structure/manage/lead/add`,
        editLead: (id: string) =>
            `${getDashboardBasePath()}/tickets-management/team-structure/manage/lead/${id}/edit`,
        changeLeadBlock: (id: string) =>
            `${getDashboardBasePath()}/tickets-management/team-structure/manage/lead/${id}/change-block`,
        convertLeadToAgent: (id: string) =>
            `${getDashboardBasePath()}/tickets-management/team-structure/manage/lead/${id}/convert`,
        addAgent: () =>
            `${getDashboardBasePath()}/tickets-management/team-structure/manage/agent/add`,
        editAgent: (id: string) =>
            `${getDashboardBasePath()}/tickets-management/team-structure/manage/agent/${id}/edit`,
        promoteAgentToLead: (id: string) =>
            `${getDashboardBasePath()}/tickets-management/team-structure/manage/agent/${id}/promote`,
        tickets: () => `${getDashboardBasePath()}/tickets-management/tickets`,
        distribution: () => `${getDashboardBasePath()}/tickets-management/distribution`,
        performance: () => `${getDashboardBasePath()}/tickets-management/performance`,
    },
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
