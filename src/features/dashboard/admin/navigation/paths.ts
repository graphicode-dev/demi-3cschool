/**
 * Admin Feature - Path Definitions
 *
 * Centralized path definitions for the admin feature.
 */

import { registerFeaturePaths } from "@/router/paths.registry";
import { ADMIN_PATH } from "./constant";
import { ticketsPaths } from "../ticketsManagement/navigation/paths";
import { communityManagementPaths } from "../communityManagement";
import { groupsAnalyticsManagementPaths } from "../groupsAnalytics/navigation";
import { groupsManagementPaths } from "../groupsManagement/navigation";
import { learningPaths } from "../learning";
import { overviewPaths } from "../overview/navigation";
import { programsPaths } from "../programs/navigation";
import { resourcesPaths } from "../resources/navigation/paths";
import { settingsPaths } from "../settings/navigation/paths";

export const adminPaths = {
    root: () => ADMIN_PATH,
    overviewPaths,
    profile: () => `${ADMIN_PATH}/profile`,
    chat: () => `${ADMIN_PATH}/chat`,
    certificates: () => `${ADMIN_PATH}/certificates`,
    reports: () => `${ADMIN_PATH}/reports`,
    ticketsPaths,
    communityManagementPaths,
    groupsAnalyticsManagementPaths,
    groupsManagementPaths,
    learningPaths,
    programsPaths,
    resourcesPaths,
    settingsPaths,
} as const;

export const adminManagementPaths = registerFeaturePaths("admin", {
    root: adminPaths.root,
    profile: adminPaths.profile,
    chat: adminPaths.chat,
    certificates: adminPaths.certificates,
    reports: adminPaths.reports,
});

export type AdminPaths = typeof adminPaths;
