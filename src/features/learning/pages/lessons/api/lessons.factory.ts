/**
 * Lessons Feature - CRUD Factory Example
 *
 * Example of using the CRUD factory to generate API and hooks.
 * This demonstrates how to use the factory alongside custom actions.
 *
 * @example
 * ```tsx
 * import { lessonCrud } from '@/features/lessons';
 *
 * // Use factory-generated hooks
 * const { data } = lessonCrud.useList({ page: 1 });
 * const { mutate: create } = lessonCrud.useCreate();
 * ```
 */

import {
    createCrudApi,
    createCrudHooks,
    createQueryKeys,
} from "@/shared/api/crud";
import type {
    Lesson,
    LessonCreatePayload,
    LessonUpdatePayload,
    LessonsListParams,
} from "../types/lessons.types";

// ============================================================================
// Query Keys (using factory)
// ============================================================================

/**
 * Query keys for lessons (factory-generated)
 */
export const lessonKeysFactory = createQueryKeys("lessons");

// ============================================================================
// API (using factory)
// ============================================================================

/**
 * Lessons API (factory-generated)
 *
 * Provides: getList, getById, create, update, delete
 */
export const lessonsApiFactory = createCrudApi<
    Lesson,
    LessonCreatePayload,
    LessonUpdatePayload,
    LessonsListParams
>({
    baseUrl: "/lessons",
    useFormData: false,
    transformRequest: (data) => {
        const transformed: Record<string, unknown> = {};

        if ("levelId" in data && data.levelId !== undefined) {
            transformed.levelId = data.levelId;
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
 * Lessons CRUD hooks (factory-generated)
 *
 * Provides: useList, useInfinite, useDetail, useCreate, useUpdate, useDelete
 */
export const lessonCrud = createCrudHooks({
    entity: "lessons",
    api: lessonsApiFactory,
    keys: lessonKeysFactory,
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
 * Hook to fetch paginated list of lessons
 */
export const useLessonListFactory = lessonCrud.useList;

/**
 * Hook to fetch infinite list of lessons
 */
export const useLessonInfiniteFactory = lessonCrud.useInfinite;

/**
 * Hook to fetch single lesson by ID
 */
export const useLessonDetailFactory = lessonCrud.useDetail;

/**
 * Hook to create a new lesson
 */
export const useCreateLessonFactory = lessonCrud.useCreate;

/**
 * Hook to update an existing lesson
 */
export const useUpdateLessonFactory = lessonCrud.useUpdate;

/**
 * Hook to delete a lesson
 */
export const useDeleteLessonFactory = lessonCrud.useDelete;
