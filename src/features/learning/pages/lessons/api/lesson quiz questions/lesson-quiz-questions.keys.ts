/**
 * Lesson Quiz Questions Feature - Query Keys
 *
 * Stable query key factory for TanStack Query.
 * Keys are hierarchical for easy invalidation.
 *
 * @example
 * ```ts
 * // Invalidate all lesson quiz questions data
 * queryClient.invalidateQueries({ queryKey: lessonQuizQuestionKeys.all });
 *
 * // Invalidate only lists (keeps detail cache)
 * queryClient.invalidateQueries({ queryKey: lessonQuizQuestionKeys.lists() });
 *
 * // Invalidate specific lesson quiz question
 * queryClient.invalidateQueries({ queryKey: lessonQuizQuestionKeys.detail(questionId) });
 * ```
 */

import { LessonQuizQuestionsListParams } from "../../types";


/**
 * Query key factory for lesson quiz questions
 *
 * Hierarchy:
 * - all: ['lesson-quiz-questions']
 * - metadata: ['lesson-quiz-questions', 'metadata']
 * - lists: ['lesson-quiz-questions', 'list']
 * - list(params): ['lesson-quiz-questions', 'list', params]
 * - infinite: ['lesson-quiz-questions', 'infinite']
 * - details: ['lesson-quiz-questions', 'detail']
 * - detail(id): ['lesson-quiz-questions', 'detail', id]
 */
export const lessonQuizQuestionKeys = {
    /**
     * Root key for all lesson quiz question queries
     */
    all: ["lesson-quiz-questions"] as const,

    /**
     * Key for metadata query
     */
    metadata: () => [...lessonQuizQuestionKeys.all, "metadata"] as const,

    /**
     * Key for all list queries
     */
    lists: () => [...lessonQuizQuestionKeys.all, "list"] as const,

    /**
     * Key for specific list with params
     */
    list: (params?: LessonQuizQuestionsListParams) =>
        params
            ? ([...lessonQuizQuestionKeys.lists(), params] as const)
            : lessonQuizQuestionKeys.lists(),

    /**
     * Key for infinite list queries
     */
    infinite: (params?: Omit<LessonQuizQuestionsListParams, "page">) =>
        params
            ? ([...lessonQuizQuestionKeys.all, "infinite", params] as const)
            : ([...lessonQuizQuestionKeys.all, "infinite"] as const),

    /**
     * Key for all detail queries
     */
    details: () => [...lessonQuizQuestionKeys.all, "detail"] as const,

    /**
     * Key for specific lesson quiz question detail
     */
    detail: (id: string) => [...lessonQuizQuestionKeys.details(), id] as const,
};

/**
 * Type for lesson quiz question query keys
 */
export type LessonQuizQuestionQueryKey =
    | typeof lessonQuizQuestionKeys.all
    | ReturnType<typeof lessonQuizQuestionKeys.metadata>
    | ReturnType<typeof lessonQuizQuestionKeys.lists>
    | ReturnType<typeof lessonQuizQuestionKeys.list>
    | ReturnType<typeof lessonQuizQuestionKeys.infinite>
    | ReturnType<typeof lessonQuizQuestionKeys.details>
    | ReturnType<typeof lessonQuizQuestionKeys.detail>;
