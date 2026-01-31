import { api } from "@/shared/api/client";
import { ApiResponse } from "@/shared/api";
import type {
    EligibleStudent,
    EligibleStudentsListParams,
    EligibleStudentsResponse,
} from "../types";

const BASE_URL = "/eligible-students";

export const eligibleStudentsApi = {
    getEligibleStudents: async (
        params?: EligibleStudentsListParams
    ): Promise<EligibleStudentsResponse> => {
        const response = await api.get<ApiResponse<EligibleStudentsResponse>>(
            BASE_URL,
            {
                params: {
                    page: params?.page || 1,
                    per_page: params?.perPage || 10,
                    search: params?.search,
                },
                meta: { auth: "required" },
            }
        );

        if (response.error) {
            throw response.error;
        }

        return (
            response.data?.data || {
                items: [],
                currentPage: 1,
                lastPage: 1,
                perPage: 10,
                total: 0,
            }
        );
    },
};

export default eligibleStudentsApi;
