import { ListQueryParams } from "@/shared/api";

export const teachersKeys = {
    all: ["teachers"] as const,
    lists: () => [...teachersKeys.all, "list"] as const,
    list: (params?: ListQueryParams) =>
        [...teachersKeys.lists(), params ?? {}] as const,
    details: () => [...teachersKeys.all, "detail"] as const,
    detail: (id: string | number) => [...teachersKeys.details(), id] as const,
};

export type TeachersQueryKey =
    | typeof teachersKeys.all
    | ReturnType<typeof teachersKeys.lists>
    | ReturnType<typeof teachersKeys.list>
    | ReturnType<typeof teachersKeys.details>
    | ReturnType<typeof teachersKeys.detail>;
