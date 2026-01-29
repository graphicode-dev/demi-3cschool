import type { RouteConfig } from "@/router";
import { accountPermissions } from "@/auth/permission.config";

const { conversation } = accountPermissions;

/**
 * Chats feature routes
 *
 */
export const chatsRoutes: RouteConfig[] = [
    {
        path: "chat",
        lazy: () =>
            import("@/features/dashboard/shared/chat/pages/Main").then(
                (m) => ({
                    default: m.default,
                })
            ),
        meta: {
            title: "Chats",
            titleKey: "classroom:nav.chat",
            requiresAuth: true,
        },
        permissions: [conversation.viewAny],
    },
];
