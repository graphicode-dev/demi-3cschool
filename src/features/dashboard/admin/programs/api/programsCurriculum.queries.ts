/**
 * Programs Curriculum Feature - Query Hooks
 *
 * TanStack Query hooks for reading programs curriculum data.
 * All queries support AbortSignal for cancellation.
 *
 * @example
 * ```tsx
 * // Get programs curriculum metadata
 * const { data: metadata } = useProgramsCurriculumMetadata();
 *
 * // Get paginated list
 * const { data } = useProgramsCurriculumList({ page: 1 });
 *
 * // Get single programs curriculum
 * const { data: curriculum } = useProgramCurriculum(id);
 * ```
 */

import { useQuery, type UseQueryOptions } from "@tanstack/react-query";
import { programsCurriculumKeys } from "./programsCurriculum.keys";
import { programsCurriculumApi } from "./programsCurriculum.api";
import type {
    ProgramCurriculum,
    ProgramsCurriculumListParams,
    ProgramsCurriculumMetadata,
    ProgramCurriculumPaginatedData,
} from "../types";

// ============================================================================
// Query Hooks
// ============================================================================

/**
 * Hook to fetch programs curriculum metadata
 *
 * @param options - Additional query options
 *
 * @example
 * ```tsx
 * const { data: metadata } = useProgramsCurriculumMetadata();
 * ```
 */
export function useProgramsCurriculumMetadata(
    options?: Partial<UseQueryOptions<ProgramsCurriculumMetadata, Error>>
) {
    return useQuery({
        queryKey: programsCurriculumKeys.metadata(),
        queryFn: ({ signal }) => programsCurriculumApi.getMetadata(signal),
        staleTime: 1000 * 60 * 30, // 30 minutes - metadata rarely changes
        ...options,
    });
}

/**
 * Hook to fetch paginated list of programs curriculums
 *
 * @param params - Query parameters for filtering/pagination
 * @param options - Additional query options
 *
 * @example
 * ```tsx
 * const { data, isLoading } = useProgramsCurriculumList({ page: 1 });
 * const items = data?.items ?? [];
 * ```
 */
export function useProgramsCurriculumList(
    params?: ProgramsCurriculumListParams,
    options?: Partial<
        UseQueryOptions<
            ProgramCurriculumPaginatedData<ProgramCurriculum>,
            Error
        >
    >
) {
    return useQuery({
        queryKey: programsCurriculumKeys.list(params),
        queryFn: ({ signal }) => programsCurriculumApi.getList(params, signal),
        staleTime: 1000 * 60 * 5, // 5 minutes
        ...options,
    });
}

/**
 * Hook to fetch a single programs curriculum by ID
 *
 * @param id - Programs curriculum ID
 * @param options - Additional query options
 *
 * @example
 * ```tsx
 * const { data: curriculum } = useProgramCurriculum(id, {
 *     enabled: !!id,
 * });
 * ```
 */
export function useProgramCurriculum(
    id: string | number,
    options?: Partial<UseQueryOptions<ProgramCurriculum, Error>>
) {
    return useQuery({
        queryKey: programsCurriculumKeys.detail(id),
        queryFn: ({ signal }) => programsCurriculumApi.getById(id, signal),
        enabled: !!id,
        staleTime: 1000 * 60 * 5, // 5 minutes
        ...options,
    });
}
