/**
 * Lesson Assignments Feature - Query Hooks
 *
 * TanStack Query hooks for reading lesson assignment data.
 * All queries support AbortSignal for cancellation.
 *
 * @example
 * ```tsx
 * // List all lesson assignments
 * const { data, isLoading } = useLessonAssignmentsList();
 *
 * // Get single lesson assignment
 * const { data: assignment } = useLessonAssignment(assignmentId);
 * ```
 */

import { useQuery, type UseQueryOptions } from "@tanstack/react-query";
import { lessonAssignmentKeys } from "./lesson-assignments.keys";
import { lessonAssignmentsApi } from "./lesson-assignments.api";
import {
    LessonAssignment,
    LessonAssignmentsListParams,
} from "../../types/lesson-assignments.types";
import { PaginatedData } from "@/shared/api";

// ============================================================================
// List Queries
// ============================================================================

/**
 * Hook to fetch list of all lesson assignments
 *
 * @param options - Additional query options
 *
 * @example
 * ```tsx
 * const { data, isLoading, error } = useLessonAssignmentsList();
 *
 * if (isLoading) return <Spinner />;
 * if (error) return <ErrorMessage error={error} />;
 *
 * return (
 *     <ul>
 *         {data?.map(assignment => (
 *             <li key={assignment.id}>{assignment.title}</li>
 *         ))}
 *     </ul>
 * );
 * ```
 */
export function useLessonAssignmentsList(
    options?: Partial<UseQueryOptions<LessonAssignment[], Error>>
) {
    return useQuery({
        queryKey: lessonAssignmentKeys.lists(),
        queryFn: ({ signal }) => lessonAssignmentsApi.getList(signal),
        ...options,
    });
}

/**
 * Hook to fetch paginated list of lesson assignments by lesson ID
 *
 * @param lessonId - Lesson ID to fetch assignments for
 * @param params - Query parameters for pagination
 * @param options - Additional query options
 */
export function useLessonAssignmentsByLesson(
    lessonId: string | undefined | null,
    params?: LessonAssignmentsListParams,
    options?: Partial<UseQueryOptions<PaginatedData<LessonAssignment>, Error>>
) {
    return useQuery({
        queryKey: [
            ...lessonAssignmentKeys.all,
            "byLesson",
            lessonId,
            params,
        ] as const,
        queryFn: ({ signal }) =>
            lessonAssignmentsApi.getListByLessonId(lessonId!, params, signal),
        enabled: !!lessonId,
        ...options,
    });
}

// ============================================================================
// Detail Queries
// ============================================================================

/**
 * Hook to fetch single lesson assignment by ID
 *
 * @param id - Lesson Assignment ID
 * @param options - Additional query options
 *
 * @example
 * ```tsx
 * const { data: assignment, isLoading, error } = useLessonAssignment(assignmentId);
 *
 * if (isLoading) return <Spinner />;
 * if (error) return <ErrorMessage error={error} />;
 *
 * return (
 *     <div>
 *         <h1>{assignment.title}</h1>
 *         <a href={assignment.file.url}>{assignment.file.fileName}</a>
 *     </div>
 * );
 * ```
 */
export function useLessonAssignment(
    id: string | undefined | null,
    options?: Partial<UseQueryOptions<LessonAssignment, Error>>
) {
    return useQuery({
        queryKey: lessonAssignmentKeys.detail(id ?? ""),
        queryFn: ({ signal }) => lessonAssignmentsApi.getById(id!, signal),
        enabled: !!id,
        ...options,
    });
}
