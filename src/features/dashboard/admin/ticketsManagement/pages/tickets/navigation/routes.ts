import type { RouteConfig } from "@/router";

/**
 * Tickets feature routes
 *
 * These are imported and spread into the main ticketsManagement routes.
 */
export const ticketsPageRoutes: RouteConfig[] = [
    {
        path: "tickets",
        lazy: () =>
            import("../pages/TicketsPage").then((m) => ({
                default: m.default,
            })),
        meta: {
            title: "Tickets",
            titleKey: "adminTicketsManagement:tickets.pageTitle",
            requiresAuth: true,
        },
    },
];
