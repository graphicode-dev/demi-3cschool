/**
 * Users Feature - Query Hooks
 *
 * TanStack Query hooks for reading users data.
 * All queries support AbortSignal for cancellation.
 *
 * @example
 * ```tsx
 * // Get all users
 * const { data: users } = useUsersList();
 *
 * // Get users with pagination
 * const { data: users } = useUsersList({ page: 1, perPage: 10 });
 * ```
 */

import {
    useQuery,
    keepPreviousData,
    type UseQueryOptions,
} from "@tanstack/react-query";
import { userKeys } from "./users.keys";
import { usersApi } from "./users.api";
import { ListQueryParams, PaginatedData } from "@/shared/api";
import type { User } from "../types";

// ============================================================================
// Users List Query
// ============================================================================

/**
 * Hook to fetch list of all users
 *
 * @param params - Query parameters for pagination and filtering
 * @param options - Additional query options
 *
 * @example
 * ```tsx
 * const { data: users } = useUsersList();
 * const { data: users } = useUsersList({ page: 1, perPage: 10 });
 * ```
 */
export function useUsersList(
    params?: ListQueryParams,
    options?: Partial<UseQueryOptions<PaginatedData<User>, Error>>
) {
    return useQuery({
        queryKey: userKeys.list(params),
        queryFn: ({ signal }) => usersApi.getList(params, signal),
        placeholderData: keepPreviousData,
        staleTime: 1000 * 60 * 2, // 2 minutes
        ...options,
    });
}
