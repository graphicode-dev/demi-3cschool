import type { ReportsListParams } from "../types";

export const reportsKeys = {
    all: ["reports"] as const,
    lists: () => [...reportsKeys.all, "list"] as const,
    list: (params?: ReportsListParams) =>
        [...reportsKeys.lists(), params] as const,
};
