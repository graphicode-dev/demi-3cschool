/**
 * Level Quiz Questions Feature - Query Keys
 *
 * Stable query key factory for TanStack Query.
 * Keys are hierarchical for easy invalidation.
 *
 * @example
 * ```ts
 * // Invalidate all level quiz questions data
 * queryClient.invalidateQueries({ queryKey: acceptanceExamQuestionKeys.all });
 *
 * // Invalidate only lists (keeps detail cache)
 * queryClient.invalidateQueries({ queryKey: acceptanceExamQuestionKeys.lists() });
 *
 * // Invalidate specific level quiz question
 * queryClient.invalidateQueries({ queryKey: acceptanceExamQuestionKeys.detail(questionId) });
 * ```
 */

import type { AcceptanceExamQuestionsListParams } from "../../../../types/acceptance-exam-questions.types";

/**
 * Query key factory for level quiz questions
 *
 * Hierarchy:
 * - all: ['level-quiz-questions']
 * - metadata: ['level-quiz-questions', 'metadata']
 * - lists: ['level-quiz-questions', 'list']
 * - list(params): ['level-quiz-questions', 'list', params]
 * - details: ['level-quiz-questions', 'detail']
 * - detail(id): ['level-quiz-questions', 'detail', id]
 */
export const acceptanceExamQuestionKeys = {
    /**
     * Root key for all level quiz question queries
     */
    all: ["level-quiz-questions"] as const,

    /**
     * Key for metadata query
     */
    metadata: () => [...acceptanceExamQuestionKeys.all, "metadata"] as const,

    /**
     * Key for all list queries
     */
    lists: () => [...acceptanceExamQuestionKeys.all, "list"] as const,

    /**
     * Key for questions by quiz ID
     */
    byQuiz: (quizId: string, params?: AcceptanceExamQuestionsListParams) =>
        params
            ? ([
                  ...acceptanceExamQuestionKeys.all,
                  "by-quiz",
                  quizId,
                  params,
              ] as const)
            : ([...acceptanceExamQuestionKeys.all, "by-quiz", quizId] as const),

    /**
     * Key for specific list with params
     */
    list: (params?: AcceptanceExamQuestionsListParams) =>
        params
            ? ([...acceptanceExamQuestionKeys.lists(), params] as const)
            : acceptanceExamQuestionKeys.lists(),

    /**
     * Key for infinite list queries
     */
    infinite: (params?: Omit<AcceptanceExamQuestionsListParams, "page">) =>
        params
            ? ([...acceptanceExamQuestionKeys.all, "infinite", params] as const)
            : ([...acceptanceExamQuestionKeys.all, "infinite"] as const),

    /**
     * Key for all detail queries
     */
    details: () => [...acceptanceExamQuestionKeys.all, "detail"] as const,

    /**
     * Key for specific level quiz question detail
     */
    detail: (id: string) => [...acceptanceExamQuestionKeys.details(), id] as const,
};

/**
 * Type for level quiz question query keys
 */
export type AcceptanceExamQuestionQueryKey =
    | typeof acceptanceExamQuestionKeys.all
    | ReturnType<typeof acceptanceExamQuestionKeys.metadata>
    | ReturnType<typeof acceptanceExamQuestionKeys.lists>
    | ReturnType<typeof acceptanceExamQuestionKeys.byQuiz>
    | ReturnType<typeof acceptanceExamQuestionKeys.list>
    | ReturnType<typeof acceptanceExamQuestionKeys.infinite>
    | ReturnType<typeof acceptanceExamQuestionKeys.details>
    | ReturnType<typeof acceptanceExamQuestionKeys.detail>;
