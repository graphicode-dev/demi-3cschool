import type { RouteConfig } from "@/router";

export const squadsRoutes: RouteConfig[] = [
    {
        path: "squads",
        lazy: () => import("../pages/main"),
        meta: { titleKey: "systemManagements:squads.title" },
        handle: { crumb: "systemManagements:squads.title" },
    },
];
