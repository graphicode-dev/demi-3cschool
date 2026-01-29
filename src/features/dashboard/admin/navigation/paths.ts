/**
 * Admin Feature - Path Definitions
 *
 * Centralized path definitions for the admin feature.
 */

import { registerFeaturePaths } from "@/router/paths.registry";
import { ADMIN_PATH } from "./constant";

export const adminPaths = {
    root: () => ADMIN_PATH,
    profile: () => `${ADMIN_PATH}/profile`,
    chat: () => `${ADMIN_PATH}/chat`,
    certificates: () => `${ADMIN_PATH}/certificates`,
    reports: () => `${ADMIN_PATH}/reports`,
    settings: () => `${ADMIN_PATH}/settings`,
} as const;

export const adminManagementPaths = registerFeaturePaths("admin", {
    root: adminPaths.root,
    profile: adminPaths.profile,
    chat: adminPaths.chat,
    certificates: adminPaths.certificates,
    reports: adminPaths.reports,
    settings: adminPaths.settings,
});

export type AdminPaths = typeof adminPaths;
