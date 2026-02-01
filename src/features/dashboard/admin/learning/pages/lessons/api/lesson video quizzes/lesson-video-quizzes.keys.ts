/**
 * Lesson Video Quizzes Feature - Query Keys
 *
 * Centralized query key management for lesson video quizzes.
 * Uses a factory pattern for type-safe, consistent key generation.
 */

import { LessonVideoQuizzesListParams } from "../../types";

/**
 * Base key for all lesson video quiz queries
 */
const BASE_KEY = ["lesson-video-quizzes"] as const;

/**
 * Query key factory for lesson video quizzes
 */
export const lessonVideoQuizKeys = {
    /**
     * Base key - invalidates all lesson video quiz queries
     */
    all: BASE_KEY,

    /**
     * Metadata query key
     */
    metadata: () => [...BASE_KEY, "metadata"] as const,

    /**
     * List queries base key
     */
    lists: () => [...BASE_KEY, "list"] as const,

    /**
     * Specific list query with params
     */
    list: (params?: LessonVideoQuizzesListParams) =>
        [...BASE_KEY, "list", params ?? {}] as const,

    /**
     * Detail queries base key
     */
    details: () => [...BASE_KEY, "detail"] as const,

    /**
     * Specific detail query
     */
    detail: (id: string) => [...BASE_KEY, "detail", id] as const,
} as const;

/**
 * Type for query keys
 */
export type LessonVideoQuizQueryKey =
    | ReturnType<typeof lessonVideoQuizKeys.metadata>
    | ReturnType<typeof lessonVideoQuizKeys.lists>
    | ReturnType<typeof lessonVideoQuizKeys.list>
    | ReturnType<typeof lessonVideoQuizKeys.details>
    | ReturnType<typeof lessonVideoQuizKeys.detail>;
