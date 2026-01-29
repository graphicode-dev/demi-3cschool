/**
 * CRUD Factory - Query Key Factory
 *
 * Creates a type-safe query key factory for TanStack Query.
 * Keys are hierarchical for easy invalidation.
 *
 * @example
 * ```ts
 * const courseKeys = createQueryKeys('courses');
 *
 * courseKeys.all           // ['courses']
 * courseKeys.lists()       // ['courses', 'list']
 * courseKeys.list({ page: 1 }) // ['courses', 'list', { page: 1 }]
 * courseKeys.detail(1)     // ['courses', 'detail', 1]
 *
 * // Invalidation examples
 * queryClient.invalidateQueries({ queryKey: courseKeys.all });
 * queryClient.invalidateQueries({ queryKey: courseKeys.lists() });
 * ```
 */

import type { EntityId, QueryKeyFactory } from "./crud.types";

/**
 * Create a query key factory for an entity
 *
 * @param entity - Entity name (e.g., 'courses', 'users')
 * @returns Query key factory with hierarchical keys
 */
export function createQueryKeys<T extends string>(
    entity: T
): QueryKeyFactory<T> {
    return {
        /**
         * Root key for all entity queries
         */
        all: [entity] as const,

        /**
         * Key for all list queries
         */
        lists: () => [entity, "list"] as const,

        /**
         * Key for specific list with params
         */
        list: (params?: Record<string, unknown>) =>
            params
                ? ([entity, "list", params] as const)
                : ([entity, "list"] as const),

        /**
         * Key for infinite list queries
         */
        infinite: (params?: Record<string, unknown>) =>
            params
                ? ([entity, "infinite", params] as const)
                : ([entity, "infinite"] as const),

        /**
         * Key for all detail queries
         */
        details: () => [entity, "detail"] as const,

        /**
         * Key for specific entity detail
         */
        detail: (id: EntityId) => [entity, "detail", id] as const,
    };
}

export default createQueryKeys;
