/**
 * Staff Feature - Query Hooks
 *
 * TanStack Query hooks for reading staff data.
 * All queries support AbortSignal for cancellation.
 *
 * @example
 * ```tsx
 * // Get all staff
 * const { data: staff } = useStaffList();
 *
 * // Get single staff member
 * const { data: member } = useStaff(staffId);
 *
 * // Get staff metadata
 * const { data: metadata } = useStaffMetadata();
 * ```
 */

import {
    useQuery,
    keepPreviousData,
    type UseQueryOptions,
} from "@tanstack/react-query";
import { staffKeys } from "./staff.keys";
import { staffApi } from "./staff.api";
import { ListQueryParams } from "@/shared/api";
import type { Staff, StaffMetadata } from "./types";

// ============================================================================
// Staff List Query
// ============================================================================

/**
 * Hook to fetch list of all staff
 *
 * @param params - Query parameters for filtering
 * @param options - Additional query options
 *
 * @example
 * ```tsx
 * const { data: staff } = useStaffList();
 * ```
 */
export function useStaffList(
    params?: ListQueryParams,
    options?: Partial<UseQueryOptions<Staff[], Error>>
) {
    return useQuery({
        queryKey: staffKeys.list(params),
        queryFn: ({ signal }) => staffApi.getList(params, signal),
        placeholderData: keepPreviousData,
        staleTime: 1000 * 60 * 2, // 2 minutes
        ...options,
    });
}

// ============================================================================
// Single Staff Query
// ============================================================================

/**
 * Hook to fetch a single staff member by ID
 *
 * @param id - Staff member ID
 * @param options - Additional query options
 *
 * @example
 * ```tsx
 * const { data: member } = useStaff(staffId);
 * ```
 */
export function useStaff(
    id: number,
    options?: Partial<UseQueryOptions<Staff, Error>>
) {
    return useQuery({
        queryKey: staffKeys.detail(id),
        queryFn: ({ signal }) => staffApi.getById(id, signal),
        staleTime: 1000 * 60 * 5, // 5 minutes
        enabled: !!id,
        ...options,
    });
}

// ============================================================================
// Staff Metadata Query
// ============================================================================

/**
 * Hook to fetch staff metadata (filters, operators, field types)
 *
 * @param options - Additional query options
 *
 * @example
 * ```tsx
 * const { data: metadata } = useStaffMetadata();
 * ```
 */
export function useStaffMetadata(
    options?: Partial<UseQueryOptions<StaffMetadata, Error>>
) {
    return useQuery({
        queryKey: staffKeys.metadata(),
        queryFn: ({ signal }) => staffApi.getMetadata(signal),
        staleTime: 1000 * 60 * 30, // 30 minutes - metadata rarely changes
        ...options,
    });
}
