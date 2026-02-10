/**
 * Level Quiz Questions Feature - Query Keys
 *
 * Stable query key factory for TanStack Query.
 * Keys are hierarchical for easy invalidation.
 *
 * @example
 * ```ts
 * // Invalidate all level quiz questions data
 * queryClient.invalidateQueries({ queryKey: levelQuizQuestionKeys.all });
 *
 * // Invalidate only lists (keeps detail cache)
 * queryClient.invalidateQueries({ queryKey: levelQuizQuestionKeys.lists() });
 *
 * // Invalidate specific level quiz question
 * queryClient.invalidateQueries({ queryKey: levelQuizQuestionKeys.detail(questionId) });
 * ```
 */

import type { LevelQuizQuestionsListParams } from "../../types/level-quiz-questions.types";

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
export const levelQuizQuestionKeys = {
    /**
     * Root key for all level quiz question queries
     */
    all: ["level-quiz-questions"] as const,

    /**
     * Key for metadata query
     */
    metadata: () => [...levelQuizQuestionKeys.all, "metadata"] as const,

    /**
     * Key for all list queries
     */
    lists: () => [...levelQuizQuestionKeys.all, "list"] as const,

    /**
     * Key for questions by quiz ID
     */
    byQuiz: (quizId: string, params?: LevelQuizQuestionsListParams) =>
        params
            ? ([
                  ...levelQuizQuestionKeys.all,
                  "by-quiz",
                  quizId,
                  params,
              ] as const)
            : ([...levelQuizQuestionKeys.all, "by-quiz", quizId] as const),

    /**
     * Key for specific list with params
     */
    list: (params?: LevelQuizQuestionsListParams) =>
        params
            ? ([...levelQuizQuestionKeys.lists(), params] as const)
            : levelQuizQuestionKeys.lists(),

    /**
     * Key for infinite list queries
     */
    infinite: (params?: Omit<LevelQuizQuestionsListParams, "page">) =>
        params
            ? ([...levelQuizQuestionKeys.all, "infinite", params] as const)
            : ([...levelQuizQuestionKeys.all, "infinite"] as const),

    /**
     * Key for all detail queries
     */
    details: () => [...levelQuizQuestionKeys.all, "detail"] as const,

    /**
     * Key for specific level quiz question detail
     */
    detail: (id: string) => [...levelQuizQuestionKeys.details(), id] as const,
};

/**
 * Type for level quiz question query keys
 */
export type LevelQuizQuestionQueryKey =
    | typeof levelQuizQuestionKeys.all
    | ReturnType<typeof levelQuizQuestionKeys.metadata>
    | ReturnType<typeof levelQuizQuestionKeys.lists>
    | ReturnType<typeof levelQuizQuestionKeys.byQuiz>
    | ReturnType<typeof levelQuizQuestionKeys.list>
    | ReturnType<typeof levelQuizQuestionKeys.infinite>
    | ReturnType<typeof levelQuizQuestionKeys.details>
    | ReturnType<typeof levelQuizQuestionKeys.detail>;
