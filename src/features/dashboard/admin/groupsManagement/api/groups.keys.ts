/**
 * Groups Management Feature - Query Keys
 *
 * Stable query key factory for TanStack Query.
 * Keys are hierarchical for easy invalidation.
 *
 * @example
 * ```ts
 * // Invalidate all groups data
 * queryClient.invalidateQueries({ queryKey: groupKeys.all });
 *
 * // Invalidate only lists (keeps detail cache)
 * queryClient.invalidateQueries({ queryKey: groupKeys.lists() });
 *
 * // Invalidate specific group
 * queryClient.invalidateQueries({ queryKey: groupKeys.detail(groupId) });
 * ```
 */

import type {
    GroupsListParams,
    GroupRecommendPayload,
} from "../types/groups.types";

/**
 * Query key factory for groups
 *
 * Hierarchy:
 * - all: ['groups']
 * - metadata: ['groups', 'metadata']
 * - lists: ['groups', 'list']
 * - list(params): ['groups', 'list', groupType, params]
 * - details: ['groups', 'detail']
 * - detail(id): ['groups', 'detail', id]
 * - recommendations: ['groups', 'recommendations']
 * - recommend(params): ['groups', 'recommendations', params]
 */
export const groupKeys = {
    /**
     * Root key for all group queries
     */
    all: ["groups"] as const,

    /**
     * Key for metadata query
     */
    metadata: () => [...groupKeys.all, "metadata"] as const,

    /**
     * Key for all list queries
     */
    lists: () => [...groupKeys.all, "list"] as const,

    /**
     * Key for specific list with params (includes groupType and page)
     */
    list: (params: GroupsListParams) =>
        [
            ...groupKeys.lists(),
            params.groupType,
            { page: params.page },
        ] as const,

    /**
     * Key for all lists of a specific group type
     */
    listByType: (groupType: string) =>
        [...groupKeys.lists(), groupType] as const,

    /**
     * Key for infinite list queries
     */
    infinite: (groupType: string) =>
        [...groupKeys.all, "infinite", groupType] as const,

    /**
     * Key for all detail queries
     */
    details: () => [...groupKeys.all, "detail"] as const,

    /**
     * Key for specific group detail
     */
    detail: (id: string) => [...groupKeys.details(), id] as const,

    /**
     * Key for all recommendation queries
     */
    recommendations: () => [...groupKeys.all, "recommendations"] as const,

    /**
     * Key for specific recommendation query
     */
    recommend: (params: GroupRecommendPayload) =>
        [...groupKeys.recommendations(), params] as const,
};

/**
 * Type for group query keys
 */
export type GroupQueryKey =
    | typeof groupKeys.all
    | ReturnType<typeof groupKeys.metadata>
    | ReturnType<typeof groupKeys.lists>
    | ReturnType<typeof groupKeys.list>
    | ReturnType<typeof groupKeys.listByType>
    | ReturnType<typeof groupKeys.infinite>
    | ReturnType<typeof groupKeys.details>
    | ReturnType<typeof groupKeys.detail>
    | ReturnType<typeof groupKeys.recommendations>
    | ReturnType<typeof groupKeys.recommend>;
