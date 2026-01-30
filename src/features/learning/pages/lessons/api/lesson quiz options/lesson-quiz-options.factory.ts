/**
 * Lesson Quiz Options Feature - CRUD Factory Example
 *
 * Example of using the CRUD factory to generate API and hooks.
 * This demonstrates how to use the factory alongside custom actions.
 *
 * @example
 * ```tsx
 * import { lessonQuizOptionCrud } from '@/features/lessons/lesson-quiz-options';
 *
 * // Use factory-generated hooks
 * const { data } = lessonQuizOptionCrud.useList({ page: 1 });
 * const { mutate: create } = lessonQuizOptionCrud.useCreate();
 * ```
 */

import {
    createCrudApi,
    createCrudHooks,
    createQueryKeys,
} from "@/shared/api/crud";
import { LessonQuizOption, LessonQuizOptionCreatePayload, LessonQuizOptionsListParams, LessonQuizOptionUpdatePayload } from "../../types";

// ============================================================================
// Query Keys (using factory)
// ============================================================================

/**
 * Query keys for lesson quiz options (factory-generated)
 */
export const lessonQuizOptionKeysFactory = createQueryKeys(
    "lesson-quiz-options"
);

// ============================================================================
// API (using factory)
// ============================================================================

/**
 * Lesson Quiz Options API (factory-generated)
 *
 * Provides: getList, getById, create, update, delete
 */
export const lessonQuizOptionsApiFactory = createCrudApi<
    LessonQuizOption,
    LessonQuizOptionCreatePayload,
    LessonQuizOptionUpdatePayload,
    LessonQuizOptionsListParams
>({
    baseUrl: "/lesson-quiz-options",
    useFormData: false,
    transformRequest: (data) => {
        const transformed = data as Record<string, unknown>;

        if ("isCorrect" in transformed && transformed.isCorrect !== undefined) {
            transformed.isCorrect = transformed.isCorrect ? 1 : 0;
        }

        return transformed;
    },
});

// ============================================================================
// Hooks (using factory)
// ============================================================================

/**
 * Lesson Quiz Options CRUD hooks (factory-generated)
 *
 * Provides: useList, useInfinite, useDetail, useCreate, useUpdate, useDelete
 */
export const lessonQuizOptionCrud = createCrudHooks({
    entity: "lesson-quiz-options",
    api: lessonQuizOptionsApiFactory,
    keys: lessonQuizOptionKeysFactory,
    invalidation: {
        onCreate: "all",
        onUpdate: "all",
        onDelete: "all",
    },
});

// ============================================================================
// Re-export individual hooks for convenience
// ============================================================================

/**
 * Hook to fetch paginated list of lesson quiz options
 */
export const useLessonQuizOptionListFactory = lessonQuizOptionCrud.useList;

/**
 * Hook to fetch infinite list of lesson quiz options
 */
export const useLessonQuizOptionInfiniteFactory =
    lessonQuizOptionCrud.useInfinite;

/**
 * Hook to fetch single lesson quiz option by ID
 */
export const useLessonQuizOptionDetailFactory = lessonQuizOptionCrud.useDetail;

/**
 * Hook to create a new lesson quiz option
 */
export const useCreateLessonQuizOptionFactory = lessonQuizOptionCrud.useCreate;

/**
 * Hook to update an existing lesson quiz option
 */
export const useUpdateLessonQuizOptionFactory = lessonQuizOptionCrud.useUpdate;

/**
 * Hook to delete a lesson quiz option
 */
export const useDeleteLessonQuizOptionFactory = lessonQuizOptionCrud.useDelete;
