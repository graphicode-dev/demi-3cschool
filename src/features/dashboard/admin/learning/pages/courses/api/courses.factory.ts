/**
 * Courses Feature - CRUD Factory Example
 *
 * Example of using the CRUD factory to generate API and hooks.
 * This demonstrates how to use the factory alongside custom actions.
 *
 * @example
 * ```tsx
 * import { courseCrud } from '@/features/courses';
 *
 * // Use factory-generated hooks
 * const { data } = courseCrud.useList({ page: 1 });
 * const { mutate: create } = courseCrud.useCreate();
 * ```
 */

import {
    createCrudApi,
    createCrudHooks,
    createQueryKeys,
} from "@/shared/api/crud";
import type {
    Course,
    CourseCreatePayload,
    CourseUpdatePayload,
    CoursesListParams,
} from "../types/courses.types";

// ============================================================================
// Query Keys (using factory)
// ============================================================================

/**
 * Query keys for courses (factory-generated)
 */
export const courseKeysFactory = createQueryKeys("courses");

// ============================================================================
// API (using factory)
// ============================================================================

/**
 * Courses API (factory-generated)
 *
 * Provides: getList, getById, create, update, delete
 */
export const coursesApiFactory = createCrudApi<
    Course,
    CourseCreatePayload,
    CourseUpdatePayload,
    CoursesListParams
>({
    baseUrl: "/courses",
    useFormData: true, // Courses use FormData for file uploads
    transformRequest: (data) => {
        const transformed: Record<string, unknown> = {};

        if (
            "programCurriculumId" in data &&
            data.programCurriculumId !== undefined
        ) {
            transformed.programCurriculumId = data.programCurriculumId;
        }
        if ("title" in data && data.title !== undefined) {
            transformed.title = data.title;
        }
        if ("description" in data && data.description !== undefined) {
            transformed.description = data.description;
        }
        if ("slug" in data && data.slug !== undefined) {
            transformed.slug = data.slug;
        }
        if ("isActive" in data && data.isActive !== undefined) {
            transformed.isActive = data.isActive ? 1 : 0;
        }
        if ("image" in data && data.image !== undefined) {
            transformed.image = data.image;
        }

        return transformed;
    },
});

// ============================================================================
// Hooks (using factory)
// ============================================================================

/**
 * Courses CRUD hooks (factory-generated)
 *
 * Provides: useList, useInfinite, useDetail, useCreate, useUpdate, useDelete
 */
export const courseCrud = createCrudHooks({
    entity: "courses",
    api: coursesApiFactory,
    keys: courseKeysFactory,
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
 * Hook to fetch paginated list of courses
 */
export const useCourseListFactory = courseCrud.useList;

/**
 * Hook to fetch infinite list of courses
 */
export const useCourseInfiniteFactory = courseCrud.useInfinite;

/**
 * Hook to fetch single course by ID
 */
export const useCourseDetailFactory = courseCrud.useDetail;

/**
 * Hook to create a new course
 */
export const useCreateCourseFactory = courseCrud.useCreate;

/**
 * Hook to update an existing course
 */
export const useUpdateCourseFactory = courseCrud.useUpdate;

/**
 * Hook to delete a course
 */
export const useDeleteCourseFactory = courseCrud.useDelete;
