/**
 * Courses Feature - Query Hooks
 *
 * TanStack Query hooks for reading course data.
 * All queries support AbortSignal for cancellation.
 *
 * @example
 * ```tsx
 * // Get courses metadata
 * const { data: metadata } = useCoursesMetadata();
 *
 * // List all courses with pagination
 * const { data, isLoading } = useCoursesList({ page: 1 });
 *
 * // List courses by program type
 * const { data } = useCoursesByProgram({ programType: 'standard', page: 1 });
 *
 * // Get single course
 * const { data: course } = useCourse(courseId);
 * ```
 */

import {
    useQuery,
    useInfiniteQuery,
    type UseQueryOptions,
} from "@tanstack/react-query";
import { courseKeys } from "./courses.keys";
import { coursesApi } from "./courses.api";
import type {
    Course,
    CoursesListParams,
    CoursesByProgramParams,
    CoursesMetadata,
    PaginatedData,
    ProgramType,
} from "../types/courses.types";

// ============================================================================
// Metadata Query
// ============================================================================

/**
 * Hook to fetch courses metadata (filters, operators, field types)
 *
 * @param options - Additional query options
 *
 * @example
 * ```tsx
 * const { data: metadata, isLoading } = useCoursesMetadata();
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
export function useCoursesMetadata(
    options?: Partial<UseQueryOptions<CoursesMetadata, Error>>
) {
    return useQuery({
        queryKey: courseKeys.metadata(),
        queryFn: ({ signal }) => coursesApi.getMetadata(signal),
        staleTime: 1000 * 60 * 30, // 30 minutes - metadata rarely changes
        ...options,
    });
}

// ============================================================================
// List Queries
// ============================================================================

/**
 * Hook to fetch paginated list of all courses
 *
 * @param params - Query parameters for pagination
 * @param options - Additional query options
 *
 * @example
 * ```tsx
 * const { data, isLoading, error } = useCoursesList({ page: 1 });
 *
 * if (isLoading) return <Spinner />;
 * if (error) return <ErrorMessage error={error} />;
 *
 * return (
 *     <ul>
 *         {data.items.map(course => (
 *             <li key={course.id}>{course.title}</li>
 *         ))}
 *     </ul>
 * );
 * ```
 */
export function useCoursesList(
    params?: CoursesListParams,
    options?: Partial<UseQueryOptions<PaginatedData<Course>, Error>>
) {
    return useQuery({
        queryKey: courseKeys.list(params),
        queryFn: ({ signal }) => coursesApi.getList(params, signal),
        ...options,
    });
}

/**
 * Hook to fetch paginated list of courses by program type
 *
 * @param params - Query parameters including programType and pagination
 * @param options - Additional query options
 *
 * @example
 * ```tsx
 * const { data, isLoading } = useCoursesByProgram({
 *     programType: 'standard',
 *     page: 1,
 * });
 *
 * return (
 *     <ul>
 *         {data?.items.map(course => (
 *             <li key={course.id}>{course.title}</li>
 *         ))}
 *     </ul>
 * );
 * ```
 */
export function useCoursesByProgram(
    params: CoursesByProgramParams,
    options?: Partial<UseQueryOptions<Course[], Error>>
) {
    return useQuery({
        queryKey: courseKeys.byProgram(params),
        queryFn: ({ signal }) => coursesApi.getByProgram(params, signal),
        ...options,
    });
}

/**
 * Hook to fetch infinite list of all courses (for infinite scroll)
 *
 * @param options - Additional infinite query options
 *
 * @example
 * ```tsx
 * const {
 *     data,
 *     fetchNextPage,
 *     hasNextPage,
 *     isFetchingNextPage,
 * } = useCoursesInfinite();
 *
 * return (
 *     <>
 *         {data?.pages.map(page =>
 *             page.items.map(course => <CourseCard key={course.id} course={course} />)
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
export function useCoursesInfinite() {
    return useInfiniteQuery({
        queryKey: courseKeys.infinite(),
        queryFn: ({ pageParam, signal }) =>
            coursesApi.getList({ page: pageParam as number }, signal),
        initialPageParam: 1,
        getNextPageParam: (lastPage) => {
            const { currentPage, lastPage: totalPages } = lastPage;
            return currentPage < totalPages ? currentPage + 1 : undefined;
        },
    });
}

/**
 * Hook to fetch infinite list of courses by program type (for infinite scroll)
 * Note: This endpoint returns all courses at once, so infinite scroll is not applicable.
 * Keeping for API compatibility but it will return all data in first page.
 *
 * @param programType - The program type to filter by
 * @deprecated Use useCoursesByProgram instead - this endpoint is not paginated
 */
export function useCoursesInfiniteByProgram(programType: ProgramType) {
    return useInfiniteQuery({
        queryKey: courseKeys.infiniteByProgram(programType),
        queryFn: ({ signal }) =>
            coursesApi.getByProgram({ programType }, signal),
        initialPageParam: 1,
        getNextPageParam: () => undefined, // No pagination - returns all at once
    });
}

// ============================================================================
// Detail Queries
// ============================================================================

/**
 * Hook to fetch single course by ID
 *
 * @param id - Course ID
 * @param options - Additional query options
 *
 * @example
 * ```tsx
 * const { data: course, isLoading, error } = useCourse(courseId);
 *
 * if (isLoading) return <Spinner />;
 * if (error) return <ErrorMessage error={error} />;
 *
 * return (
 *     <div>
 *         <h1>{course.title}</h1>
 *         <p>{course.description}</p>
 *     </div>
 * );
 * ```
 */
export function useCourse(
    id: string | undefined | null,
    options?: Partial<UseQueryOptions<Course, Error>>
) {
    return useQuery({
        queryKey: courseKeys.detail(id ?? ""),
        queryFn: ({ signal }) => coursesApi.getById(id!, signal),
        enabled: !!id,
        ...options,
    });
}
