/**
 * Level Quiz Questions Feature - Query Hooks
 *
 * TanStack Query hooks for reading level quiz question data.
 * All queries support AbortSignal for cancellation.
 *
 * @example
 * ```tsx
 * // Get level quiz questions metadata
 * const { data: metadata } = useAcceptanceExamQuestionsMetadata();
 *
 * // List all level quiz questions with pagination
 * const { data, isLoading } = useAcceptanceExamQuestionsList({ page: 1 });
 *
 * // Get single level quiz question
 * const { data: question } = useAcceptanceExamQuestion(questionId);
 * ```
 */

import {
    useQuery,
    useInfiniteQuery,
    type UseQueryOptions,
} from "@tanstack/react-query";
import { acceptanceExamQuestionKeys } from "./acceptance-exam-questions.keys";
import { acceptanceExamQuestionsApi } from "./acceptance-exam-questions.api";
import {
    AcceptanceExamQuestion,
    AcceptanceExamQuestionsListParams,
    AcceptanceExamQuestionsMetadata,
} from "../../../../types/acceptance-exam-questions.types";
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
 * const { data: metadata, isLoading } = useAcceptanceExamQuestionsMetadata();
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
export function useAcceptanceExamQuestionsMetadata(
    options?: Partial<UseQueryOptions<AcceptanceExamQuestionsMetadata, Error>>
) {
    return useQuery({
        queryKey: acceptanceExamQuestionKeys.metadata(),
        queryFn: ({ signal }) => acceptanceExamQuestionsApi.getMetadata(signal),
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
 * const { data, isLoading, error } = useAcceptanceExamQuestionsList({ page: 1 });
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
export function useAcceptanceExamQuestionsList(
    params?: AcceptanceExamQuestionsListParams,
    options?: Partial<UseQueryOptions<PaginatedData<AcceptanceExamQuestion>, Error>>
) {
    return useQuery({
        queryKey: acceptanceExamQuestionKeys.list(params),
        queryFn: ({ signal }) => acceptanceExamQuestionsApi.getList(params, signal),
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
 * const { data, isLoading, error } = useAcceptanceExamQuestionsByQuiz(quizId, { page: 1 });
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
export function useAcceptanceExamQuestionsByQuiz(
    quizId: string | undefined | null,
    params?: AcceptanceExamQuestionsListParams,
    options?: Partial<UseQueryOptions<PaginatedData<AcceptanceExamQuestion>, Error>>
) {
    return useQuery({
        queryKey: acceptanceExamQuestionKeys.byQuiz(quizId ?? "", params),
        queryFn: ({ signal }) => {
            if (!quizId) {
                return Promise.resolve({
                    items: [],
                    currentPage: 1,
                    perPage: 0,
                    lastPage: 1,
                    nextPageUrl: null,
                });
            }
            return acceptanceExamQuestionsApi.getByQuizId(quizId, params, signal);
        },
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
 * } = useAcceptanceExamQuestionsInfinite();
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
export function useAcceptanceExamQuestionsInfinite() {
    return useInfiniteQuery({
        queryKey: acceptanceExamQuestionKeys.infinite(),
        queryFn: ({ pageParam, signal }) =>
            acceptanceExamQuestionsApi.getList(
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
 * const { data: question, isLoading, error } = useAcceptanceExamQuestion(questionId);
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
export function useAcceptanceExamQuestion(
    id: string | undefined | null,
    options?: Partial<UseQueryOptions<AcceptanceExamQuestion, Error>>
) {
    return useQuery({
        queryKey: acceptanceExamQuestionKeys.detail(id ?? ""),
        queryFn: ({ signal }) => acceptanceExamQuestionsApi.getById(id!, signal),
        enabled: !!id,
        ...options,
    });
}
