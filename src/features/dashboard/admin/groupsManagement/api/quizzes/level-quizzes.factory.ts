/**
 * Level Quizzes Feature - CRUD Factory Example
 *
 * Example of using the CRUD factory to generate API and hooks.
 * This demonstrates how to use the factory alongside custom actions.
 *
 * @example
 * ```tsx
 * import { levelQuizCrud } from '@/features/levels/quizzes';
 *
 * // Use factory-generated hooks
 * const { data } = levelQuizCrud.useList({ page: 1 });
 * const { mutate: create } = levelQuizCrud.useCreate();
 * ```
 */

import {
    createCrudApi,
    createCrudHooks,
    createQueryKeys,
} from "@/shared/api/crud";
import { LevelQuiz } from "../../types";
import {
    LevelQuizCreatePayload,
    LevelQuizUpdatePayload,
} from "../../types/level-quizzes.types";
import { ListQueryParams } from "@/shared/api";

// ============================================================================
// Query Keys (using factory)
// ============================================================================

/**
 * Query keys for level quizzes (factory-generated)
 */
export const levelQuizKeysFactory = createQueryKeys("level-quizzes");

// ============================================================================
// API (using factory)
// ============================================================================

/**
 * Level Quizzes API (factory-generated)
 *
 * Provides: getList, getById, create, update, delete
 */
export const levelQuizzesApiFactory = createCrudApi<
    LevelQuiz,
    LevelQuizCreatePayload,
    LevelQuizUpdatePayload,
    ListQueryParams
>({
    baseUrl: "/level-quizzes",
    useFormData: false,
    transformRequest: (data) => {
        const transformed: Record<string, unknown> = {};

        if ("levelId" in data && data.levelId !== undefined) {
            transformed.levelId = data.levelId;
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
            transformed.shuffleQuestions = data.shuffleQuestions;
        }
        if ("showAnswers" in data && data.showAnswers !== undefined) {
            transformed.showAnswers = data.showAnswers;
        }

        return transformed;
    },
});

// ============================================================================
// Hooks (using factory)
// ============================================================================

/**
 * Level Quizzes CRUD hooks (factory-generated)
 *
 * Provides: useList, useInfinite, useDetail, useCreate, useUpdate, useDelete
 */
export const levelQuizCrud = createCrudHooks({
    entity: "level-quizzes",
    api: levelQuizzesApiFactory,
    keys: levelQuizKeysFactory,
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
 * Hook to fetch paginated list of level quizzes
 */
export const useLevelQuizListFactory = levelQuizCrud.useList;

/**
 * Hook to fetch infinite list of level quizzes
 */
export const useLevelQuizInfiniteFactory = levelQuizCrud.useInfinite;

/**
 * Hook to fetch single level quiz by ID
 */
export const useLevelQuizDetailFactory = levelQuizCrud.useDetail;

/**
 * Hook to create a new level quiz
 */
export const useCreateLevelQuizFactory = levelQuizCrud.useCreate;

/**
 * Hook to update an existing level quiz
 */
export const useUpdateLevelQuizFactory = levelQuizCrud.useUpdate;

/**
 * Hook to delete a level quiz
 */
export const useDeleteLevelQuizFactory = levelQuizCrud.useDelete;
