/**
 * Lesson Assignments Feature - CRUD Factory Example
 *
 * Example of using the CRUD factory to generate API and hooks.
 * This demonstrates how to use the factory alongside custom actions.
 *
 * @example
 * ```tsx
 * import { lessonAssignmentCrud } from '@/features/lessons/lesson-assignments';
 *
 * // Use factory-generated hooks
 * const { data } = lessonAssignmentCrud.useList();
 * const { mutate: create } = lessonAssignmentCrud.useCreate();
 * ```
 */

import {
    createCrudApi,
    createCrudHooks,
    createQueryKeys,
} from "@/shared/api/crud";
import { LessonAssignment, LessonAssignmentCreatePayload, LessonAssignmentUpdatePayload } from "../../types/lesson-assignments.types";

// ============================================================================
// Query Keys (using factory)
// ============================================================================

/**
 * Query keys for lesson assignments (factory-generated)
 */
export const lessonAssignmentKeysFactory =
    createQueryKeys("lesson-assignments");

// ============================================================================
// API (using factory)
// ============================================================================

/**
 * Lesson Assignments API (factory-generated)
 *
 * Provides: getList, getById, create, update, delete
 */
export const lessonAssignmentsApiFactory = createCrudApi<
    LessonAssignment,
    LessonAssignmentCreatePayload,
    LessonAssignmentUpdatePayload,
    Record<string, unknown>
>({
    baseUrl: "/lesson-assignments",
    useFormData: true,
    transformRequest: (data) => {
        return data as Record<string, unknown>;
    },
});

// ============================================================================
// Hooks (using factory)
// ============================================================================

/**
 * Lesson Assignments CRUD hooks (factory-generated)
 *
 * Provides: useList, useInfinite, useDetail, useCreate, useUpdate, useDelete
 */
export const lessonAssignmentCrud = createCrudHooks({
    entity: "lesson-assignments",
    api: lessonAssignmentsApiFactory,
    keys: lessonAssignmentKeysFactory,
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
 * Hook to fetch list of lesson assignments
 */
export const useLessonAssignmentListFactory = lessonAssignmentCrud.useList;

/**
 * Hook to fetch single lesson assignment by ID
 */
export const useLessonAssignmentDetailFactory = lessonAssignmentCrud.useDetail;

/**
 * Hook to create a new lesson assignment
 */
export const useCreateLessonAssignmentFactory = lessonAssignmentCrud.useCreate;

/**
 * Hook to update an existing lesson assignment
 */
export const useUpdateLessonAssignmentFactory = lessonAssignmentCrud.useUpdate;

/**
 * Hook to delete a lesson assignment
 */
export const useDeleteLessonAssignmentFactory = lessonAssignmentCrud.useDelete;
