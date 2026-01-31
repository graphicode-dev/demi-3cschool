/**
 * System Managements Feature - Query Hooks
 *
 * TanStack Query hooks for reading data.
 * All queries support AbortSignal for cancellation.
 *
 * @example
 * ```tsx
 * // List all students
 * const { data: students } = useStudentsList({ page: 1 });
 *
 * // Get single student
 * const { data: student } = useStudent(studentId);
 * ```
 */

import {
    useQuery,
    keepPreviousData,
    type UseQueryOptions,
} from "@tanstack/react-query";
import { PaginatedStudentData, Student, StudentListParams } from "../types";
import { studentKeys } from "./systemManagement.keys";
import { studentsApi } from "./systemManagement.api";

// ============================================================================
// Student List Queries
// ============================================================================

/**
 * Hook to fetch list of all students
 * Returns array when no page param, paginated data when page param is provided
 *
 * @param params - Query parameters for pagination and filtering
 * @param options - Additional query options
 *
 * @example
 * ```tsx
 * // Get all students (no pagination)
 * const { data } = useStudentsList();
 *
 * // Get paginated students
 * const { data } = useStudentsList({ page: 1, perPage: 10 });
 * ```
 */
export function useStudentsList(
    params?: StudentListParams,
    options?: Partial<UseQueryOptions<Student[] | PaginatedStudentData, Error>>
) {
    return useQuery({
        queryKey: studentKeys.list(params),
        queryFn: ({ signal }) => studentsApi.getList(params, signal),
        placeholderData: keepPreviousData,
        staleTime: 1000 * 60 * 2, // 2 minutes
        ...options,
    });
}

/**
 * Hook to fetch a single student by ID
 *
 * @param id - Student ID
 * @param options - Additional query options
 *
 * @example
 * ```tsx
 * const { data: student } = useStudent(studentId);
 * ```
 */
export function useStudent(
    id: number,
    options?: Partial<UseQueryOptions<Student, Error>>
) {
    return useQuery({
        queryKey: studentKeys.detail(id),
        queryFn: ({ signal }) => studentsApi.getById(id, signal),
        staleTime: 1000 * 60 * 5, // 5 minutes
        enabled: !!id,
        ...options,
    });
}
