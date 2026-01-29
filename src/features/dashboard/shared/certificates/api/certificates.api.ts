import { api } from "@/shared/api/client";
import type {
    CertificatesListParams,
    CertificatesListResponse,
} from "../types";

export const certificatesApi = {
    getList: async (params: CertificatesListParams = {}) => {
        const response = await api.get("/certificates", {
            params: params as Record<string, unknown>,
        });
        return response.data as CertificatesListResponse;
    },
};
