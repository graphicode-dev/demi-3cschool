/**
 * Lesson Quiz Questions Feature - Query Hooks
 *
 * TanStack Query hooks for reading lesson quiz question data.
 * All queries support AbortSignal for cancellation.
 *
 * @example
 * ```tsx
 * // Get lesson quiz questions metadata
 * const { data: metadata } = useLessonQuizQuestionsMetadata();
 *
 * // List all lesson quiz questions with pagination
 * const { data, isLoading } = useLessonQuizQuestionsList({ page: 1 });
 *
 * // Get single lesson quiz question
 * const { data: question } = useLessonQuizQuestion(questionId);
 * ```
 */

import {
    useQuery,
    useInfiniteQuery,
    type UseQueryOptions,
} from "@tanstack/react-query";
import { lessonQuizQuestionKeys } from "./lesson-quiz-questions.keys";
import { lessonQuizQuestionsApi } from "./lesson-quiz-questions.api";
import {
    LessonQuizQuestion,
    LessonQuizQuestionsListParams,
    LessonQuizQuestionsMetadata,
    PaginatedData,
} from "../../types";

// ============================================================================
// Metadata Query
// ============================================================================

/**
 * Hook to fetch lesson quiz questions metadata (filters, operators, field types)
 *
 * @param options - Additional query options
 *
 * @example
 * ```tsx
 * const { data: metadata, isLoading } = useLessonQuizQuestionsMetadata();
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
export function useLessonQuizQuestionsMetadata(
    options?: Partial<UseQueryOptions<LessonQuizQuestionsMetadata, Error>>
) {
    return useQuery({
        queryKey: lessonQuizQuestionKeys.metadata(),
        queryFn: ({ signal }) => lessonQuizQuestionsApi.getMetadata(signal),
        staleTime: 1000 * 60 * 30, // 30 minutes - metadata rarely changes
        ...options,
    });
}

// ============================================================================
// List Queries
// ============================================================================

/**
 * Hook to fetch paginated list of all lesson quiz questions
 *
 * @param params - Query parameters for pagination
 * @param options - Additional query options
 *
 * @example
 * ```tsx
 * const { data, isLoading, error } = useLessonQuizQuestionsList({ page: 1 });
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
export function useLessonQuizQuestionsList(
    params?: LessonQuizQuestionsListParams,
    options?: Partial<UseQueryOptions<PaginatedData<LessonQuizQuestion>, Error>>
) {
    return useQuery({
        queryKey: lessonQuizQuestionKeys.list(params),
        queryFn: ({ signal }) => lessonQuizQuestionsApi.getList(params, signal),
        ...options,
    });
}

/**
 * Hook to fetch paginated list of lesson quiz questions by quiz ID
 *
 * @param quizId - Quiz ID to fetch questions for
 * @param params - Query parameters for pagination
 * @param options - Additional query options
 *
 * @example
 * ```tsx
 * const { data, isLoading, error } = useLessonQuizQuestionsByQuiz(quizId, { page: 1 });
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
export function useLessonQuizQuestionsByQuiz(
    quizId: string | undefined | null,
    params?: LessonQuizQuestionsListParams,
    options?: Partial<UseQueryOptions<PaginatedData<LessonQuizQuestion>, Error>>
) {
    return useQuery({
        queryKey: [
            ...lessonQuizQuestionKeys.all,
            "byQuiz",
            quizId,
            params,
        ] as const,
        queryFn: ({ signal }) =>
            lessonQuizQuestionsApi.getListByQuizId(quizId!, params, signal),
        enabled: !!quizId,
        ...options,
    });
}

/**
 * Hook to fetch infinite list of all lesson quiz questions (for infinite scroll)
 *
 * @example
 * ```tsx
 * const {
 *     data,
 *     fetchNextPage,
 *     hasNextPage,
 *     isFetchingNextPage,
 * } = useLessonQuizQuestionsInfinite();
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
export function useLessonQuizQuestionsInfinite() {
    return useInfiniteQuery({
        queryKey: lessonQuizQuestionKeys.infinite(),
        queryFn: ({ pageParam, signal }) =>
            lessonQuizQuestionsApi.getList(
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
 * Hook to fetch single lesson quiz question by ID
 *
 * @param id - Lesson Quiz Question ID
 * @param options - Additional query options
 *
 * @example
 * ```tsx
 * const { data: question, isLoading, error } = useLessonQuizQuestion(questionId);
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
export function useLessonQuizQuestion(
    id: string | undefined | null,
    options?: Partial<UseQueryOptions<LessonQuizQuestion, Error>>
) {
    return useQuery({
        queryKey: lessonQuizQuestionKeys.detail(id ?? ""),
        queryFn: ({ signal }) => lessonQuizQuestionsApi.getById(id!, signal),
        enabled: !!id,
        ...options,
    });
}
