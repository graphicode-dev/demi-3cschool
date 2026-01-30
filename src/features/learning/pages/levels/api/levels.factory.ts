/**
 * Levels Feature - CRUD Factory Example
 *
 * Example of using the CRUD factory to generate API and hooks.
 * This demonstrates how to use the factory alongside custom actions.
 *
 * @example
 * ```tsx
 * import { levelCrud } from '@/features/levels';
 *
 * // Use factory-generated hooks
 * const { data } = levelCrud.useList({ page: 1 });
 * const { mutate: create } = levelCrud.useCreate();
 * ```
 */

import {
    createCrudApi,
    createCrudHooks,
    createQueryKeys,
} from "@/shared/api/crud";
import type {
    Level,
    LevelCreatePayload,
    LevelUpdatePayload,
    LevelsListParams,
} from "../types/levels.types";

// ============================================================================
// Query Keys (using factory)
// ============================================================================

/**
 * Query keys for levels (factory-generated)
 */
export const levelKeysFactory = createQueryKeys("levels");

// ============================================================================
// API (using factory)
// ============================================================================

/**
 * Levels API (factory-generated)
 *
 * Provides: getList, getById, create, update, delete
 */
export const levelsApiFactory = createCrudApi<
    Level,
    LevelCreatePayload,
    LevelUpdatePayload,
    LevelsListParams
>({
    baseUrl: "/levels",
    useFormData: false,
    transformRequest: (data) => {
        const transformed: Record<string, unknown> = {};

        if ("courseId" in data && data.courseId !== undefined) {
            transformed.courseId = data.courseId;
        }
        if ("title" in data && data.title !== undefined) {
            transformed.title = data.title;
        }
        if ("description" in data && data.description !== undefined) {
            transformed.description = data.description;
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
 * Levels CRUD hooks (factory-generated)
 *
 * Provides: useList, useInfinite, useDetail, useCreate, useUpdate, useDelete
 */
export const levelCrud = createCrudHooks({
    entity: "levels",
    api: levelsApiFactory,
    keys: levelKeysFactory,
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
 * Hook to fetch paginated list of levels
 */
export const useLevelListFactory = levelCrud.useList;

/**
 * Hook to fetch infinite list of levels
 */
export const useLevelInfiniteFactory = levelCrud.useInfinite;

/**
 * Hook to fetch single level by ID
 */
export const useLevelDetailFactory = levelCrud.useDetail;

/**
 * Hook to create a new level
 */
export const useCreateLevelFactory = levelCrud.useCreate;

/**
 * Hook to update an existing level
 */
export const useUpdateLevelFactory = levelCrud.useUpdate;

/**
 * Hook to delete a level
 */
export const useDeleteLevelFactory = levelCrud.useDelete;
