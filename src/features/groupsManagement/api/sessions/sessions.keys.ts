/**
 * Group Sessions Management Feature - Query Keys
 *
 * Stable query key factory for TanStack Query.
 * Keys are hierarchical for easy invalidation.
 *
 * @example
 * ```ts
 * // Invalidate all sessions data
 * queryClient.invalidateQueries({ queryKey: sessionKeys.all });
 *
 * // Invalidate only lists (keeps detail cache)
 * queryClient.invalidateQueries({ queryKey: sessionKeys.lists() });
 *
 * // Invalidate specific session
 * queryClient.invalidateQueries({ queryKey: sessionKeys.detail(sessionId) });
 * ```
 */

import type { SessionsListParams } from "../../types/sessions.types";

/**
 * Query key factory for group sessions
 *
 * Hierarchy:
 * - all: ['group-sessions']
 * - metadata: ['group-sessions', 'metadata']
 * - lists: ['group-sessions', 'list']
 * - list(params): ['group-sessions', 'list', ...params]
 * - details: ['group-sessions', 'detail']
 * - detail(id): ['group-sessions', 'detail', id]
 */
export const sessionKeys = {
    /**
     * Root key for all session queries
     */
    all: ["group-sessions"] as const,

    /**
     * Key for metadata query
     */
    metadata: () => [...sessionKeys.all, "metadata"] as const,

    /**
     * Key for all list queries
     */
    lists: () => [...sessionKeys.all, "list"] as const,

    /**
     * Key for specific list with all filter parameters
     */
    list: (params: SessionsListParams) =>
        [
            ...sessionKeys.lists(),
            {
                id: params.id,
                name: params.name,
                course_id: params.course_id,
                level_id: params.level_id,
                group_type: params.group_type,
                location_type: params.location_type,
                is_active: params.is_active,
                max_capacity: params.max_capacity,
                created_at: params.created_at,
                search: params.search,
                page: params.page,
                limit: params.limit,
                sort_by: params.sort_by,
                sort_order: params.sort_order,
            },
        ] as const,

    /**
     * Key for all detail queries
     */
    details: () => [...sessionKeys.all, "detail"] as const,

    /**
     * Key for specific session detail
     */
    detail: (id: number) => [...sessionKeys.details(), id] as const,

    /**
     * Key for sessions by group
     */
    byGroup: (groupId: number) =>
        [...sessionKeys.all, "group", groupId] as const,

    /**
     * Key for sessions by lesson
     */
    byLesson: (lessonId: number) =>
        [...sessionKeys.all, "lesson", lessonId] as const,
};

/**
 * Type for session query keys
 */
export type SessionQueryKey =
    | typeof sessionKeys.all
    | ReturnType<typeof sessionKeys.metadata>
    | ReturnType<typeof sessionKeys.lists>
    | ReturnType<typeof sessionKeys.list>
    | ReturnType<typeof sessionKeys.details>
    | ReturnType<typeof sessionKeys.detail>
    | ReturnType<typeof sessionKeys.byGroup>
    | ReturnType<typeof sessionKeys.byLesson>;
