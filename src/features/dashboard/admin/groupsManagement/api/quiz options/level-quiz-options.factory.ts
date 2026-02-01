/**
 * Level Quiz Options Feature - CRUD Factory Example
 *
 * Example of using the CRUD factory to generate API and hooks.
 * This demonstrates how to use the factory alongside custom actions.
 *
 * @example
 * ```tsx
 * import { levelQuizOptionCrud } from '@/features/levels/quiz-options';
 *
 * // Use factory-generated hooks
 * const { data } = levelQuizOptionCrud.useList({ page: 1 });
 * const { mutate: create } = levelQuizOptionCrud.useCreate();
 * ```
 */

import {
    createCrudApi,
    createCrudHooks,
    createQueryKeys,
} from "@/shared/api/crud";
import { LevelQuizOption, LevelQuizOptionCreatePayload, LevelQuizOptionsListParams, LevelQuizOptionUpdatePayload } from "../../types/level-quiz-options.types";

// ============================================================================
// Query Keys (using factory)
// ============================================================================

/**
 * Query keys for level quiz options (factory-generated)
 */
export const levelQuizOptionKeysFactory = createQueryKeys("level-quiz-options");

// ============================================================================
// API (using factory)
// ============================================================================

/**
 * Level Quiz Options API (factory-generated)
 *
 * Provides: getList, getById, create, update, delete
 */
export const levelQuizOptionsApiFactory = createCrudApi<
    LevelQuizOption,
    LevelQuizOptionCreatePayload,
    LevelQuizOptionUpdatePayload,
    LevelQuizOptionsListParams
>({
    baseUrl: "/level-quiz-options",
    useFormData: false,
    transformRequest: (data) => {
        return data as Record<string, unknown>;
    },
});

// ============================================================================
// Hooks (using factory)
// ============================================================================

/**
 * Level Quiz Options CRUD hooks (factory-generated)
 *
 * Provides: useList, useInfinite, useDetail, useCreate, useUpdate, useDelete
 */
export const levelQuizOptionCrud = createCrudHooks({
    entity: "level-quiz-options",
    api: levelQuizOptionsApiFactory,
    keys: levelQuizOptionKeysFactory,
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
 * Hook to fetch paginated list of level quiz options
 */
export const useLevelQuizOptionListFactory = levelQuizOptionCrud.useList;

/**
 * Hook to fetch infinite list of level quiz options
 */
export const useLevelQuizOptionInfiniteFactory =
    levelQuizOptionCrud.useInfinite;

/**
 * Hook to fetch single level quiz option by ID
 */
export const useLevelQuizOptionDetailFactory = levelQuizOptionCrud.useDetail;

/**
 * Hook to create a new level quiz option
 */
export const useCreateLevelQuizOptionFactory = levelQuizOptionCrud.useCreate;

/**
 * Hook to update an existing level quiz option
 */
export const useUpdateLevelQuizOptionFactory = levelQuizOptionCrud.useUpdate;

/**
 * Hook to delete a level quiz option
 */
export const useDeleteLevelQuizOptionFactory = levelQuizOptionCrud.useDelete;
