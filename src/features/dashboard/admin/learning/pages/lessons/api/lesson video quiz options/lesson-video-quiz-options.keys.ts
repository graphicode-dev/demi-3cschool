/**
 * Lesson Video Quiz Options Feature - Query Keys
 *
 * Centralized query key management for lesson video quiz options.
 * Uses a factory pattern for type-safe, consistent key generation.
 */

import { LessonVideoQuizOptionsListParams } from "../../types";

/**
 * Base key for all lesson video quiz option queries
 */
const BASE_KEY = ["lesson-video-quiz-options"] as const;

/**
 * Query key factory for lesson video quiz options
 */
export const lessonVideoQuizOptionKeys = {
    /**
     * Base key - invalidates all lesson video quiz option queries
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
    list: (params?: LessonVideoQuizOptionsListParams) =>
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
export type LessonVideoQuizOptionQueryKey =
    | ReturnType<typeof lessonVideoQuizOptionKeys.metadata>
    | ReturnType<typeof lessonVideoQuizOptionKeys.lists>
    | ReturnType<typeof lessonVideoQuizOptionKeys.list>
    | ReturnType<typeof lessonVideoQuizOptionKeys.details>
    | ReturnType<typeof lessonVideoQuizOptionKeys.detail>;
