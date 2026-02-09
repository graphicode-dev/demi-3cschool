/**
 * Programs Management - Routes
 *
 * Route configuration for Programs.
 * Uses FeatureRouteModule format for the new routing architecture.
 * Permission-controlled routes using learningPermissions config.
 */

import type { RouteConfig } from "@/router/routes.types";
import { programsPaths } from "./paths";

// ============================================================================
// Programs Routes
// ============================================================================

export const programsRoutes: RouteConfig[] = [
    {
        path: "programs",
        lazy: () =>
            import("@/features/dashboard/admin/programs/pages/Programs"),
        // permissions: [course.viewAny],
        meta: { titleKey: "programs:programs.title" },
        handle: { crumb: "programs:programs.title" },
    },
    {
        path: `programs/${programsPaths.summerList()}`,
        lazy: () =>
            import("@/features/dashboard/admin/programs/pages/SummerProgramList"),
        meta: { titleKey: "programs:summerProgram.title" },
        handle: { crumb: "programs:summerProgram.title" },
    },
    {
        path: `programs/${programsPaths.standardList()}`,
        lazy: () =>
            import("@/features/dashboard/admin/programs/pages/StandardProgramList"),
        meta: { titleKey: "programs:programs.standardProgram.title" },
        handle: { crumb: "programs:programs.standardProgram.title" },
    },
];
