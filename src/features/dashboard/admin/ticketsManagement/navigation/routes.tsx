/**
 * Tickets Management Feature - Route Module
 *
 * Defines routes for the tickets management feature.
 * Registers with the route registry for composition.
 */

import { Navigate } from "react-router-dom";
import { overviewRoutes } from "../pages/overview/navigation";
import { teamStructureRoutes } from "../pages/teamStructure/navigation";
import { ticketsPageRoutes } from "../pages/tickets/navigation";
import { distributionRoutes } from "../pages/distribution/navigation";
import { performanceRoutes } from "../pages/performance/navigation";

/**
 * Flat routes array for embedding in admin routes
 */
export const ticketsManagementRoutes = [
    {
        path: "tickets-management",
        children: [
            {
                index: true,
                element: <Navigate to="overview" replace />,
            },
            ...overviewRoutes,
            ...teamStructureRoutes,
            ...ticketsPageRoutes,
            ...distributionRoutes,
            ...performanceRoutes,
        ],
    },
];
