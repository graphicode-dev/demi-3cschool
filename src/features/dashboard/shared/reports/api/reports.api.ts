import { api } from "@/shared/api/client";
import type { ReportsListResponse, ReportsListParams } from "../types";

const BASE_URL = "/reports";

export const reportsApi = {
    getList: async (
        params?: ReportsListParams
    ): Promise<ReportsListResponse> => {
        const response = await api.get<ReportsListResponse>(BASE_URL, {
            params: params as Record<string, unknown>,
        });
        return response.data as ReportsListResponse;
    },
};
