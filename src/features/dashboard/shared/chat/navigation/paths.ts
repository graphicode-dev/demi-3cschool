import { getDashboardBasePath } from "@/features/dashboard/shared/navigation/paths";

/**
 * Chat paths - dynamic based on user role
 */
export const chats = {
    list: () => `${getDashboardBasePath()}/chat`,
} as const;

export const chatPaths = {
    chatsList: chats.list,
};
