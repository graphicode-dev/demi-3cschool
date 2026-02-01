/**
 * Lesson Video Quiz Questions Feature - Query Keys
 *
 * Centralized query key management for lesson video quiz questions.
 * Uses a factory pattern for type-safe, consistent key generation.
 */

import { LessonVideoQuizQuestionsListParams } from "../../types";

/**
 * Base key for all lesson video quiz question queries
 */
const BASE_KEY = ["lesson-video-quiz-questions"] as const;

/**
 * Query key factory for lesson video quiz questions
 */
export const lessonVideoQuizQuestionKeys = {
    /**
     * Base key - invalidates all lesson video quiz question queries
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
    list: (params?: LessonVideoQuizQuestionsListParams) =>
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
export type LessonVideoQuizQuestionQueryKey =
    | ReturnType<typeof lessonVideoQuizQuestionKeys.metadata>
    | ReturnType<typeof lessonVideoQuizQuestionKeys.lists>
    | ReturnType<typeof lessonVideoQuizQuestionKeys.list>
    | ReturnType<typeof lessonVideoQuizQuestionKeys.details>
    | ReturnType<typeof lessonVideoQuizQuestionKeys.detail>;
