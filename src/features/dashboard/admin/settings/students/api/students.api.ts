import { api } from "@/shared/api/client";
import type { ApiResponse, PaginatedData } from "@/shared/api";
import type {
    Student,
    StudentsListParams,
    StudentCreatePayload,
    StudentUpdatePayload,
} from "../types";

const BASE_URL = "/system-managements/students";

function normalizeStudentsList(
    data: PaginatedData<Student> | Student[]
): PaginatedData<Student> {
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
    ): Promise<PaginatedData<Student>> => {
        const queryParams: Record<string, unknown> = {};
        if (params?.page) queryParams.page = params.page;
        if (params?.search) queryParams.search = params.search;

        const response = await api.get<
            ApiResponse<PaginatedData<Student> | Student[]>
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
    ): Promise<Student> => {
        const response = await api.get<ApiResponse<Student>>(
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

    create: async (payload: StudentCreatePayload): Promise<Student> => {
        const response = await api.post<ApiResponse<Student>>(BASE_URL, payload);

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
    ): Promise<Student> => {
        const response = await api.put<ApiResponse<Student>>(
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
