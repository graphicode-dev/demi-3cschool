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
            titleKey: "ticketsManagement:supportBlock.pageTitle",
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
            titleKey: "ticketsManagement:supportBlock.addBlock.pageTitle",
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
            titleKey: "ticketsManagement:supportBlock.editBlock.pageTitle",
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
            titleKey: "ticketsManagement:manageTeam.pageTitle",
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
            titleKey: "ticketsManagement:manageTeam.addLead.pageTitle",
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
            titleKey: "ticketsManagement:manageTeam.editLead.pageTitle",
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
            titleKey: "ticketsManagement:manageTeam.changeBlock.pageTitle",
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
            titleKey: "ticketsManagement:manageTeam.convertLead.pageTitle",
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
            titleKey: "ticketsManagement:manageTeam.addAgent.pageTitle",
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
            titleKey: "ticketsManagement:manageTeam.editAgent.pageTitle",
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
            titleKey: "ticketsManagement:manageTeam.promoteAgent.pageTitle",
            requiresAuth: true,
        },
    },
];
