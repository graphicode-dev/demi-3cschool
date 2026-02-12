import { api } from "@/shared/api/client";
import type { ApiResponse, ListQueryParams, PaginatedData } from "@/shared/api";
import type { TeacherCreatePayload, TeacherUpdatePayload } from "../types";
import { User } from "@/auth/auth.types";

const BASE_URL = "/system-managements/teachers";

export const teachersApi = {
    list: async (
        params?: ListQueryParams,
        signal?: AbortSignal
    ): Promise<PaginatedData<User>> => {
        const queryParams: Record<string, unknown> = {};
        if (params?.page) queryParams.page = params.page;
        if (params?.search) queryParams.search = params.search;

        const response = await api.get<ApiResponse<PaginatedData<User>>>(
            BASE_URL,
            {
                params: queryParams,
                signal,
            }
        );

        if (response.error) {
            throw response.error;
        }

        if (!response.data?.data) {
            throw new Error("No data returned from server");
        }

        return response.data.data;
    },

    getById: async (
        id: string | number,
        signal?: AbortSignal
    ): Promise<User> => {
        const response = await api.get<ApiResponse<User>>(`${BASE_URL}/${id}`, {
            signal,
        });

        if (response.error) {
            throw response.error;
        }

        if (!response.data?.data) {
            throw new Error("No data returned from server");
        }

        return response.data.data;
    },

    create: async (payload: TeacherCreatePayload): Promise<User> => {
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
        payload: TeacherUpdatePayload
    ): Promise<User> => {
        const response = await api.post<ApiResponse<User>>(
            `${BASE_URL}/${id}`,
            {
                _method: "put",
                ...payload,
            }
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
