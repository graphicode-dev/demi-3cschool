/**
 * Level Quiz Questions Feature - CRUD Factory Example
 *
 * Example of using the CRUD factory to generate API and hooks.
 * This demonstrates how to use the factory alongside custom actions.
 *
 * @example
 * ```tsx
 * import { levelQuizQuestionCrud } from '@/features/levels/quiz-questions';
 *
 * // Use factory-generated hooks
 * const { data } = levelQuizQuestionCrud.useList({ page: 1 });
 * const { mutate: create } = levelQuizQuestionCrud.useCreate();
 * ```
 */

import {
    createCrudApi,
    createCrudHooks,
    createQueryKeys,
} from "@/shared/api/crud";
import { LevelQuizQuestion, LevelQuizQuestionCreatePayload, LevelQuizQuestionsListParams, LevelQuizQuestionUpdatePayload } from "../../types/level-quiz-questions.types";

// ============================================================================
// Query Keys (using factory)
// ============================================================================

/**
 * Query keys for level quiz questions (factory-generated)
 */
export const levelQuizQuestionKeysFactory = createQueryKeys(
    "level-quiz-questions"
);

// ============================================================================
// API (using factory)
// ============================================================================

/**
 * Level Quiz Questions API (factory-generated)
 *
 * Provides: getList, getById, create, update, delete
 */
export const levelQuizQuestionsApiFactory = createCrudApi<
    LevelQuizQuestion,
    LevelQuizQuestionCreatePayload,
    LevelQuizQuestionUpdatePayload,
    LevelQuizQuestionsListParams
>({
    baseUrl: "/level-quiz-questions",
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
 * Level Quiz Questions CRUD hooks (factory-generated)
 *
 * Provides: useList, useInfinite, useDetail, useCreate, useUpdate, useDelete
 */
export const levelQuizQuestionCrud = createCrudHooks({
    entity: "level-quiz-questions",
    api: levelQuizQuestionsApiFactory,
    keys: levelQuizQuestionKeysFactory,
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
 * Hook to fetch paginated list of level quiz questions
 */
export const useLevelQuizQuestionListFactory = levelQuizQuestionCrud.useList;

/**
 * Hook to fetch infinite list of level quiz questions
 */
export const useLevelQuizQuestionInfiniteFactory =
    levelQuizQuestionCrud.useInfinite;

/**
 * Hook to fetch single level quiz question by ID
 */
export const useLevelQuizQuestionDetailFactory =
    levelQuizQuestionCrud.useDetail;

/**
 * Hook to create a new level quiz question
 */
export const useCreateLevelQuizQuestionFactory =
    levelQuizQuestionCrud.useCreate;

/**
 * Hook to update an existing level quiz question
 */
export const useUpdateLevelQuizQuestionFactory =
    levelQuizQuestionCrud.useUpdate;

/**
 * Hook to delete a level quiz question
 */
export const useDeleteLevelQuizQuestionFactory =
    levelQuizQuestionCrud.useDelete;
