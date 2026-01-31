/**
 * Lesson Materials Feature - Query Keys
 *
 * Stable query key factory for TanStack Query.
 * Keys are hierarchical for easy invalidation.
 *
 * @example
 * ```ts
 * // Invalidate all lesson materials data
 * queryClient.invalidateQueries({ queryKey: lessonMaterialKeys.all });
 *
 * // Invalidate only lists (keeps detail cache)
 * queryClient.invalidateQueries({ queryKey: lessonMaterialKeys.lists() });
 *
 * // Invalidate specific lesson material
 * queryClient.invalidateQueries({ queryKey: lessonMaterialKeys.detail(materialId) });
 * ```
 */

/**
 * Query key factory for lesson materials
 *
 * Hierarchy:
 * - all: ['lesson-materials']
 * - lists: ['lesson-materials', 'list']
 * - details: ['lesson-materials', 'detail']
 * - detail(id): ['lesson-materials', 'detail', id]
 */
export const lessonMaterialKeys = {
    /**
     * Root key for all lesson material queries
     */
    all: ["lesson-materials"] as const,

    /**
     * Key for all list queries
     */
    lists: () => [...lessonMaterialKeys.all, "list"] as const,

    /**
     * Key for all detail queries
     */
    details: () => [...lessonMaterialKeys.all, "detail"] as const,

    /**
     * Key for specific lesson material detail
     */
    detail: (id: string) => [...lessonMaterialKeys.details(), id] as const,
};

/**
 * Type for lesson material query keys
 */
export type LessonMaterialQueryKey =
    | typeof lessonMaterialKeys.all
    | ReturnType<typeof lessonMaterialKeys.lists>
    | ReturnType<typeof lessonMaterialKeys.details>
    | ReturnType<typeof lessonMaterialKeys.detail>;
