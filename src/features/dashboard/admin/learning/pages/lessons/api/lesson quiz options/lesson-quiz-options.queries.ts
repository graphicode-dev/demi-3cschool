/**
 * Lesson Quiz Options Feature - Query Hooks
 *
 * TanStack Query hooks for reading lesson quiz option data.
 * All queries support AbortSignal for cancellation.
 *
 * @example
 * ```tsx
 * // Get lesson quiz options metadata
 * const { data: metadata } = useLessonQuizOptionsMetadata();
 *
 * // List all lesson quiz options with pagination
 * const { data, isLoading } = useLessonQuizOptionsList({ page: 1 });
 *
 * // Get single lesson quiz option
 * const { data: option } = useLessonQuizOption(optionId);
 * ```
 */

import {
    useQuery,
    useInfiniteQuery,
    type UseQueryOptions,
} from "@tanstack/react-query";
import { lessonQuizOptionKeys } from "./lesson-quiz-options.keys";
import { lessonQuizOptionsApi } from "./lesson-quiz-options.api";
import {
    LessonQuizOption,
    LessonQuizOptionsListParams,
    LessonQuizOptionsMetadata,
} from "../../types";
import { PaginatedData } from "@/shared/api";

// ============================================================================
// Metadata Query
// ============================================================================

/**
 * Hook to fetch lesson quiz options metadata (filters, operators, field types)
 *
 * @param options - Additional query options
 *
 * @example
 * ```tsx
 * const { data: metadata, isLoading } = useLessonQuizOptionsMetadata();
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
export function useLessonQuizOptionsMetadata(
    options?: Partial<UseQueryOptions<LessonQuizOptionsMetadata, Error>>
) {
    return useQuery({
        queryKey: lessonQuizOptionKeys.metadata(),
        queryFn: ({ signal }) => lessonQuizOptionsApi.getMetadata(signal),
        staleTime: 1000 * 60 * 30, // 30 minutes - metadata rarely changes
        ...options,
    });
}

// ============================================================================
// List Queries
// ============================================================================

/**
 * Hook to fetch paginated list of all lesson quiz options
 *
 * @param params - Query parameters for pagination
 * @param options - Additional query options
 *
 * @example
 * ```tsx
 * const { data, isLoading, error } = useLessonQuizOptionsList({ page: 1 });
 *
 * if (isLoading) return <Spinner />;
 * if (error) return <ErrorMessage error={error} />;
 *
 * return (
 *     <ul>
 *         {data.items.map(option => (
 *             <li key={option.id}>{option.optionText}</li>
 *         ))}
 *     </ul>
 * );
 * ```
 */
export function useLessonQuizOptionsList(
    params?: LessonQuizOptionsListParams,
    options?: Partial<UseQueryOptions<PaginatedData<LessonQuizOption>, Error>>
) {
    return useQuery({
        queryKey: lessonQuizOptionKeys.list(params),
        queryFn: ({ signal }) => lessonQuizOptionsApi.getList(params, signal),
        ...options,
    });
}

/**
 * Hook to fetch paginated list of lesson quiz options by question ID
 *
 * @param questionId - Question ID to fetch options for
 * @param params - Query parameters for pagination
 * @param options - Additional query options
 *
 * @example
 * ```tsx
 * const { data, isLoading, error } = useLessonQuizOptionsByQuestion(questionId, { page: 1 });
 *
 * if (isLoading) return <Spinner />;
 * if (error) return <ErrorMessage error={error} />;
 *
 * return (
 *     <ul>
 *         {data.items.map(option => (
 *             <li key={option.id}>{option.optionText}</li>
 *         ))}
 *     </ul>
 * );
 * ```
 */
export function useLessonQuizOptionsByQuestion(
    questionId: string | undefined | null,
    params?: LessonQuizOptionsListParams,
    options?: Partial<UseQueryOptions<PaginatedData<LessonQuizOption>, Error>>
) {
    return useQuery({
        queryKey: [
            ...lessonQuizOptionKeys.all,
            "byQuestion",
            questionId,
            params,
        ] as const,
        queryFn: ({ signal }) =>
            lessonQuizOptionsApi.getListByQuestionId(
                questionId!,
                params,
                signal
            ),
        enabled: !!questionId,
        ...options,
    });
}

/**
 * Hook to fetch infinite list of all lesson quiz options (for infinite scroll)
 *
 * @example
 * ```tsx
 * const {
 *     data,
 *     fetchNextPage,
 *     hasNextPage,
 *     isFetchingNextPage,
 * } = useLessonQuizOptionsInfinite();
 *
 * return (
 *     <>
 *         {data?.pages.map(page =>
 *             page.items.map(option => <OptionCard key={option.id} option={option} />)
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
export function useLessonQuizOptionsInfinite() {
    return useInfiniteQuery({
        queryKey: lessonQuizOptionKeys.infinite(),
        queryFn: ({ pageParam, signal }) =>
            lessonQuizOptionsApi.getList({ page: pageParam as number }, signal),
        initialPageParam: 1,
        getNextPageParam: (lastPage) => {
            const { currentPage, lastPage: totalPages } = lastPage;
            return currentPage < totalPages ? currentPage + 1 : undefined;
        },
    });
}

// ============================================================================
// Detail Queries
// ============================================================================

/**
 * Hook to fetch single lesson quiz option by ID
 *
 * @param id - Lesson Quiz Option ID
 * @param options - Additional query options
 *
 * @example
 * ```tsx
 * const { data: option, isLoading, error } = useLessonQuizOption(optionId);
 *
 * if (isLoading) return <Spinner />;
 * if (error) return <ErrorMessage error={error} />;
 *
 * return (
 *     <div>
 *         <h1>{option.optionText}</h1>
 *         <p>Correct: {option.isCorrect ? 'Yes' : 'No'}</p>
 *     </div>
 * );
 * ```
 */
export function useLessonQuizOption(
    id: string | undefined | null,
    options?: Partial<UseQueryOptions<LessonQuizOption, Error>>
) {
    return useQuery({
        queryKey: lessonQuizOptionKeys.detail(id ?? ""),
        queryFn: ({ signal }) => lessonQuizOptionsApi.getById(id!, signal),
        enabled: !!id,
        ...options,
    });
}
