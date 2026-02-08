/**
 * Level Quiz Questions Feature - Query Hooks
 *
 * TanStack Query hooks for reading level quiz question data.
 * All queries support AbortSignal for cancellation.
 *
 * @example
 * ```tsx
 * // Get level quiz questions metadata
 * const { data: metadata } = useLevelQuizQuestionsMetadata();
 *
 * // List all level quiz questions with pagination
 * const { data, isLoading } = useLevelQuizQuestionsList({ page: 1 });
 *
 * // Get single level quiz question
 * const { data: question } = useLevelQuizQuestion(questionId);
 * ```
 */

import {
    useQuery,
    useInfiniteQuery,
    type UseQueryOptions,
} from "@tanstack/react-query";
import { levelQuizQuestionKeys } from "./level-quiz-questions.keys";
import { levelQuizQuestionsApi } from "./level-quiz-questions.api";
import {
    LevelQuizQuestion,
    LevelQuizQuestionsListParams,
    LevelQuizQuestionsMetadata,
} from "../../types/level-quiz-questions.types";
import { PaginatedData } from "@/shared/api";

// ============================================================================
// Metadata Query
// ============================================================================

/**
 * Hook to fetch level quiz questions metadata (filters, operators, field types)
 *
 * @param options - Additional query options
 *
 * @example
 * ```tsx
 * const { data: metadata, isLoading } = useLevelQuizQuestionsMetadata();
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
export function useLevelQuizQuestionsMetadata(
    options?: Partial<UseQueryOptions<LevelQuizQuestionsMetadata, Error>>
) {
    return useQuery({
        queryKey: levelQuizQuestionKeys.metadata(),
        queryFn: ({ signal }) => levelQuizQuestionsApi.getMetadata(signal),
        staleTime: 1000 * 60 * 30, // 30 minutes - metadata rarely changes
        ...options,
    });
}


// ============================================================================
// List Queries
// ============================================================================

/**
 * Hook to fetch paginated list of all level quiz questions
 *
 * @param params - Query parameters for pagination
 * @param options - Additional query options
 *
 * @example
 * ```tsx
 * const { data, isLoading, error } = useLevelQuizQuestionsList({ page: 1 });
 *
 * if (isLoading) return <Spinner />;
 * if (error) return <ErrorMessage error={error} />;
 *
 * return (
 *     <ul>
 *         {data.items.map(question => (
 *             <li key={question.id}>{question.question}</li>
 *         ))}
 *     </ul>
 * );
 * ```
 */
export function useLevelQuizQuestionsList(
    params?: LevelQuizQuestionsListParams,
    options?: Partial<UseQueryOptions<PaginatedData<LevelQuizQuestion>, Error>>
) {
    return useQuery({
        queryKey: levelQuizQuestionKeys.list(params),
        queryFn: ({ signal }) => levelQuizQuestionsApi.getList(params, signal),
        ...options,
    });
}

/**
 * Hook to fetch paginated list of level quiz questions by quiz ID
 *
 * @param quizId - Quiz ID to fetch questions for
 * @param params - Query parameters for pagination
 * @param options - Additional query options
 *
 * @example
 * ```tsx
 * const { data, isLoading, error } = useLevelQuizQuestionsByQuiz(quizId, { page: 1 });
 *
 * if (isLoading) return <Spinner />;
 * if (error) return <ErrorMessage error={error} />;
 *
 * return (
 *     <ul>
 *         {data.items.map(question => (
 *             <li key={question.id}>{question.question}</li>
 *         ))}
 *     </ul>
 * );
 * ```
 */
export function useLevelQuizQuestionsByQuiz(
    quizId: string | undefined | null,
    params?: LevelQuizQuestionsListParams,
    options?: Partial<UseQueryOptions<PaginatedData<LevelQuizQuestion>, Error>>
) {
    return useQuery({
        queryKey: levelQuizQuestionKeys.listsByQuiz(params),
        queryFn: ({ signal }) =>
            levelQuizQuestionsApi.getByQuizId(quizId!, params, signal),
        enabled: !!quizId,
        ...options,
    });
}


/**
 * Hook to fetch infinite list of all level quiz questions (for infinite scroll)
 *
 * @example
 * ```tsx
 * const {
 *     data,
 *     fetchNextPage,
 *     hasNextPage,
 *     isFetchingNextPage,
 * } = useLevelQuizQuestionsInfinite();
 *
 * return (
 *     <>
 *         {data?.pages.map(page =>
 *             page.items.map(question => <QuestionCard key={question.id} question={question} />)
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
export function useLevelQuizQuestionsInfinite() {
    return useInfiniteQuery({
        queryKey: levelQuizQuestionKeys.infinite(),
        queryFn: ({ pageParam, signal }) =>
            levelQuizQuestionsApi.getList(
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
 * Hook to fetch single level quiz question by ID
 *
 * @param id - Level Quiz Question ID
 * @param options - Additional query options
 *
 * @example
 * ```tsx
 * const { data: question, isLoading, error } = useLevelQuizQuestion(questionId);
 *
 * if (isLoading) return <Spinner />;
 * if (error) return <ErrorMessage error={error} />;
 *
 * return (
 *     <div>
 *         <h1>{question.question}</h1>
 *         <p>Type: {question.type}</p>
 *         <p>Points: {question.points}</p>
 *     </div>
 * );
 * ```
 */
export function useLevelQuizQuestion(
    id: string | undefined | null,
    options?: Partial<UseQueryOptions<LevelQuizQuestion, Error>>
) {
    return useQuery({
        queryKey: levelQuizQuestionKeys.detail(id ?? ""),
        queryFn: ({ signal }) => levelQuizQuestionsApi.getById(id!, signal),
        enabled: !!id,
        ...options,
    });
}
