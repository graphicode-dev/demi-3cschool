/**
 * Level Quizzes Feature - Query Hooks
 *
 * TanStack Query hooks for reading level quiz data.
 * All queries support AbortSignal for cancellation.
 *
 * @example
 * ```tsx
 * // Get level quizzes metadata
 * const { data: metadata } = useAcceptanceExamsMetadata();
 *
 * // List all level quizzes with pagination
 * const { data, isLoading } = useAcceptanceExamsList({ page: 1 });
 *
 * // Get single level quiz
 * const { data: acceptanceExam } = useAcceptanceExam(acceptanceExamId);
 * ```
 */

import {
    useQuery,
    useInfiniteQuery,
    type UseQueryOptions,
} from "@tanstack/react-query";
import { acceptanceExamKeys } from "./acceptance-exams.keys";
import acceptanceExamsApi, { acceptanceExamApi } from "./acceptance-exams.api";
import {
    AcceptanceExamsListParams,
    AcceptanceExamsMetadata,
} from "../../../../types/acceptance-exams.types";
import { AcceptanceExam } from "../../../../types";
import { PaginatedData } from "@/shared/api";

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
 * const { data: metadata, isLoading } = useAcceptanceExamsMetadata();
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
export function useAcceptanceExamsMetadata(
    options?: Partial<UseQueryOptions<AcceptanceExamsMetadata, Error>>
) {
    return useQuery({
        queryKey: acceptanceExamKeys.metadata(),
        queryFn: ({ signal }) => acceptanceExamApi.getMetadata(signal),
        staleTime: 1000 * 60 * 30, // 30 minutes - metadata rarely changes
        ...options,
    });
}

// ============================================================================
// List Queries
// ============================================================================

/**
 * Hook to fetch paginated list of level quizzes by level ID
 *
 * @param levelId - Level ID to fetch quizzes for
 * @param params - Query parameters for pagination
 * @param options - Additional query options
 *
 * @example
 * ```tsx
 * const { data, isLoading, error } = useAcceptanceExamsByLevel(levelId, { page: 1 });
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
export function useAcceptanceExamsByLevel(
    levelId: string | undefined | null,
    params?: AcceptanceExamsListParams,
    options?: Partial<UseQueryOptions<PaginatedData<AcceptanceExam>, Error>>
) {
    return useQuery({
        queryKey: acceptanceExamKeys.byLevel(levelId ?? "", params),
        queryFn: ({ signal }) =>
            acceptanceExamsApi.getByLevelId(levelId!, params, signal),
        enabled: !!levelId,
        ...options,
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
 * const { data: quiz, isLoading, error } = useAcceptanceExam(quizId);
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
export function useAcceptanceExam(
    id: string | undefined | null,
    options?: Partial<UseQueryOptions<AcceptanceExam, Error>>
) {
    return useQuery({
        queryKey: acceptanceExamKeys.detail(id ?? ""),
        queryFn: ({ signal }) => acceptanceExamsApi.getById(id!, signal),
        enabled: !!id,
        ...options,
    });
}
