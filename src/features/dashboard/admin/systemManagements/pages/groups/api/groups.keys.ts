import { ListQueryParams } from "@/shared/api";

// ============================================================================
// Group Query Keys
// ============================================================================

export const groupKeys = {
    all: ["groups"] as const,

    list: (params?: ListQueryParams) =>
        [...groupKeys.all, "list", params] as const,

    detail: (groupId: number) =>
        [...groupKeys.all, "detail", groupId] as const,

    blocks: (groupId: number) =>
        [...groupKeys.all, "blocks", groupId] as const,

    students: (groupId: number) =>
        [...groupKeys.all, "students", groupId] as const,
};

export type GroupQueryKey =
    | typeof groupKeys.all
    | ReturnType<typeof groupKeys.list>
    | ReturnType<typeof groupKeys.detail>
    | ReturnType<typeof groupKeys.blocks>
    | ReturnType<typeof groupKeys.students>;
