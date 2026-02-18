/**
 * Roles Feature - Query Hooks
 *
 * TanStack Query hooks for reading roles data.
 * All queries support AbortSignal for cancellation.
 *
 * @example
 * ```tsx
 * // Get all roles
 * const { data: roles } = useRolesList();
 *
 * // Get single role
 * const { data: role } = useRole(roleId);
 *
 * // Get roles metadata
 * const { data: metadata } = useRolesMetadata();
 * ```
 */

import {
    useQuery,
    keepPreviousData,
    type UseQueryOptions,
} from "@tanstack/react-query";
import { roleKeys } from "./roles.keys";
import { rolesApi } from "./roles.api";
import { ListQueryParams, PaginatedData } from "@/shared/api";
import type { Role, RoleMetadata } from "../types";

// ============================================================================
// Roles List Query
// ============================================================================

/**
 * Hook to fetch list of all roles
 *
 * @param params - Query parameters for pagination and filtering
 * @param options - Additional query options
 *
 * @example
 * ```tsx
 * const { data: roles } = useRolesList();
 * const { data: roles } = useRolesList({ page: 1, perPage: 10 });
 * ```
 */
export function useRolesList(
    params?: ListQueryParams,
    options?: Partial<UseQueryOptions<PaginatedData<Role>, Error>>
) {
    return useQuery({
        queryKey: roleKeys.list(params),
        queryFn: ({ signal }) => rolesApi.getList(params, signal),
        placeholderData: keepPreviousData,
        staleTime: 1000 * 60 * 2, // 2 minutes
        ...options,
    });
}

// ============================================================================
// Single Role Query
// ============================================================================

/**
 * Hook to fetch a single role by ID
 *
 * @param id - Role ID
 * @param options - Additional query options
 *
 * @example
 * ```tsx
 * const { data: role } = useRole(roleId);
 * ```
 */
export function useRole(
    id: number,
    options?: Partial<UseQueryOptions<Role, Error>>
) {
    return useQuery({
        queryKey: roleKeys.detail(id),
        queryFn: ({ signal }) => rolesApi.getById(id, signal),
        staleTime: 1000 * 60 * 5, // 5 minutes
        enabled: !!id,
        ...options,
    });
}

// ============================================================================
// Roles Metadata Query
// ============================================================================

/**
 * Hook to fetch roles metadata (filters, operators, field types)
 *
 * @param options - Additional query options
 *
 * @example
 * ```tsx
 * const { data: metadata } = useRolesMetadata();
 * ```
 */
export function useRolesMetadata(
    options?: Partial<UseQueryOptions<RoleMetadata, Error>>
) {
    return useQuery({
        queryKey: roleKeys.metadata(),
        queryFn: ({ signal }) => rolesApi.getMetadata(signal),
        staleTime: 1000 * 60 * 30, // 30 minutes - metadata rarely changes
        ...options,
    });
}
