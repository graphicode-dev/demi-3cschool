/**
 * Lesson Quizzes Feature - CRUD Factory Example
 *
 * Example of using the CRUD factory to generate API and hooks.
 * This demonstrates how to use the factory alongside custom actions.
 *
 * @example
 * ```tsx
 * import { lessonQuizCrud } from '@/features/lessons/lesson-quizzes';
 *
 * // Use factory-generated hooks
 * const { data } = lessonQuizCrud.useList({ page: 1 });
 * const { mutate: create } = lessonQuizCrud.useCreate();
 * ```
 */

import {
    createCrudApi,
    createCrudHooks,
    createQueryKeys,
} from "@/shared/api/crud";
import { LessonQuiz, LessonQuizCreatePayload, LessonQuizUpdatePayload, LessonQuizzesListParams } from "../../types";

// ============================================================================
// Query Keys (using factory)
// ============================================================================

/**
 * Query keys for lesson quizzes (factory-generated)
 */
export const lessonQuizKeysFactory = createQueryKeys("lesson-quizzes");

// ============================================================================
// API (using factory)
// ============================================================================

/**
 * Lesson Quizzes API (factory-generated)
 *
 * Provides: getList, getById, create, update, delete
 */
export const lessonQuizzesApiFactory = createCrudApi<
    LessonQuiz,
    LessonQuizCreatePayload,
    LessonQuizUpdatePayload,
    LessonQuizzesListParams
>({
    baseUrl: "/lesson-quizzes",
    useFormData: false,
    transformRequest: (data) => {
        const transformed: Record<string, unknown> = {};

        if ("lessonId" in data && data.lessonId !== undefined) {
            transformed.lessonId = data.lessonId;
        }
        if ("timeLimit" in data && data.timeLimit !== undefined) {
            transformed.timeLimit = data.timeLimit;
        }
        if ("passingScore" in data && data.passingScore !== undefined) {
            transformed.passingScore = data.passingScore;
        }
        if ("maxAttempts" in data && data.maxAttempts !== undefined) {
            transformed.maxAttempts = data.maxAttempts;
        }
        if ("shuffleQuestions" in data && data.shuffleQuestions !== undefined) {
            transformed.shuffleQuestions = data.shuffleQuestions ? 1 : 0;
        }
        if ("showAnswers" in data && data.showAnswers !== undefined) {
            transformed.showAnswers = data.showAnswers ? 1 : 0;
        }

        return transformed;
    },
});

// ============================================================================
// Hooks (using factory)
// ============================================================================

/**
 * Lesson Quizzes CRUD hooks (factory-generated)
 *
 * Provides: useList, useInfinite, useDetail, useCreate, useUpdate, useDelete
 */
export const lessonQuizCrud = createCrudHooks({
    entity: "lesson-quizzes",
    api: lessonQuizzesApiFactory,
    keys: lessonQuizKeysFactory,
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
 * Hook to fetch paginated list of lesson quizzes
 */
export const useLessonQuizListFactory = lessonQuizCrud.useList;

/**
 * Hook to fetch infinite list of lesson quizzes
 */
export const useLessonQuizInfiniteFactory = lessonQuizCrud.useInfinite;

/**
 * Hook to fetch single lesson quiz by ID
 */
export const useLessonQuizDetailFactory = lessonQuizCrud.useDetail;

/**
 * Hook to create a new lesson quiz
 */
export const useCreateLessonQuizFactory = lessonQuizCrud.useCreate;

/**
 * Hook to update an existing lesson quiz
 */
export const useUpdateLessonQuizFactory = lessonQuizCrud.useUpdate;

/**
 * Hook to delete a lesson quiz
 */
export const useDeleteLessonQuizFactory = lessonQuizCrud.useDelete;
