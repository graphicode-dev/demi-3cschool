/**
 * Lessons Feature - Query Hooks
 *
 * TanStack Query hooks for reading lesson data.
 * All queries support AbortSignal for cancellation.
 *
 * @example
 * ```tsx
 * // Get lessons metadata
 * const { data: metadata } = useLessonsMetadata();
 *
 * // List all lessons with pagination
 * const { data, isLoading } = useLessonsList({ page: 1 });
 *
 * // List lessons grouped by course
 * const { data } = useLessonsListGrouped();
 *
 * // List lessons by level ID
 * const { data } = useLessonsByLevel({ levelId: '1', page: 1 });
 *
 * // Get single lesson
 * const { data: lesson } = useLesson(lessonId);
 * ```
 */

import {
    useQuery,
    useInfiniteQuery,
    type UseQueryOptions,
} from "@tanstack/react-query";
import { lessonKeys } from "./lessons.keys";
import { lessonsApi } from "./lessons.api";
import type {
    Lesson,
    LessonGroup,
    LessonsListParams,
    LessonsByLevelParams,
    LessonsMetadata,
} from "../types/lessons.types";
import { PaginatedData } from "../types";

// ============================================================================
// Metadata Query
// ============================================================================

/**
 * Hook to fetch lessons metadata (filters, operators, field types)
 *
 * @param options - Additional query options
 *
 * @example
 * ```tsx
 * const { data: metadata, isLoading } = useLessonsMetadata();
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
export function useLessonsMetadata(
    options?: Partial<UseQueryOptions<LessonsMetadata, Error>>
) {
    return useQuery({
        queryKey: lessonKeys.metadata(),
        queryFn: ({ signal }) => lessonsApi.getMetadata(signal),
        staleTime: 1000 * 60 * 30, // 30 minutes - metadata rarely changes
        ...options,
    });
}

// ============================================================================
// List Queries
// ============================================================================

/**
 * Hook to fetch list of all lessons (paginated or grouped based on type param)
 *
 * @param params - Query parameters for pagination and filtering
 * @param options - Additional query options
 *
 * @example
 * ```tsx
 * // Paginated list
 * const { data } = useLessonsList({ page: 1, programs_curriculum: "standard" });
 *
 * // Grouped list
 * const { data } = useLessonsList({ type: "group", programs_curriculum: "standard" });
 * ```
 */
export function useLessonsList<T extends LessonsListParams | undefined>(
    params?: T,
    options?: Partial<
        UseQueryOptions<
            T extends { type: "group" } ? LessonGroup[] : PaginatedData<Lesson>,
            Error
        >
    >
) {
    return useQuery({
        queryKey: lessonKeys.list(params),
        queryFn: ({ signal }) => lessonsApi.getList(params, signal),
        ...options,
    });
}

/**
 * Hook to fetch list of lessons by level ID (paginated or grouped based on type param)
 *
 * @param params - Query parameters including levelId, pagination and filtering
 * @param options - Additional query options
 *
 * @example
 * ```tsx
 * // Paginated list
 * const { data } = useLessonsByLevel({ levelId: '1', page: 1, programs_curriculum: "standard" });
 *
 * // Grouped list
 * const { data } = useLessonsByLevel({ levelId: '1', type: "group", programs_curriculum: "standard" });
 * ```
 */
export function useLessonsByLevel<T extends LessonsByLevelParams>(
    params: T,
    options?: Partial<
        UseQueryOptions<
            T extends { type: "group" } ? LessonGroup[] : PaginatedData<Lesson>,
            Error
        >
    >
) {
    return useQuery({
        queryKey: lessonKeys.byLevel(params),
        queryFn: ({ signal }) => lessonsApi.getByLevel(params, signal),
        enabled: !!params.levelId,
        ...options,
    });
}

/**
 * Hook to fetch infinite list of all lessons (for infinite scroll)
 *
 * @example
 * ```tsx
 * const {
 *     data,
 *     fetchNextPage,
 *     hasNextPage,
 *     isFetchingNextPage,
 * } = useLessonsInfinite();
 *
 * return (
 *     <>
 *         {data?.pages.map(page =>
 *             page.items.map(lesson => <LessonCard key={lesson.id} lesson={lesson} />)
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
export function useLessonsInfinite() {
    return useInfiniteQuery({
        queryKey: lessonKeys.infinite(),
        queryFn: ({ pageParam, signal }) =>
            lessonsApi.getList({ page: pageParam as number }, signal),
        initialPageParam: 1,
        getNextPageParam: (lastPage) => {
            const { currentPage, lastPage: totalPages } = lastPage;
            return currentPage < totalPages ? currentPage + 1 : undefined;
        },
    });
}

/**
 * Hook to fetch infinite list of lessons by level ID (for infinite scroll)
 *
 * @param levelId - The level ID to filter by
 *
 * @example
 * ```tsx
 * const {
 *     data,
 *     fetchNextPage,
 *     hasNextPage,
 * } = useLessonsInfiniteByLevel('1');
 * ```
 */
export function useLessonsInfiniteByLevel(levelId: string) {
    return useInfiniteQuery({
        queryKey: lessonKeys.infiniteByLevel(levelId),
        queryFn: ({ pageParam, signal }) =>
            lessonsApi.getByLevel(
                { levelId, page: pageParam as number },
                signal
            ),
        initialPageParam: 1,
        getNextPageParam: (lastPage) => {
            const { currentPage, lastPage: totalPages } = lastPage;
            return currentPage < totalPages ? currentPage + 1 : undefined;
        },
        enabled: !!levelId,
    });
}

// ============================================================================
// Detail Queries
// ============================================================================

/**
 * Hook to fetch single lesson by ID
 *
 * @param id - Lesson ID
 * @param options - Additional query options
 *
 * @example
 * ```tsx
 * const { data: lesson, isLoading, error } = useLesson(lessonId);
 *
 * if (isLoading) return <Spinner />;
 * if (error) return <ErrorMessage error={error} />;
 *
 * return (
 *     <div>
 *         <h1>{lesson.title}</h1>
 *         <p>{lesson.description}</p>
 *     </div>
 * );
 * ```
 */
export function useLesson(
    id: string | undefined | null,
    options?: Partial<UseQueryOptions<Lesson, Error>>
) {
    return useQuery({
        queryKey: lessonKeys.detail(id ?? ""),
        queryFn: ({ signal }) => lessonsApi.getById(id!, signal),
        enabled: !!id,
        ...options,
    });
}
