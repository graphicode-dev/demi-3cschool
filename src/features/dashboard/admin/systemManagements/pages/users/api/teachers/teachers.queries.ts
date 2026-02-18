/**
 * Teachers Feature - Query Hooks
 *
 * TanStack Query hooks for reading teachers data.
 * All queries support AbortSignal for cancellation.
 *
 * @example
 * ```tsx
 * // Get all teachers
 * const { data: teachers } = useTeachersList();
 *
 * // Get single teacher
 * const { data: teacher } = useTeacher(teacherId);
 *
 * // Get teachers metadata
 * const { data: metadata } = useTeachersMetadata();
 * ```
 */

import {
    useQuery,
    keepPreviousData,
    type UseQueryOptions,
} from "@tanstack/react-query";
import { teacherKeys } from "./teachers.keys";
import { teachersApi } from "./teachers.api";
import { ListQueryParams } from "@/shared/api";
import type { Teacher, TeacherMetadata } from "./types";

// ============================================================================
// Teachers List Query
// ============================================================================

/**
 * Hook to fetch list of all teachers
 *
 * @param params - Query parameters for filtering
 * @param options - Additional query options
 *
 * @example
 * ```tsx
 * const { data: teachers } = useTeachersList();
 * ```
 */
export function useTeachersList(
    params?: ListQueryParams,
    options?: Partial<UseQueryOptions<Teacher[], Error>>
) {
    return useQuery({
        queryKey: teacherKeys.list(params),
        queryFn: ({ signal }) => teachersApi.getList(params, signal),
        placeholderData: keepPreviousData,
        staleTime: 1000 * 60 * 2, // 2 minutes
        ...options,
    });
}

// ============================================================================
// Single Teacher Query
// ============================================================================

/**
 * Hook to fetch a single teacher by ID
 *
 * @param id - Teacher ID
 * @param options - Additional query options
 *
 * @example
 * ```tsx
 * const { data: teacher } = useTeacher(teacherId);
 * ```
 */
export function useTeacher(
    id: number,
    options?: Partial<UseQueryOptions<Teacher, Error>>
) {
    return useQuery({
        queryKey: teacherKeys.detail(id),
        queryFn: ({ signal }) => teachersApi.getById(id, signal),
        staleTime: 1000 * 60 * 5, // 5 minutes
        enabled: !!id,
        ...options,
    });
}

// ============================================================================
// Teachers Metadata Query
// ============================================================================

/**
 * Hook to fetch teachers metadata (filters, operators, field types)
 *
 * @param options - Additional query options
 *
 * @example
 * ```tsx
 * const { data: metadata } = useTeachersMetadata();
 * ```
 */
export function useTeachersMetadata(
    options?: Partial<UseQueryOptions<TeacherMetadata, Error>>
) {
    return useQuery({
        queryKey: teacherKeys.metadata(),
        queryFn: ({ signal }) => teachersApi.getMetadata(signal),
        staleTime: 1000 * 60 * 30, // 30 minutes - metadata rarely changes
        ...options,
    });
}
