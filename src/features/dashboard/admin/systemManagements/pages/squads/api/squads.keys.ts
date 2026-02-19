import type { ListQueryParams } from "@/shared/api";

// ============================================================================
// Squad Query Keys
// ============================================================================

export const squadKeys = {
    all: ["squads"] as const,

    lists: () => [...squadKeys.all, "list"] as const,
    list: (params?: ListQueryParams) =>
        [...squadKeys.lists(), params] as const,

    details: () => [...squadKeys.all, "detail"] as const,
    detail: (id: number) => [...squadKeys.details(), id] as const,

    members: (id: number) => [...squadKeys.all, "members", id] as const,

    stats: () => [...squadKeys.all, "stats"] as const,
};
