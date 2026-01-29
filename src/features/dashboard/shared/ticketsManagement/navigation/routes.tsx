/**
 * Tickets Management Feature - Route Module
 *
 * Defines routes for the tickets management feature.
 * Registers with the route registry for composition.
 */

import type { FeatureRouteModule } from "@/router/routes.types";
import { routeRegistry } from "@/router/routeRegistry";
import { Navigate } from "react-router-dom";
import { overviewRoutes } from "../pages/overview/navigation";
import { teamStructureRoutes } from "../pages/teamStructure/navigation";
import { ticketsPageRoutes } from "../pages/tickets/navigation";
import { distributionRoutes } from "../pages/distribution/navigation";
import { performanceRoutes } from "../pages/performance/navigation";
import { TICKETS_BASE_PATH } from "./constants";

/**
 * Tickets Management Route Module
 */
export const ticketsManagementRouteModule: FeatureRouteModule = {
    id: "tickets-management",
    name: "Tickets Management",
    basePath: TICKETS_BASE_PATH,
    layout: "dashboard",
    routes: {
        children: [
            {
                index: true,
                element: <Navigate to="overview" replace />,
            },

            // Overview routes
            ...overviewRoutes,

            // Team Structure routes
            ...teamStructureRoutes,

            // Tickets routes
            ...ticketsPageRoutes,

            // Distribution routes
            ...distributionRoutes,

            // Performance routes
            ...performanceRoutes,
        ],
    },
};

// Register routes
routeRegistry.register(ticketsManagementRouteModule);

export default ticketsManagementRouteModule;
