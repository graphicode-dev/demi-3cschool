import type { RouteConfig } from "@/router";
import { supportPermissions } from "@/auth";

const { ticket } = supportPermissions;

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
            titleKey: "ticketsManagement:tickets.pageTitle",
            requiresAuth: true,
        },
        // permissions: [ticket.viewAny],
    },
];
