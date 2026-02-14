/**
 * Lesson Quiz Attempts Feature - Query Hooks
 *
 * TanStack Query hooks for reading lesson quiz attempt data.
 * All queries support AbortSignal for cancellation.
 *
 * @example
 * ```tsx
 * // Get lesson quiz attempts metadata
 * const { data: metadata } = useLessonQuizAttemptsMetadata();
 *
 * // List all lesson quiz attempts with pagination
 * const { data, isLoading } = useLessonQuizAttemptsList({ page: 1 });
 *
 * // Get single lesson quiz attempt
 * const { data: attempt } = useLessonQuizAttempt(attemptId);
 *
 * // Get quiz attempt history
 * const { data: history } = useLessonQuizAttemptHistory(quizId);
 * ```
 */

import {
    useQuery,
    useInfiniteQuery,
    type UseQueryOptions,
} from "@tanstack/react-query";
import { lessonQuizAttemptKeys } from "./lesson-quiz-attempts.keys";
import { lessonQuizAttemptsApi } from "./lesson-quiz-attempts.api";
import { LessonQuizAttempt, LessonQuizAttemptsMetadata } from "../../types";
import { ListQueryParams, PaginatedData } from "@/shared/api";

// ============================================================================
// Metadata Query
// ============================================================================

/**
 * Hook to fetch lesson quiz attempts metadata (filters, operators, field types)
 *
 * @param options - Additional query options
 *
 * @example
 * ```tsx
 * const { data: metadata, isLoading } = useLessonQuizAttemptsMetadata();
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
export function useLessonQuizAttemptsMetadata(
    options?: Partial<UseQueryOptions<LessonQuizAttemptsMetadata, Error>>
) {
    return useQuery({
        queryKey: lessonQuizAttemptKeys.metadata(),
        queryFn: ({ signal }) => lessonQuizAttemptsApi.getMetadata(signal),
        staleTime: 1000 * 60 * 30, // 30 minutes - metadata rarely changes
        ...options,
    });
}

// ============================================================================
// List Queries
// ============================================================================

/**
 * Hook to fetch paginated list of all lesson quiz attempts
 *
 * @param params - Query parameters for pagination
 * @param options - Additional query options
 *
 * @example
 * ```tsx
 * const { data, isLoading, error } = useLessonQuizAttemptsList({ page: 1 });
 *
 * if (isLoading) return <Spinner />;
 * if (error) return <ErrorMessage error={error} />;
 *
 * return (
 *     <ul>
 *         {data.items.map(attempt => (
 *             <li key={attempt.id}>
 *                 Quiz {attempt.lessonQuiz.id} - Score: {attempt.scorePercentage}%
 *             </li>
 *         ))}
 *     </ul>
 * );
 * ```
 */
export function useLessonQuizAttemptsList(
    params?: ListQueryParams,
    options?: Partial<UseQueryOptions<PaginatedData<LessonQuizAttempt>, Error>>
) {
    return useQuery({
        queryKey: lessonQuizAttemptKeys.list(params),
        queryFn: ({ signal }) => lessonQuizAttemptsApi.getList(params, signal),
        ...options,
    });
}

/**
 * Hook to fetch infinite list of all lesson quiz attempts (for infinite scroll)
 *
 * @example
 * ```tsx
 * const {
 *     data,
 *     fetchNextPage,
 *     hasNextPage,
 *     isFetchingNextPage,
 * } = useLessonQuizAttemptsInfinite();
 *
 * return (
 *     <>
 *         {data?.pages.map(page =>
 *             page.items.map(attempt => <AttemptCard key={attempt.id} attempt={attempt} />)
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
export function useLessonQuizAttemptsInfinite() {
    return useInfiniteQuery({
        queryKey: lessonQuizAttemptKeys.infinite(),
        queryFn: ({ pageParam, signal }) =>
            lessonQuizAttemptsApi.getList(
                { page: pageParam as number },
                signal
            ),
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
 * Hook to fetch single lesson quiz attempt by ID
 *
 * @param id - Lesson Quiz Attempt ID
 * @param options - Additional query options
 *
 * @example
 * ```tsx
 * const { data: attempt, isLoading, error } = useLessonQuizAttempt(attemptId);
 *
 * if (isLoading) return <Spinner />;
 * if (error) return <ErrorMessage error={error} />;
 *
 * return (
 *     <div>
 *         <h1>Quiz Attempt #{attempt.id}</h1>
 *         <p>Score: {attempt.scorePercentage}%</p>
 *         <p>Status: {attempt.status}</p>
 *     </div>
 * );
 * ```
 */
export function useLessonQuizAttempt(
    id: string | undefined | null,
    options?: Partial<UseQueryOptions<LessonQuizAttempt, Error>>
) {
    return useQuery({
        queryKey: lessonQuizAttemptKeys.detail(id ?? ""),
        queryFn: ({ signal }) => lessonQuizAttemptsApi.getById(id!, signal),
        enabled: !!id,
        ...options,
    });
}

/**
 * Hook to fetch lesson quiz attempt history by quiz ID
 *
 * @param quizId - Quiz ID to fetch history for
 * @param options - Additional query options
 *
 * @example
 * ```tsx
 * const { data: history, isLoading, error } = useLessonQuizAttemptHistory(quizId);
 *
 * if (isLoading) return <Spinner />;
 * if (error) return <ErrorMessage error={error} />;
 *
 * return (
 *     <ul>
 *         {history.map(attempt => (
 *             <li key={attempt.id}>
 *                 Attempt #{attempt.attemptNumber} - Score: {attempt.scorePercentage}%
 *             </li>
 *         ))}
 *     </ul>
 * );
 * ```
 */
export function useLessonQuizAttemptHistory(
    quizId: string | undefined | null,
    options?: Partial<UseQueryOptions<LessonQuizAttempt[], Error>>
) {
    return useQuery({
        queryKey: lessonQuizAttemptKeys.history(quizId ?? ""),
        queryFn: ({ signal }) =>
            lessonQuizAttemptsApi.getHistory(quizId!, signal),
        enabled: !!quizId,
        ...options,
    });
}
