/**
 * Levels Feature - Query Hooks
 *
 * TanStack Query hooks for reading level data.
 * All queries support AbortSignal for cancellation.
 *
 * @example
 * ```tsx
 * // Get levels metadata
 * const { data: metadata } = useLevelsMetadata();
 *
 * // List all levels with pagination
 * const { data, isLoading } = useLevelsList({ page: 1 });
 *
 * // List levels grouped by course
 * const { data } = useLevelsListGrouped();
 *
 * // List levels by course ID
 * const { data } = useLevelsByCourse({ courseId: '1', page: 1 });
 *
 * // Get single level
 * const { data: level } = useLevel(levelId);
 * ```
 */

import {
    useQuery,
    useInfiniteQuery,
    type UseQueryOptions,
} from "@tanstack/react-query";
import { levelKeys } from "./levels.keys";
import { levelsApi } from "./levels.api";
import type {
    Level,
    LevelGroup,
    LevelByGrade,
    LevelsListParams,
    LevelsByCourseParams,
    LevelsMetadata,
    PaginatedData,
} from "../types/levels.types";

// ============================================================================
// Metadata Query
// ============================================================================

/**
 * Hook to fetch levels metadata (filters, operators, field types)
 *
 * @param options - Additional query options
 *
 * @example
 * ```tsx
 * const { data: metadata, isLoading } = useLevelsMetadata();
 *
 * if (isLoading) return <Spinner />;
 *
 * return (
 *     <FilterBuilder
 *         filters={metadata.filters}
 *         operators={metadata.operators}
 *     />
 * );
 * ```
 */
export function useLevelsMetadata(
    options?: Partial<UseQueryOptions<LevelsMetadata, Error>>
) {
    return useQuery({
        queryKey: levelKeys.metadata(),
        queryFn: ({ signal }) => levelsApi.getMetadata(signal),
        staleTime: 1000 * 60 * 30, // 30 minutes - metadata rarely changes
        ...options,
    });
}

// ============================================================================
// List Queries
// ============================================================================

/**
 * Hook to fetch list of all levels (paginated or grouped based on type param)
 *
 * @param params - Query parameters for pagination and filtering
 * @param options - Additional query options
 *
 * @example
 * ```tsx
 * // Paginated list
 * const { data } = useLevelsList({ page: 1, programs_curriculum: "standard" });
 *
 * // Grouped list
 * const { data } = useLevelsList({ type: "group", programs_curriculum: "standard" });
 * ```
 */
export function useLevelsList(
    params?: LevelsListParams,
    options?: Partial<UseQueryOptions<PaginatedData<Level>, Error>>
) {
    return useQuery({
        queryKey: levelKeys.list(params),
        queryFn: ({ signal }) => levelsApi.getList(params, signal),
        ...options,
    });
}

/**
 * Hook to fetch list of levels by course ID (paginated or grouped based on type param)
 *
 * @param params - Query parameters including courseId, pagination and filtering
 * @param options - Additional query options
 *
 * @example
 * ```tsx
 * // Paginated list
 * const { data } = useLevelsByCourse({ courseId: '1', page: 1, programs_curriculum: "standard" });
 *
 * // Grouped list
 * const { data } = useLevelsByCourse({ courseId: '1', type: "group", programs_curriculum: "standard" });
 * ```
 */
export function useLevelsByCourse<T extends LevelsByCourseParams>(
    params: T,
    options?: Partial<
        UseQueryOptions<
            T extends { type: "group" } ? LevelGroup[] : PaginatedData<Level>,
            Error
        >
    >
) {
    return useQuery({
        queryKey: levelKeys.byCourse(params),
        queryFn: ({ signal }) => levelsApi.getByCourse(params, signal),
        enabled: !!params.courseId,
        ...options,
    });
}

/**
 * Hook to fetch infinite list of all levels (for infinite scroll)
 *
 * @example
 * ```tsx
 * const {
 *     data,
 *     fetchNextPage,
 *     hasNextPage,
 *     isFetchingNextPage,
 * } = useLevelsInfinite();
 *
 * return (
 *     <>
 *         {data?.pages.map(page =>
 *             page.items.map(level => <LevelCard key={level.id} level={level} />)
 *         )}
 *         {hasNextPage && (
 *             <button onClick={() => fetchNextPage()}>
 *                 {isFetchingNextPage ? 'Loading...' : 'Load More'}
 *             </button>
 *         )}
 *     </>
 * );
 * ```
 */
export function useLevelsInfinite() {
    return useInfiniteQuery({
        queryKey: levelKeys.infinite(),
        queryFn: ({ pageParam, signal }) =>
            levelsApi.getList({ page: pageParam as number }, signal),
        initialPageParam: 1,
        getNextPageParam: (lastPage) => {
            const { currentPage, lastPage: totalPages } = lastPage;
            return currentPage < totalPages ? currentPage + 1 : undefined;
        },
    });
}

/**
 * Hook to fetch infinite list of levels by course ID (for infinite scroll)
 *
 * @param courseId - The course ID to filter by
 *
 * @example
 * ```tsx
 * const {
 *     data,
 *     fetchNextPage,
 *     hasNextPage,
 * } = useLevelsInfiniteByCourse('1');
 * ```
 */
export function useLevelsInfiniteByCourse(courseId: string) {
    return useInfiniteQuery({
        queryKey: levelKeys.infiniteByCourse(courseId),
        queryFn: ({ pageParam, signal }) =>
            levelsApi.getByCourse(
                { courseId, page: pageParam as number },
                signal
            ),
        initialPageParam: 1,
        getNextPageParam: (lastPage) => {
            const { currentPage, lastPage: totalPages } = lastPage;
            return currentPage < totalPages ? currentPage + 1 : undefined;
        },
        enabled: !!courseId,
    });
}

// ============================================================================
// Detail Queries
// ============================================================================

/**
 * Hook to fetch single level by ID
 *
 * @param id - Level ID
 * @param options - Additional query options
 *
 * @example
 * ```tsx
 * const { data: level, isLoading, error } = useLevel(levelId);
 *
 * if (isLoading) return <Spinner />;
 * if (error) return <ErrorMessage error={error} />;
 *
 * return (
 *     <div>
 *         <h1>{level.title}</h1>
 *         <p>{level.description}</p>
 *     </div>
 * );
 * ```
 */
export function useLevel(
    id: string | undefined | null,
    options?: Partial<UseQueryOptions<Level, Error>>
) {
    return useQuery({
        queryKey: levelKeys.detail(id ?? ""),
        queryFn: ({ signal }) => levelsApi.getById(id!, signal),
        enabled: !!id,
        ...options,
    });
}

// ============================================================================
// By Grade Query
// ============================================================================

/**
 * Hook to fetch levels by grade ID
 *
 * @param gradeId - Grade ID to filter by
 * @param options - Additional query options
 *
 * @example
 * ```tsx
 * const { data: levels, isLoading } = useLevelsByGrade(gradeId);
 * ```
 */
export function useLevelsByGrade(
    gradeId: string | number | undefined | null,
    options?: Partial<UseQueryOptions<PaginatedData<LevelByGrade>, Error>>
) {
    return useQuery({
        queryKey: levelKeys.byGrade(gradeId ?? ""),
        queryFn: ({ signal }) => levelsApi.getByGrade(gradeId!, signal),
        enabled: !!gradeId,
        ...options,
    });
}
