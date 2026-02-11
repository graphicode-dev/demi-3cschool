import type { RouteConfig } from "@/router";

/**
 * Support Block feature routes
 *
 * These are imported and spread into the main ticketsManagement routes.
 */
export const supportBlockRoutes: RouteConfig[] = [
    {
        path: "support-block",
        lazy: () =>
            import("../pages/SupportBlockPage").then((m) => ({
                default: m.default,
            })),
        meta: {
            title: "Support Block",
            titleKey: "adminTicketsManagement:supportBlock.pageTitle",
            requiresAuth: true,
        },
    },
    // Block management routes
    {
        path: "support-block/add",
        lazy: () =>
            import("../pages/block/AddBlockPage").then((m) => ({
                default: m.default,
            })),
        meta: {
            title: "Add Block",
            titleKey: "adminTicketsManagement:supportBlock.addBlock.pageTitle",
            requiresAuth: true,
        },
    },
    {
        path: "support-block/:blockId/edit",
        lazy: () =>
            import("../pages/block/EditBlockPage").then((m) => ({
                default: m.default,
            })),
        meta: {
            title: "Edit Block",
            titleKey: "adminTicketsManagement:supportBlock.editBlock.pageTitle",
            requiresAuth: true,
        },
    },
    // Block-specific manage team
    {
        path: "support-block/:blockId/manage",
        lazy: () =>
            import("../pages/ManageTeamPage").then((m) => ({
                default: m.default,
            })),
        meta: {
            title: "Manage Team",
            titleKey: "adminTicketsManagement:manageTeam.pageTitle",
            requiresAuth: true,
        },
    },
    // Lead routes (block-specific)
    {
        path: "support-block/:blockId/manage/lead/add",
        lazy: () =>
            import("../pages/lead/AddLeadPage").then((m) => ({
                default: m.default,
            })),
        meta: {
            title: "Add Lead",
            titleKey: "adminTicketsManagement:manageTeam.addLead.pageTitle",
            requiresAuth: true,
        },
    },
    {
        path: "support-block/:blockId/manage/lead/:id/edit",
        lazy: () =>
            import("../pages/lead/EditLeadPage").then((m) => ({
                default: m.default,
            })),
        meta: {
            title: "Edit Lead",
            titleKey: "adminTicketsManagement:manageTeam.editLead.pageTitle",
            requiresAuth: true,
        },
    },
    {
        path: "support-block/:blockId/manage/lead/:id/change-block",
        lazy: () =>
            import("../pages/lead/ChangeBlockPage").then((m) => ({
                default: m.default,
            })),
        meta: {
            title: "Change Block",
            titleKey: "adminTicketsManagement:manageTeam.changeBlock.pageTitle",
            requiresAuth: true,
        },
    },
    {
        path: "support-block/:blockId/manage/lead/:id/convert",
        lazy: () =>
            import("../pages/lead/ConvertLeadToAgentPage").then((m) => ({
                default: m.default,
            })),
        meta: {
            title: "Convert Lead to Agent",
            titleKey: "adminTicketsManagement:manageTeam.convertLead.pageTitle",
            requiresAuth: true,
        },
    },
    // Agent routes (block-specific)
    {
        path: "support-block/:blockId/manage/agent/add",
        lazy: () =>
            import("../pages/agent/AddAgentPage").then((m) => ({
                default: m.default,
            })),
        meta: {
            title: "Add Agent",
            titleKey: "adminTicketsManagement:manageTeam.addAgent.pageTitle",
            requiresAuth: true,
        },
    },
    {
        path: "support-block/:blockId/manage/agent/:id/edit",
        lazy: () =>
            import("../pages/agent/EditAgentPage").then((m) => ({
                default: m.default,
            })),
        meta: {
            title: "Edit Agent",
            titleKey: "adminTicketsManagement:manageTeam.editAgent.pageTitle",
            requiresAuth: true,
        },
    },
    {
        path: "support-block/:blockId/manage/agent/:id/promote",
        lazy: () =>
            import("../pages/agent/PromoteAgentToLeadPage").then((m) => ({
                default: m.default,
            })),
        meta: {
            title: "Promote Agent to Lead",
            titleKey:
                "adminTicketsManagement:manageTeam.promoteAgent.pageTitle",
            requiresAuth: true,
        },
    },
];
