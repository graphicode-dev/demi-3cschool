/**
 * Programs Curriculum Feature - Query Keys
 *
 * Stable query key factory for TanStack Query.
 * Keys are hierarchical for easy invalidation.
 *
 * @example
 * ```ts
 * // Invalidate all programs curriculum data
 * queryClient.invalidateQueries({ queryKey: programsCurriculumKeys.all });
 *
 * // Invalidate just the list
 * queryClient.invalidateQueries({ queryKey: programsCurriculumKeys.lists() });
 * ```
 */

import type { ProgramsCurriculumListParams } from "../types";

// ============================================================================
// Query Key Factory
// ============================================================================

/**
 * Query key factory for programs curriculum
 *
 * Hierarchy:
 * - all: ['programs-curriculum']
 * - lists: ['programs-curriculum', 'list']
 * - list: ['programs-curriculum', 'list', params]
 * - details: ['programs-curriculum', 'detail']
 * - detail: ['programs-curriculum', 'detail', id]
 * - metadata: ['programs-curriculum', 'metadata']
 */
export const programsCurriculumKeys = {
    /**
     * Root key for all programs curriculum queries
     */
    all: ["programs-curriculum"] as const,

    /**
     * Key for all list queries
     */
    lists: () => [...programsCurriculumKeys.all, "list"] as const,

    /**
     * Key for a specific list query with params
     */
    list: (params?: ProgramsCurriculumListParams) =>
        [...programsCurriculumKeys.lists(), params ?? {}] as const,

    /**
     * Key for all detail queries
     */
    details: () => [...programsCurriculumKeys.all, "detail"] as const,

    /**
     * Key for a specific detail query
     */
    detail: (id: string | number) =>
        [...programsCurriculumKeys.details(), String(id)] as const,

    /**
     * Key for metadata query
     */
    metadata: () => [...programsCurriculumKeys.all, "metadata"] as const,
};

/**
 * Type for programs curriculum query keys
 */
export type ProgramsCurriculumQueryKey =
    | typeof programsCurriculumKeys.all
    | ReturnType<typeof programsCurriculumKeys.lists>
    | ReturnType<typeof programsCurriculumKeys.list>
    | ReturnType<typeof programsCurriculumKeys.details>
    | ReturnType<typeof programsCurriculumKeys.detail>
    | ReturnType<typeof programsCurriculumKeys.metadata>;
