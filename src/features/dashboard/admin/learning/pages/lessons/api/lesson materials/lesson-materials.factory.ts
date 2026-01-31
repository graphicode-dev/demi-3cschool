/**
 * Lesson Materials Feature - CRUD Factory Example
 *
 * Example of using the CRUD factory to generate API and hooks.
 * This demonstrates how to use the factory alongside custom actions.
 *
 * @example
 * ```tsx
 * import { lessonMaterialCrud } from '@/features/lessons/lesson-materials';
 *
 * // Use factory-generated hooks
 * const { data } = lessonMaterialCrud.useList();
 * const { mutate: create } = lessonMaterialCrud.useCreate();
 * ```
 */

import {
    createCrudApi,
    createCrudHooks,
    createQueryKeys,
} from "@/shared/api/crud";
import { LessonMaterial, LessonMaterialCreatePayload, LessonMaterialUpdatePayload } from "../../types";

// ============================================================================
// Query Keys (using factory)
// ============================================================================

/**
 * Query keys for lesson materials (factory-generated)
 */
export const lessonMaterialKeysFactory = createQueryKeys("lesson-materials");

// ============================================================================
// API (using factory)
// ============================================================================

/**
 * Lesson Materials API (factory-generated)
 *
 * Provides: getList, getById, create, update, delete
 */
export const lessonMaterialsApiFactory = createCrudApi<
    LessonMaterial,
    LessonMaterialCreatePayload,
    LessonMaterialUpdatePayload,
    Record<string, unknown>
>({
    baseUrl: "/lesson-materials",
    useFormData: true,
    transformRequest: (data) => {
        return data as Record<string, unknown>;
    },
});

// ============================================================================
// Hooks (using factory)
// ============================================================================

/**
 * Lesson Materials CRUD hooks (factory-generated)
 *
 * Provides: useList, useInfinite, useDetail, useCreate, useUpdate, useDelete
 */
export const lessonMaterialCrud = createCrudHooks({
    entity: "lesson-materials",
    api: lessonMaterialsApiFactory,
    keys: lessonMaterialKeysFactory,
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
 * Hook to fetch list of lesson materials
 */
export const useLessonMaterialListFactory = lessonMaterialCrud.useList;

/**
 * Hook to fetch single lesson material by ID
 */
export const useLessonMaterialDetailFactory = lessonMaterialCrud.useDetail;

/**
 * Hook to create a new lesson material
 */
export const useCreateLessonMaterialFactory = lessonMaterialCrud.useCreate;

/**
 * Hook to update an existing lesson material
 */
export const useUpdateLessonMaterialFactory = lessonMaterialCrud.useUpdate;

/**
 * Hook to delete a lesson material
 */
export const useDeleteLessonMaterialFactory = lessonMaterialCrud.useDelete;
