import { api } from "@/shared/api/client";
import { ApiResponse, ListQueryParams, PaginatedData } from "@/shared/api";
import type { User } from "../types";

// ============================================================================
// Users API
// ============================================================================

const USERS_BASE_URL = "/system-managements/users";

export const usersApi = {
    /**
     * Get list of all users
     */
    getList: async (
        params?: ListQueryParams,
        signal?: AbortSignal
    ): Promise<PaginatedData<User>> => {
        const response = await api.get<ApiResponse<PaginatedData<User>>>(
            USERS_BASE_URL,
            { signal, params }
        );

        if (response.error) {
            throw response.error;
        }

        return response.data.data;
    },
};
