/**
 * Admin Feature - Path Definitions
 *
 * Centralized path definitions for the admin feature.
 */

import { registerFeaturePaths } from "@/router/paths.registry";

export const adminPaths = {
    root: () => "/dashboard/admin",
    profile: () => "/dashboard/admin/profile",
    chat: () => "/dashboard/admin/chat",
    certificates: () => "/dashboard/admin/certificates",
    reports: () => "/dashboard/admin/reports",
    settings: () => "/dashboard/admin/settings",
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
