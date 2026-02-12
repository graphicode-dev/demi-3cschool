import { ListQueryParams } from "@/shared/api";

export const studentsKeys = {
    all: ["students"] as const,
    lists: () => [...studentsKeys.all, "list"] as const,
    list: (params?: ListQueryParams) =>
        [...studentsKeys.lists(), params ?? {}] as const,
    details: () => [...studentsKeys.all, "detail"] as const,
    detail: (id: string | number) => [...studentsKeys.details(), id] as const,
};

export type StudentsQueryKey =
    | typeof studentsKeys.all
    | ReturnType<typeof studentsKeys.lists>
    | ReturnType<typeof studentsKeys.list>
    | ReturnType<typeof studentsKeys.details>
    | ReturnType<typeof studentsKeys.detail>;
