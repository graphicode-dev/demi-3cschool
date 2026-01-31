/**
 * Lesson Assignments Feature - Query Keys
 *
 * Stable query key factory for TanStack Query.
 * Keys are hierarchical for easy invalidation.
 *
 * @example
 * ```ts
 * // Invalidate all lesson assignments data
 * queryClient.invalidateQueries({ queryKey: lessonAssignmentKeys.all });
 *
 * // Invalidate only lists (keeps detail cache)
 * queryClient.invalidateQueries({ queryKey: lessonAssignmentKeys.lists() });
 *
 * // Invalidate specific lesson assignment
 * queryClient.invalidateQueries({ queryKey: lessonAssignmentKeys.detail(assignmentId) });
 * ```
 */

/**
 * Query key factory for lesson assignments
 *
 * Hierarchy:
 * - all: ['lesson-assignments']
 * - lists: ['lesson-assignments', 'list']
 * - details: ['lesson-assignments', 'detail']
 * - detail(id): ['lesson-assignments', 'detail', id]
 */
export const lessonAssignmentKeys = {
    /**
     * Root key for all lesson assignment queries
     */
    all: ["lesson-assignments"] as const,

    /**
     * Key for all list queries
     */
    lists: () => [...lessonAssignmentKeys.all, "list"] as const,

    /**
     * Key for all detail queries
     */
    details: () => [...lessonAssignmentKeys.all, "detail"] as const,

    /**
     * Key for specific lesson assignment detail
     */
    detail: (id: string) => [...lessonAssignmentKeys.details(), id] as const,
};

/**
 * Type for lesson assignment query keys
 */
export type LessonAssignmentQueryKey =
    | typeof lessonAssignmentKeys.all
    | ReturnType<typeof lessonAssignmentKeys.lists>
    | ReturnType<typeof lessonAssignmentKeys.details>
    | ReturnType<typeof lessonAssignmentKeys.detail>;
