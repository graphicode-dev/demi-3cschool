import { ListQueryParams } from "@/shared/api";

/**
 * Query key factory for lesson quiz attempts
 *
 * Hierarchy:
 * - all: ['lesson-quiz-attempts']
 * - metadata: ['lesson-quiz-attempts', 'metadata']
 * - lists: ['lesson-quiz-attempts', 'list']
 * - list(params): ['lesson-quiz-attempts', 'list', params]
 * - infinite: ['lesson-quiz-attempts', 'infinite']
 * - details: ['lesson-quiz-attempts', 'detail']
 * - detail(id): ['lesson-quiz-attempts', 'detail', id]
 * - history(quizId): ['lesson-quiz-attempts', 'history', quizId]
 * - answer(id): ['lesson-quiz-attempts', 'answer', id]
 * - complete(id): ['lesson-quiz-attempts', 'complete', id]
 * - attempt: ['lesson-quiz-attempts', 'attempt']
 */
export const lessonQuizAttemptKeys = {
    /**
     * Root key for all lesson quiz attempt queries
     */
    all: ["lesson-quiz-attempts"] as const,

    /**
     * Key for metadata query
     */
    metadata: () => [...lessonQuizAttemptKeys.all, "metadata"] as const,

    /**
     * Key for all list queries
     */
    lists: () => [...lessonQuizAttemptKeys.all, "list"] as const,

    /**
     * Key for specific list with params
     */
    list: (params?: ListQueryParams) =>
        params
            ? ([...lessonQuizAttemptKeys.lists(), params] as const)
            : lessonQuizAttemptKeys.lists(),

    /**
     * Key for infinite list queries
     */
    infinite: (params?: Omit<ListQueryParams, "page">) =>
        params
            ? ([...lessonQuizAttemptKeys.all, "infinite", params] as const)
            : ([...lessonQuizAttemptKeys.all, "infinite"] as const),

    /**
     * Key for all detail queries
     */
    details: () => [...lessonQuizAttemptKeys.all, "detail"] as const,

    /**
     * Key for specific lesson quiz attempt detail
     */
    detail: (id: string) => [...lessonQuizAttemptKeys.details(), id] as const,

    /**
     * Key for lesson quiz attempt history
     */
    history: (quizId: string) =>
        [...lessonQuizAttemptKeys.all, "history", quizId] as const,

    /**
     * Key for answering a lesson quiz attempt
     */
    answer: (id: string) =>
        [...lessonQuizAttemptKeys.all, "answer", id] as const,

    /**
     * Key for completing a lesson quiz attempt
     */
    complete: (id: string) =>
        [...lessonQuizAttemptKeys.all, "complete", id] as const,

    /**
     * Key for starting a lesson quiz attempt
     */
    attempt: () => [...lessonQuizAttemptKeys.all, "attempt"] as const,
};

/**
 * Type for lesson quiz attempt query keys
 */
export type LessonQuizAttemptQueryKey =
    | typeof lessonQuizAttemptKeys.all
    | ReturnType<typeof lessonQuizAttemptKeys.metadata>
    | ReturnType<typeof lessonQuizAttemptKeys.lists>
    | ReturnType<typeof lessonQuizAttemptKeys.list>
    | ReturnType<typeof lessonQuizAttemptKeys.infinite>
    | ReturnType<typeof lessonQuizAttemptKeys.details>
    | ReturnType<typeof lessonQuizAttemptKeys.detail>
    | ReturnType<typeof lessonQuizAttemptKeys.history>
    | ReturnType<typeof lessonQuizAttemptKeys.answer>
    | ReturnType<typeof lessonQuizAttemptKeys.complete>
    | ReturnType<typeof lessonQuizAttemptKeys.attempt>;
