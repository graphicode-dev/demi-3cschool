import { api } from "@/shared/api/client";
import type { ApiResponse, PaginatedData } from "@/shared/api";
import type {
    StudentsListParams,
    StudentCreatePayload,
    StudentUpdatePayload,
} from "../types";
import { User } from "@/auth/auth.types";

const BASE_URL = "/system-managements/students";

function normalizeStudentsList(
    data: PaginatedData<User> | User[]
): PaginatedData<User> {
    if (Array.isArray(data)) {
        return {
            perPage: data.length,
            currentPage: 1,
            lastPage: 1,
            nextPageUrl: null,
            items: data,
        };
    }

    return data;
}

export const studentsApi = {
    list: async (
        params?: StudentsListParams,
        signal?: AbortSignal
    ): Promise<PaginatedData<User>> => {
        const queryParams: Record<string, unknown> = {};
        if (params?.page) queryParams.page = params.page;
        if (params?.search) queryParams.search = params.search;

        const response = await api.get<
            ApiResponse<PaginatedData<User> | User[]>
        >(BASE_URL, {
            params: queryParams,
            signal,
        });

        if (response.error) {
            throw response.error;
        }

        if (!response.data?.data) {
            throw new Error("No data returned from server");
        }

        return normalizeStudentsList(response.data.data);
    },

    getById: async (
        id: string | number,
        signal?: AbortSignal
    ): Promise<User> => {
        const response = await api.get<ApiResponse<User>>(
            `${BASE_URL}/${id}`,
            { signal }
        );

        if (response.error) {
            throw response.error;
        }

        if (!response.data?.data) {
            throw new Error("No data returned from server");
        }

        return response.data.data;
    },

    create: async (payload: StudentCreatePayload): Promise<User> => {
        const response = await api.post<ApiResponse<User>>(BASE_URL, payload);

        if (response.error) {
            throw response.error;
        }

        if (!response.data?.data) {
            throw new Error("No data returned from server");
        }

        return response.data.data;
    },

    update: async (
        id: string | number,
        payload: StudentUpdatePayload
    ): Promise<User> => {
        const response = await api.put<ApiResponse<User>>(
            `${BASE_URL}/${id}`,
            payload
        );

        if (response.error) {
            throw response.error;
        }

        if (!response.data?.data) {
            throw new Error("No data returned from server");
        }

        return response.data.data;
    },

    delete: async (id: string | number): Promise<void> => {
        const response = await api.delete(`${BASE_URL}/${id}`);

        if (response.error) {
            throw response.error;
        }
    },
};
