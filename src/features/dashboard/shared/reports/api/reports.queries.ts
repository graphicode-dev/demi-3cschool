import { useQuery } from "@tanstack/react-query";
import { reportsKeys } from "./reports.keys";
import { reportsApi } from "./reports.api";
import type { ReportsListParams } from "../types";

export const useReportsList = (params?: ReportsListParams) => {
    return useQuery({
        queryKey: reportsKeys.list(params),
        queryFn: () => reportsApi.getList(params),
    });
};
