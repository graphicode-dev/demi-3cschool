import type { RouteConfig } from "@/router";
import { learningPermissions } from "@/auth";

const { lessonAssignment } = learningPermissions;

/**
 * Projects feature routes
 * These routes are under the classroom dashboard
 * Permission-controlled using learningPermissions config.
 */
export const projectsRoutes: RouteConfig[] = [
    {
        path: "projects",
        lazy: () =>
            import("../pages/main").then((m) => ({
                default: m.default,
            })),
        meta: {
            titleKey: "projects:title",
            requiresAuth: true,
        },
        // permissions: [lessonAssignment.viewAny],
    },
];

export default projectsRoutes;
