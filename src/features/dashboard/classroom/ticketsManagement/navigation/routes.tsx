/**
 * Tickets Management Feature - Route Module
 *
 * Defines routes for the tickets management feature.
 * Registers with the route registry for composition.
 */

import type { RouteConfig } from "@/router/routes.types";
import { Navigate } from "react-router-dom";
import { overviewRoutes } from "../pages/overview/navigation";
import { supportBlockRoutes } from "../pages/supportBlock/navigation";
import { ticketsPageRoutes } from "../pages/tickets/navigation";
import { distributionRoutes } from "../pages/distribution/navigation";
import { performanceRoutes } from "../pages/performance/navigation";
import { supportHelpRoutes } from "../pages/supportHelp/navigation";

/**
 * Tickets Management Route Module
 */
export const ticketsManagementRoutes: RouteConfig[] = [
    {
        index: true,
        element: <Navigate to="overview" replace />,
    },

    // Overview routes
    ...overviewRoutes,

    // Support Block routes
    ...supportBlockRoutes,

    // Tickets routes
    ...ticketsPageRoutes,

    // Distribution routes
    ...distributionRoutes,

    // Performance routes
    ...performanceRoutes,

    // Support Help routes
    ...supportHelpRoutes,
];
