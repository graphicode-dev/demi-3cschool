/**
 * Support Agent Feature - Query Keys
 *
 * Centralized query key factory for support agents.
 */

import { ListQueryParams } from "@/shared/api";

export const supportAgentKeys = {
    all: ["support-agents"] as const,
    byBlock: (blockId: number | string) =>
        [...supportAgentKeys.all, "block", blockId] as const,
    byBlockPaginated: (blockId: number | string, params: ListQueryParams) =>
        [...supportAgentKeys.byBlock(blockId), "page", params.page] as const,
    detail: (id: number | string) =>
        [...supportAgentKeys.all, "detail", id] as const,
};
