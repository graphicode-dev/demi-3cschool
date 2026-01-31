/**
 * Courses Feature - API Functions
 *
 * Raw API functions for courses domain.
 * These are pure functions that make HTTP requests.
 * They are used by query and mutation hooks.
 *
 * @example
 * ```ts
 * // In a query hook
 * const { data } = useQuery({
 *     queryKey: courseKeys.list(params),
 *     queryFn: ({ signal }) => coursesApi.getList(params, signal),
 * });
 * ```
 */

import { api } from "@/shared/api/client";
import { toFormData } from "@/utils";
import type {
    Course,
    CoursesListParams,
    CoursesByProgramParams,
    CourseCreatePayload,
    CourseUpdatePayload,
    CoursesMetadata,
    PaginatedResponse,
    PaginatedData,
} from "../types/courses.types";
import { ApiResponse } from "@/shared/api";

const BASE_URL = "/courses";

/**
 * Courses API functions
 */
export const coursesApi = {
    /**
     * Get courses metadata (filters, operators, field types)
     */
    getMetadata: async (signal?: AbortSignal): Promise<CoursesMetadata> => {
        const response = await api.get<ApiResponse<CoursesMetadata>>(
            `${BASE_URL}/metadata`,
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

    /**
     * Get paginated list of all courses
     */
    getList: async (
        params?: CoursesListParams,
        signal?: AbortSignal
    ): Promise<PaginatedData<Course>> => {
        const { programs_curriculum, search, ...restParams } = params ?? {};

        // Build query params, only include non-empty values
        const queryParams: Record<string, unknown> = { ...restParams };

        if (programs_curriculum) {
            queryParams.programs_curriculum = programs_curriculum;
        }

        if (search?.trim()) {
            queryParams.search = search.trim();
        }

        const response = await api.get<PaginatedResponse<Course>>(BASE_URL, {
            params: queryParams,
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
     * Get list of courses by program type (returns array, not paginated)
     */
    getByProgram: async (
        params: CoursesByProgramParams,
        signal?: AbortSignal
    ): Promise<Course[]> => {
        const { programType, page } = params;
        const response = await api.get<ApiResponse<Course[]>>(
            `${BASE_URL}/program/${programType}`,
            {
                params: page ? { page } : undefined,
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

    /**
     * Get single course by ID
     */
    getById: async (id: string, signal?: AbortSignal): Promise<Course> => {
        const response = await api.get<ApiResponse<Course>>(
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

    /**
     * Create a new course
     */
    create: async (payload: CourseCreatePayload): Promise<Course> => {
        const formData = toFormData({
            programCurriculumId: payload.programCurriculumId,
            title: payload.title,
            description: payload.description,
            slug: payload.slug,
            isActive: payload.isActive ? 1 : 0,
            image: payload.image,
        });

        const response = await api.post<ApiResponse<Course>>(
            BASE_URL,
            formData,
            { meta: { multipart: true } }
        );

        if (response.error) {
            throw response.error;
        }

        if (!response.data?.data) {
            throw new Error("No data returned from server");
        }

        return response.data.data;
    },

    /**
     * Update an existing course
     */
    update: async (
        id: string,
        payload: CourseUpdatePayload
    ): Promise<Course> => {
        const formData = toFormData({
            title: payload.title,
            description: payload.description,
            slug: payload.slug,
            isActive:
                payload.isActive !== undefined
                    ? payload.isActive
                        ? 1
                        : 0
                    : undefined,
            image: payload.image,
        });

        const response = await api.patch<ApiResponse<Course>>(
            `${BASE_URL}/${id}`,
            formData,
            { meta: { multipart: true } }
        );

        if (response.error) {
            throw response.error;
        }

        if (!response.data?.data) {
            throw new Error("No data returned from server");
        }

        return response.data.data;
    },

    /**
     * Delete a course
     */
    delete: async (id: string): Promise<void> => {
        const response = await api.delete(`${BASE_URL}/${id}`);

        if (response.error) {
            throw response.error;
        }
    },
};

export default coursesApi;
