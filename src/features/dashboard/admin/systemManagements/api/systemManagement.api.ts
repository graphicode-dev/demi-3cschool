/**
 * System Managements Feature - API Functions
 *
 * Raw API functions for system managements domain.
 * These are pure functions that make HTTP requests.
 * They are used by query and mutation hooks.
 *
 * @example
 * ```ts
 * // In a query hook
 * const { data } = useQuery({
 *     queryKey: studentKeys.list(params),
 *     queryFn: ({ signal }) => studentsApi.getList(params, signal),
 * });
 * ```
 */

import { api } from "@/shared/api/client";
import { ApiResponse, PaginatedData, ListQueryParams } from "@/shared/api";
import {
    Student,
    Grade,
} from "../types";

// ============================================================================
// Students API
// ============================================================================

const STUDENTS_BASE_URL = "/system-managements/students";

/**
 * Students API functions
 */
export const studentsApi = {
    /**
     * Get list of all students (paginated when page param is provided)
     */
    getList: async (
        params?: ListQueryParams,
        signal?: AbortSignal
    ): Promise<Student[] | PaginatedData<Student>> => {
        const response = await api.get<
            ApiResponse<Student[] | PaginatedData<Student>>
        >(STUDENTS_BASE_URL, {
            params: params as Record<string, unknown>,
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

    /**
     * Get single student by ID
     */
    getById: async (id: number, signal?: AbortSignal): Promise<Student> => {
        const response = await api.get<ApiResponse<Student>>(
            `${STUDENTS_BASE_URL}/${id}`,
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
};

// ============================================================================
// Grades API
// ============================================================================

const GRADES_BASE_URL = "/system-managements/grades";

/**
 * Grades API functions
 */
export const gradesApi = {
    /**
     * Get list of all grades
     */
    getList: async (signal?: AbortSignal): Promise<PaginatedData<Grade>> => {
        const response = await api.get<ApiResponse<PaginatedData<Grade>>>(
            GRADES_BASE_URL,
            { signal }
        );

        if (response.error) {
            throw response.error;
        }

        return response.data.data;
    },
};
