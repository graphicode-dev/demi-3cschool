/**
 * GroupsAnalytics - Path Builders
 *
 * Centralized, type-safe path builders for groups analytics.
 *
 * @example
 * ```ts
 * import { groupsPaths } from '@/features/groups/paths';
 *
 * navigate(groupsPaths.groups.list());
 * navigate(groupsPaths.groups.view(courseId));
 * navigate(groupsPaths.lessons.edit(lessonId));
 * ```
 */

import { registerFeaturePaths } from "@/router/paths.registry";

// ============================================================================
// GroupsAnalytics Paths
// ============================================================================

const BasePath = "/admin/groups-analytics";

export const groupsAnalyticsPaths = {
    List: () => `${BasePath}`,
} as const;

// ============================================================================
// Combined GroupsAnalytics Management Paths
// ============================================================================

export const groupsAnalyticsManagementPaths = registerFeaturePaths(
    "groupsManagement",
    {
        // GroupsAnalytics
        groupsList: groupsAnalyticsPaths.List,
    }
);

// ============================================================================
// Type Exports
// ============================================================================

export type GroupsAnalyticsPaths = typeof groupsAnalyticsPaths;
export type GroupsAnalyticsManagementPaths =
    typeof groupsAnalyticsManagementPaths;
