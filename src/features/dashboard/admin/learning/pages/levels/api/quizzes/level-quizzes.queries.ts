/**
 * Level Quizzes Feature - Query Hooks
 *
 * TanStack Query hooks for reading level quiz data.
 * All queries support AbortSignal for cancellation.
 *
 * @example
 * ```tsx
 * // Get level quizzes metadata
 * const { data: metadata } = useLevelQuizzesMetadata();
 *
 * // List all level quizzes with pagination
 * const { data, isLoading } = useLevelQuizzesList({ page: 1 });
 *
 * // Get single level quiz
 * const { data: levelQuiz } = useLevelQuiz(levelQuizId);
 * ```
 */

import {
    useQuery,
    useInfiniteQuery,
    type UseQueryOptions,
} from "@tanstack/react-query";
import { levelQuizKeys } from "./level-quizzes.keys";
import { levelQuizzesApi } from "./level-quizzes.api";
import {
    LevelQuizzesListParams,
    LevelQuizzesMetadata,
} from "../../types/level-quizzes.types";
import { PaginatedData } from "@/features/dashboard/admin/sales_subscription";
import { LevelQuiz } from "../../types";

// ============================================================================
// Metadata Query
// ============================================================================

/**
 * Hook to fetch level quizzes metadata (filters, operators, field types)
 *
 * @param options - Additional query options
 *
 * @example
 * ```tsx
 * const { data: metadata, isLoading } = useLevelQuizzesMetadata();
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
export function useLevelQuizzesMetadata(
    options?: Partial<UseQueryOptions<LevelQuizzesMetadata, Error>>
) {
    return useQuery({
        queryKey: levelQuizKeys.metadata(),
        queryFn: ({ signal }) => levelQuizzesApi.getMetadata(signal),
        staleTime: 1000 * 60 * 30, // 30 minutes - metadata rarely changes
        ...options,
    });
}

// ============================================================================
// List Queries
// ============================================================================

/**
 * Hook to fetch paginated list of all level quizzes
 *
 * @param params - Query parameters for pagination
 * @param options - Additional query options
 *
 * @example
 * ```tsx
 * const { data, isLoading, error } = useLevelQuizzesList({ page: 1 });
 *
 * if (isLoading) return <Spinner />;
 * if (error) return <ErrorMessage error={error} />;
 *
 * return (
 *     <ul>
 *         {data.items.map(quiz => (
 *             <li key={quiz.id}>{quiz.level.title} - {quiz.timeLimit}min</li>
 *         ))}
 *     </ul>
 * );
 * ```
 */
export function useLevelQuizzesList(
    params?: LevelQuizzesListParams,
    options?: Partial<UseQueryOptions<PaginatedData<LevelQuiz>, Error>>
) {
    return useQuery({
        queryKey: levelQuizKeys.list(params),
        queryFn: ({ signal }) => levelQuizzesApi.getList(params, signal),
        ...options,
    });
}

/**
 * Hook to fetch infinite list of all level quizzes (for infinite scroll)
 *
 * @example
 * ```tsx
 * const {
 *     data,
 *     fetchNextPage,
 *     hasNextPage,
 *     isFetchingNextPage,
 * } = useLevelQuizzesInfinite();
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
export function useLevelQuizzesInfinite() {
    return useInfiniteQuery({
        queryKey: levelQuizKeys.infinite(),
        queryFn: ({ pageParam, signal }) =>
            levelQuizzesApi.getList({ page: pageParam as number }, signal),
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
 * Hook to fetch single level quiz by ID
 *
 * @param id - Level Quiz ID
 * @param options - Additional query options
 *
 * @example
 * ```tsx
 * const { data: quiz, isLoading, error } = useLevelQuiz(quizId);
 *
 * if (isLoading) return <Spinner />;
 * if (error) return <ErrorMessage error={error} />;
 *
 * return (
 *     <div>
 *         <h1>{quiz.level.title} Quiz</h1>
 *         <p>Time Limit: {quiz.timeLimit} minutes</p>
 *         <p>Passing Score: {quiz.passingScore}%</p>
 *     </div>
 * );
 * ```
 */
export function useLevelQuiz(
    id: string | undefined | null,
    options?: Partial<UseQueryOptions<LevelQuiz, Error>>
) {
    return useQuery({
        queryKey: levelQuizKeys.detail(id ?? ""),
        queryFn: ({ signal }) => levelQuizzesApi.getById(id!, signal),
        enabled: !!id,
        ...options,
    });
}
