import { getDashboardBasePath } from "@/features/dashboard/shared/navigation/paths";

/**
 * Profile paths - dynamic based on user role
 */
export const profile = {
    list: () => `${getDashboardBasePath()}/profile`,
} as const;

export const profilePaths = {
    profileList: profile.list,
};
