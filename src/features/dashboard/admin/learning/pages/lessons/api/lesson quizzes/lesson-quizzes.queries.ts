/**
 * Lesson Quizzes Feature - Query Hooks
 *
 * TanStack Query hooks for reading lesson quiz data.
 * All queries support AbortSignal for cancellation.
 *
 * @example
 * ```tsx
 * // Get lesson quizzes metadata
 * const { data: metadata } = useLessonQuizzesMetadata();
 *
 * // List all lesson quizzes with pagination
 * const { data, isLoading } = useLessonQuizzesList({ page: 1 });
 *
 * // Get single lesson quiz
 * const { data: quiz } = useLessonQuiz(quizId);
 * ```
 */

import {
    useQuery,
    useInfiniteQuery,
    type UseQueryOptions,
} from "@tanstack/react-query";
import { lessonQuizKeys } from "./lesson-quizzes.keys";
import { lessonQuizzesApi } from "./lesson-quizzes.api";
import {
    LessonQuiz,
    LessonQuizzesListParams,
    LessonQuizzesMetadata,
    PaginatedData,
} from "../../types";

// ============================================================================
// Metadata Query
// ============================================================================

/**
 * Hook to fetch lesson quizzes metadata (filters, operators, field types)
 *
 * @param options - Additional query options
 *
 * @example
 * ```tsx
 * const { data: metadata, isLoading } = useLessonQuizzesMetadata();
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
export function useLessonQuizzesMetadata(
    options?: Partial<UseQueryOptions<LessonQuizzesMetadata, Error>>
) {
    return useQuery({
        queryKey: lessonQuizKeys.metadata(),
        queryFn: ({ signal }) => lessonQuizzesApi.getMetadata(signal),
        staleTime: 1000 * 60 * 30, // 30 minutes - metadata rarely changes
        ...options,
    });
}

// ============================================================================
// List Queries
// ============================================================================

/**
 * Hook to fetch paginated list of all lesson quizzes
 *
 * @param params - Query parameters for pagination
 * @param options - Additional query options
 *
 * @example
 * ```tsx
 * const { data, isLoading, error } = useLessonQuizzesList({ page: 1 });
 *
 * if (isLoading) return <Spinner />;
 * if (error) return <ErrorMessage error={error} />;
 *
 * return (
 *     <ul>
 *         {data.items.map(quiz => (
 *             <li key={quiz.id}>Quiz for Lesson: {quiz.lesson.title}</li>
 *         ))}
 *     </ul>
 * );
 * ```
 */
export function useLessonQuizzesList(
    params?: LessonQuizzesListParams,
    options?: Partial<UseQueryOptions<PaginatedData<LessonQuiz>, Error>>
) {
    return useQuery({
        queryKey: lessonQuizKeys.list(params),
        queryFn: ({ signal }) => lessonQuizzesApi.getList(params, signal),
        ...options,
    });
}

/**
 * Hook to fetch list of lesson quizzes by level ID
 *
 * @param levelId - Level ID to fetch quizzes for
 * @param options - Additional query options
 *
 * @example
 * ```tsx
 * const { data, isLoading, error } = useLessonQuizzesByLevel(levelId);
 *
 * if (isLoading) return <Spinner />;
 * if (error) return <ErrorMessage error={error} />;
 *
 * return (
 *     <ul>
 *         {data?.map(quiz => (
 *             <li key={quiz.id}>{quiz.lesson.title} - {quiz.timeLimit}min</li>
 *         ))}
 *     </ul>
 * );
 * ```
 */
export function useLessonQuizzesByLevel(
    levelId: string | undefined | null,
    options?: Partial<UseQueryOptions<LessonQuiz[], Error>>
) {
    return useQuery({
        queryKey: lessonQuizKeys.byLevel(levelId ?? ""),
        queryFn: ({ signal }) =>
            lessonQuizzesApi.getByLevelId(levelId!, undefined, signal),
        enabled: !!levelId,
        ...options,
    });
}

/**
 * Hook to fetch infinite list of all lesson quizzes (for infinite scroll)
 *
 * @example
 * ```tsx
 * const {
 *     data,
 *     fetchNextPage,
 *     hasNextPage,
 *     isFetchingNextPage,
 * } = useLessonQuizzesInfinite();
 *
 * return (
 *     <>
 *         {data?.pages.map(page =>
 *             page.items.map(quiz => <QuizCard key={quiz.id} quiz={quiz} />)
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
export function useLessonQuizzesInfinite() {
    return useInfiniteQuery({
        queryKey: lessonQuizKeys.infinite(),
        queryFn: ({ pageParam, signal }) =>
            lessonQuizzesApi.getList({ page: pageParam as number }, signal),
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
 * Hook to fetch single lesson quiz by ID
 *
 * @param id - Lesson Quiz ID
 * @param options - Additional query options
 *
 * @example
 * ```tsx
 * const { data: quiz, isLoading, error } = useLessonQuiz(quizId);
 *
 * if (isLoading) return <Spinner />;
 * if (error) return <ErrorMessage error={error} />;
 *
 * return (
 *     <div>
 *         <h1>Quiz for: {quiz.lesson.title}</h1>
 *         <p>Time Limit: {quiz.timeLimit} minutes</p>
 *         <p>Passing Score: {quiz.passingScore}%</p>
 *     </div>
 * );
 * ```
 */
export function useLessonQuiz(
    id: string | undefined | null,
    options?: Partial<UseQueryOptions<LessonQuiz, Error>>
) {
    return useQuery({
        queryKey: lessonQuizKeys.detail(id ?? ""),
        queryFn: ({ signal }) => lessonQuizzesApi.getById(id!, signal),
        enabled: !!id,
        ...options,
    });
}
