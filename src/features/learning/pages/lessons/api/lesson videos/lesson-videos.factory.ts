/**
 * Lesson Videos Feature - CRUD Factory Example
 *
 * Example of using the CRUD factory to generate API and hooks.
 * This demonstrates how to use the factory alongside custom actions.
 *
 * @example
 * ```tsx
 * import { lessonVideoCrud } from '@/features/lessons/lesson-videos';
 *
 * // Use factory-generated hooks
 * const { data } = lessonVideoCrud.useList();
 * const { mutate: create } = lessonVideoCrud.useCreate();
 * ```
 */

import {
    createCrudApi,
    createCrudHooks,
    createQueryKeys,
} from "@/shared/api/crud";
import { LessonVideo, LessonVideoCreatePayload, LessonVideoUpdatePayload } from "../../types";

// ============================================================================
// Query Keys (using factory)
// ============================================================================

/**
 * Query keys for lesson videos (factory-generated)
 */
export const lessonVideoKeysFactory = createQueryKeys("lesson-videos");

// ============================================================================
// API (using factory)
// ============================================================================

/**
 * Lesson Videos API (factory-generated)
 *
 * Provides: getList, getById, create, update, delete
 */
export const lessonVideosApiFactory = createCrudApi<
    LessonVideo,
    LessonVideoCreatePayload,
    LessonVideoUpdatePayload,
    Record<string, unknown>
>({
    baseUrl: "/lesson-videos",
    useFormData: false,
    transformRequest: (data) => {
        return data as Record<string, unknown>;
    },
});

// ============================================================================
// Hooks (using factory)
// ============================================================================

/**
 * Lesson Videos CRUD hooks (factory-generated)
 *
 * Provides: useList, useInfinite, useDetail, useCreate, useUpdate, useDelete
 */
export const lessonVideoCrud = createCrudHooks({
    entity: "lesson-videos",
    api: lessonVideosApiFactory,
    keys: lessonVideoKeysFactory,
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
 * Hook to fetch list of lesson videos
 */
export const useLessonVideoListFactory = lessonVideoCrud.useList;

/**
 * Hook to fetch single lesson video by ID
 */
export const useLessonVideoDetailFactory = lessonVideoCrud.useDetail;

/**
 * Hook to create a new lesson video
 */
export const useCreateLessonVideoFactory = lessonVideoCrud.useCreate;

/**
 * Hook to update an existing lesson video
 */
export const useUpdateLessonVideoFactory = lessonVideoCrud.useUpdate;

/**
 * Hook to delete a lesson video
 */
export const useDeleteLessonVideoFactory = lessonVideoCrud.useDelete;
