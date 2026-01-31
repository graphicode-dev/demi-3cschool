/**
 * Lesson Quiz Questions Feature - CRUD Factory Example
 *
 * Example of using the CRUD factory to generate API and hooks.
 * This demonstrates how to use the factory alongside custom actions.
 *
 * @example
 * ```tsx
 * import { lessonQuizQuestionCrud } from '@/features/lessons/lesson-quiz-questions';
 *
 * // Use factory-generated hooks
 * const { data } = lessonQuizQuestionCrud.useList({ page: 1 });
 * const { mutate: create } = lessonQuizQuestionCrud.useCreate();
 * ```
 */

import {
    createCrudApi,
    createCrudHooks,
    createQueryKeys,
} from "@/shared/api/crud";
import { LessonQuizQuestion, LessonQuizQuestionCreatePayload, LessonQuizQuestionsListParams, LessonQuizQuestionUpdatePayload } from "../../types";

// ============================================================================
// Query Keys (using factory)
// ============================================================================

/**
 * Query keys for lesson quiz questions (factory-generated)
 */
export const lessonQuizQuestionKeysFactory = createQueryKeys(
    "lesson-quiz-questions"
);

// ============================================================================
// API (using factory)
// ============================================================================

/**
 * Lesson Quiz Questions API (factory-generated)
 *
 * Provides: getList, getById, create, update, delete
 */
export const lessonQuizQuestionsApiFactory = createCrudApi<
    LessonQuizQuestion,
    LessonQuizQuestionCreatePayload,
    LessonQuizQuestionUpdatePayload,
    LessonQuizQuestionsListParams
>({
    baseUrl: "/lesson-quiz-questions",
    useFormData: false,
    transformRequest: (data) => {
        const transformed: Record<string, unknown> = {};

        if ("quizId" in data && data.quizId !== undefined) {
            transformed.quizId = data.quizId;
        }
        if ("question" in data && data.question !== undefined) {
            transformed.question = data.question;
        }
        if ("type" in data && data.type !== undefined) {
            transformed.type = data.type;
        }
        if ("points" in data && data.points !== undefined) {
            transformed.points = data.points;
        }
        if ("order" in data && data.order !== undefined) {
            transformed.order = data.order;
        }
        if ("explanation" in data && data.explanation !== undefined) {
            transformed.explanation = data.explanation;
        }
        if ("isActive" in data && data.isActive !== undefined) {
            transformed.isActive = data.isActive ? 1 : 0;
        }

        return transformed;
    },
});

// ============================================================================
// Hooks (using factory)
// ============================================================================

/**
 * Lesson Quiz Questions CRUD hooks (factory-generated)
 *
 * Provides: useList, useInfinite, useDetail, useCreate, useUpdate, useDelete
 */
export const lessonQuizQuestionCrud = createCrudHooks({
    entity: "lesson-quiz-questions",
    api: lessonQuizQuestionsApiFactory,
    keys: lessonQuizQuestionKeysFactory,
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
 * Hook to fetch paginated list of lesson quiz questions
 */
export const useLessonQuizQuestionListFactory = lessonQuizQuestionCrud.useList;

/**
 * Hook to fetch infinite list of lesson quiz questions
 */
export const useLessonQuizQuestionInfiniteFactory =
    lessonQuizQuestionCrud.useInfinite;

/**
 * Hook to fetch single lesson quiz question by ID
 */
export const useLessonQuizQuestionDetailFactory =
    lessonQuizQuestionCrud.useDetail;

/**
 * Hook to create a new lesson quiz question
 */
export const useCreateLessonQuizQuestionFactory =
    lessonQuizQuestionCrud.useCreate;

/**
 * Hook to update an existing lesson quiz question
 */
export const useUpdateLessonQuizQuestionFactory =
    lessonQuizQuestionCrud.useUpdate;

/**
 * Hook to delete a lesson quiz question
 */
export const useDeleteLessonQuizQuestionFactory =
    lessonQuizQuestionCrud.useDelete;
