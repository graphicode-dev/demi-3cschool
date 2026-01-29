/**
 * Shared Dashboard Features - Dynamic Path Definitions
 *
 * Paths that change based on user role (admin vs classroom).
 */

import { authStore } from "@/auth/auth.store";

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
    return `/dashboard/${section}`;
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
        root: () => `/dashboard/tickets-management`,
        overview: () => `/dashboard/tickets-management/overview`,
        teamStructure: () => `/dashboard/tickets-management/team-structure`,
        manageTeam: () => `/dashboard/tickets-management/team-structure/manage`,
        addLead: () =>
            `/dashboard/tickets-management/team-structure/manage/lead/add`,
        editLead: (id: string) =>
            `/dashboard/tickets-management/team-structure/manage/lead/${id}/edit`,
        changeLeadBlock: (id: string) =>
            `/dashboard/tickets-management/team-structure/manage/lead/${id}/change-block`,
        convertLeadToAgent: (id: string) =>
            `/dashboard/tickets-management/team-structure/manage/lead/${id}/convert`,
        addAgent: () =>
            `/dashboard/tickets-management/team-structure/manage/agent/add`,
        editAgent: (id: string) =>
            `/dashboard/tickets-management/team-structure/manage/agent/${id}/edit`,
        promoteAgentToLead: (id: string) =>
            `/dashboard/tickets-management/team-structure/manage/agent/${id}/promote`,
        tickets: () => `/dashboard/tickets-management/tickets`,
        distribution: () => `/dashboard/tickets-management/distribution`,
        performance: () => `/dashboard/tickets-management/performance`,
    },
} as const;

/**
 * Static paths for specific sections (when you need to link to a specific section)
 */
export const classroomBasePath = "/dashboard/classroom";
export const adminBasePath = "/dashboard/admin";

export const staticPaths = {
    classroom: {
        profile: () => `${classroomBasePath}/profile`,
        chat: () => `${classroomBasePath}/chat`,
        certificates: () => `${classroomBasePath}/certificates`,
        reports: () => `${classroomBasePath}/reports`,
    },
    admin: {
        profile: () => `${adminBasePath}/profile`,
        chat: () => `${adminBasePath}/chat`,
        certificates: () => `${adminBasePath}/certificates`,
        reports: () => `${adminBasePath}/reports`,
        settings: () => `${adminBasePath}/settings`,
    },
} as const;

export type SharedPaths = typeof sharedPaths;
