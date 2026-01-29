/**
 * CRUD Factory - Hooks Factory
 *
 * Creates type-safe TanStack Query hooks for CRUD operations.
 * Includes list, detail, infinite scroll, and mutation hooks.
 *
 * @example
 * ```ts
 * const courseHooks = createCrudHooks({
 *     entity: 'courses',
 *     api: coursesApi,
 *     keys: courseKeys,
 * });
 *
 * // Use in components
 * const { data } = courseHooks.useList({ page: 1 });
 * const { data: course } = courseHooks.useDetail(courseId);
 * const { mutate } = courseHooks.useCreate();
 * ```
 */

import {
    useQuery,
    useInfiniteQuery,
    useMutation,
    useQueryClient,
    type UseQueryOptions,
} from "@tanstack/react-query";
import type {
    CrudApi,
    CrudHooksConfig,
    EntityId,
    InvalidationStrategy,
    PaginatedResponse,
    QueryKeyFactory,
    UpdateVariables,
} from "./crud.types";

/**
 * CRUD hooks interface
 */
export interface CrudHooks<
    TEntity,
    TCreatePayload,
    TUpdatePayload,
    TListParams,
> {
    useList: (
        params?: TListParams,
        options?: Partial<UseQueryOptions<PaginatedResponse<TEntity>, Error>>
    ) => ReturnType<typeof useQuery<PaginatedResponse<TEntity>, Error>>;

    useInfinite: (
        params?: Omit<TListParams, "page">
    ) => ReturnType<typeof useInfiniteQuery<PaginatedResponse<TEntity>, Error>>;

    useDetail: (
        id: EntityId | undefined | null,
        options?: Partial<UseQueryOptions<TEntity, Error>>
    ) => ReturnType<typeof useQuery<TEntity, Error>>;

    useCreate: () => ReturnType<
        typeof useMutation<TEntity, Error, TCreatePayload>
    >;

    useUpdate: () => ReturnType<
        typeof useMutation<TEntity, Error, UpdateVariables<TUpdatePayload>>
    >;

    useDelete: () => ReturnType<typeof useMutation<void, Error, EntityId>>;
}

/**
 * Create CRUD hooks for an entity
 *
 * @param config - Hooks configuration
 * @returns Object with useList, useDetail, useCreate, useUpdate, useDelete hooks
 */
export function createCrudHooks<
    TEntity,
    TCreatePayload,
    TUpdatePayload,
    TListParams = Record<string, unknown>,
>(
    config: CrudHooksConfig<
        TEntity,
        TCreatePayload,
        TUpdatePayload,
        TListParams
    >
): CrudHooks<TEntity, TCreatePayload, TUpdatePayload, TListParams> {
    const { api, keys, invalidation = {} } = config;

    const {
        onCreate = "list",
        onUpdate = "all",
        onDelete = "all",
    } = invalidation;

    /**
     * Invalidate queries based on strategy
     */
    const invalidateByStrategy = (
        queryClient: ReturnType<typeof useQueryClient>,
        strategy: InvalidationStrategy,
        id?: EntityId
    ) => {
        switch (strategy) {
            case "all":
                queryClient.invalidateQueries({ queryKey: keys.all });
                break;
            case "list":
                // Invalidate both paginated and infinite lists
                queryClient.invalidateQueries({ queryKey: keys.lists() });
                queryClient.invalidateQueries({
                    queryKey: [keys.all[0], "infinite"],
                });
                break;
            case "detail":
                if (id !== undefined) {
                    queryClient.invalidateQueries({
                        queryKey: keys.detail(id),
                    });
                }
                break;
            case "none":
                break;
        }
    };

    return {
        /**
         * Hook to fetch paginated list
         */
        useList: (
            params?: TListParams,
            options?: Partial<
                UseQueryOptions<PaginatedResponse<TEntity>, Error>
            >
        ) => {
            return useQuery({
                queryKey: keys.list(params as Record<string, unknown>),
                queryFn: ({ signal }) => api.getList(params, signal),
                ...options,
            });
        },

        /**
         * Hook to fetch infinite list
         */
        useInfinite: (params?: Omit<TListParams, "page">) => {
            return useInfiniteQuery({
                queryKey: keys.infinite(params as Record<string, unknown>),
                queryFn: ({ pageParam, signal }) =>
                    api.getList(
                        {
                            ...params,
                            page: pageParam,
                        } as unknown as TListParams,
                        signal
                    ),
                initialPageParam: 1,
                getNextPageParam: (lastPage) => {
                    const { currentPage, lastPage: totalPages } = lastPage.meta;
                    return currentPage < totalPages
                        ? currentPage + 1
                        : undefined;
                },
            });
        },

        /**
         * Hook to fetch single entity by ID
         */
        useDetail: (
            id: EntityId | undefined | null,
            options?: Partial<UseQueryOptions<TEntity, Error>>
        ) => {
            // Use a placeholder key when id is not available
            // The query is disabled anyway, so this key won't be used for fetching
            const queryKey =
                id !== undefined && id !== null
                    ? keys.detail(id)
                    : keys.detail("__placeholder__");

            return useQuery({
                queryKey,
                queryFn: ({ signal }) => api.getById(id!, signal),
                enabled: id !== undefined && id !== null,
                ...options,
            });
        },

        /**
         * Hook to create a new entity
         */
        useCreate: () => {
            const queryClient = useQueryClient();

            return useMutation<TEntity, Error, TCreatePayload>({
                mutationFn: (payload) => api.create(payload),
                onSuccess: () => {
                    invalidateByStrategy(queryClient, onCreate);
                },
            });
        },

        /**
         * Hook to update an existing entity
         */
        useUpdate: () => {
            const queryClient = useQueryClient();

            return useMutation<TEntity, Error, UpdateVariables<TUpdatePayload>>(
                {
                    mutationFn: ({ id, data }) => api.update(id, data),
                    onSuccess: (_, variables) => {
                        invalidateByStrategy(
                            queryClient,
                            onUpdate,
                            variables.id
                        );
                    },
                }
            );
        },

        /**
         * Hook to delete an entity
         */
        useDelete: () => {
            const queryClient = useQueryClient();

            return useMutation<void, Error, EntityId>({
                mutationFn: (id) => api.delete(id),
                onSuccess: (_, id) => {
                    invalidateByStrategy(queryClient, onDelete, id);
                    // Also remove the detail query from cache
                    queryClient.removeQueries({ queryKey: keys.detail(id) });
                },
            });
        },
    };
}

export default createCrudHooks;
