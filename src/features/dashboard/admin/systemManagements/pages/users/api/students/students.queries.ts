/**
 * Students Feature - Query Hooks
 *
 * TanStack Query hooks for reading students data.
 * All queries support AbortSignal for cancellation.
 *
 * @example
 * ```tsx
 * // Get all students
 * const { data: students } = useStudentsList();
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
import { studentKeys } from "./students.keys";
import { studentsApi } from "./students.api";
import { ListQueryParams } from "@/shared/api";
import type { Student } from "./types";

// ============================================================================
// Students List Query
// ============================================================================

/**
 * Hook to fetch list of all students
 *
 * @param params - Query parameters for filtering
 * @param options - Additional query options
 *
 * @example
 * ```tsx
 * const { data: students } = useStudentsList();
 * ```
 */
export function useStudentsList(
    params?: ListQueryParams,
    options?: Partial<UseQueryOptions<Student[], Error>>
) {
    return useQuery({
        queryKey: studentKeys.list(params),
        queryFn: ({ signal }) => studentsApi.getList(params, signal),
        placeholderData: keepPreviousData,
        staleTime: 1000 * 60 * 2, // 2 minutes
        ...options,
    });
}

// ============================================================================
// Single Student Query
// ============================================================================

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
