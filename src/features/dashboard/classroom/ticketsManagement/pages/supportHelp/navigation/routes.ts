import type { RouteConfig } from "@/router";

/**
 * Support Help feature routes
 *
 * These are imported and spread into the main ticketsManagement routes.
 */
export const supportHelpRoutes: RouteConfig[] = [
    {
        path: "support-help",
        lazy: () =>
            import("../pages/SupportHelpPage").then((m) => ({
                default: m.default,
            })),
        meta: {
            title: "Support & Help",
            titleKey: "ticketsManagement:supportHelp.pageTitle",
            requiresAuth: true,
        },
    },
    {
        path: "support-help/create",
        lazy: () =>
            import("../pages/CreateTicketPage").then((m) => ({
                default: m.default,
            })),
        meta: {
            title: "Need Help?",
            titleKey: "ticketsManagement:supportHelp.createTicket.pageTitle",
            requiresAuth: true,
        },
    },
];
