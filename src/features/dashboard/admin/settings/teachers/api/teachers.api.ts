import { api } from "@/shared/api/client";
import type { ApiResponse, PaginatedData } from "@/shared/api";
import type {
    Teacher,
    TeachersListParams,
    TeacherCreatePayload,
    TeacherUpdatePayload,
} from "../types";

const BASE_URL = "/system-managements/teachers";

export const teachersApi = {
    list: async (
        params?: TeachersListParams,
        signal?: AbortSignal
    ): Promise<PaginatedData<Teacher>> => {
        const queryParams: Record<string, unknown> = {};
        if (params?.page) queryParams.page = params.page;
        if (params?.search) queryParams.search = params.search;

        const response = await api.get<ApiResponse<PaginatedData<Teacher>>>(
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
    ): Promise<Teacher> => {
        const response = await api.get<ApiResponse<Teacher>>(`${BASE_URL}/${id}`, {
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

    create: async (payload: TeacherCreatePayload): Promise<Teacher> => {
        const response = await api.post<ApiResponse<Teacher>>(BASE_URL, payload);

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
    ): Promise<Teacher> => {
        const response = await api.post<ApiResponse<Teacher>>(`${BASE_URL}/${id}`, {
            _method: "put",
            ...payload,
        });

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
