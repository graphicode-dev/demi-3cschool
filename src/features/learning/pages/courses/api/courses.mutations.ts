/**
 * Courses Feature - Mutation Hooks
 *
 * TanStack Query hooks for writing course data.
 * All mutations automatically invalidate relevant queries.
 *
 * @example
 * ```tsx
 * // Create course
 * const createMutation = useCreateCourse();
 * await createMutation.mutateAsync(payload);
 *
 * // Update course
 * const updateMutation = useUpdateCourse();
 * await updateMutation.mutateAsync({ id: courseId, data: payload });
 *
 * // Delete course
 * const deleteMutation = useDeleteCourse();
 * await deleteMutation.mutateAsync(courseId);
 * ```
 */

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { courseKeys } from "./courses.keys";
import { coursesApi } from "./courses.api";
import type {
    Course,
    CourseCreatePayload,
    CourseUpdatePayload,
} from "../types/courses.types";
import { ApiError } from "@/shared/api";

// ============================================================================
// Create Mutation
// ============================================================================

/**
 * Hook to create a new course
 *
 * @example
 * ```tsx
 * const { mutate, mutateAsync, isPending, error } = useCreateCourse();
 *
 * const handleSubmit = async (data: CourseCreatePayload) => {
 *     try {
 *         const course = await mutateAsync(data);
 *         toast.success('Course created successfully');
 *         navigate(`/courses/${course.id}`);
 *     } catch (error) {
 *         // Error toast shown automatically by global handler
 *     }
 * };
 * ```
 */
export function useCreateCourse() {
    const queryClient = useQueryClient();

    return useMutation<Course, ApiError, CourseCreatePayload>({
        mutationFn: coursesApi.create,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: courseKeys.all });
        },
    });
}

// ============================================================================
// Update Mutation
// ============================================================================

/**
 * Hook to update an existing course
 *
 * @example
 * ```tsx
 * const { mutate, isPending } = useUpdateCourse();
 *
 * const handleUpdate = (data: CourseUpdatePayload) => {
 *     mutate(
 *         { id: courseId, data },
 *         {
 *             onSuccess: () => {
 *                 toast.success('Course updated');
 *             },
 *         }
 *     );
 * };
 * ```
 */
export function useUpdateCourse() {
    const queryClient = useQueryClient();

    return useMutation<
        Course,
        ApiError,
        { id: string; data: CourseUpdatePayload }
    >({
        mutationFn: ({ id, data }) => coursesApi.update(id, data),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: courseKeys.lists() });
            queryClient.invalidateQueries({
                queryKey: courseKeys.detail(variables.id),
            });
        },
    });
}

// ============================================================================
// Delete Mutation
// ============================================================================

/**
 * Hook to delete a course
 *
 * @example
 * ```tsx
 * const { mutate, isPending } = useDeleteCourse();
 *
 * const handleDelete = () => {
 *     if (confirm('Are you sure?')) {
 *         mutate(courseId, {
 *             onSuccess: () => {
 *                 toast.success('Course deleted');
 *                 navigate('/courses');
 *             },
 *         });
 *     }
 * };
 * ```
 */
export function useDeleteCourse() {
    const queryClient = useQueryClient();

    return useMutation<void, ApiError, string>({
        mutationFn: (id) => coursesApi.delete(id),
        onSuccess: (_, id) => {
            queryClient.invalidateQueries({ queryKey: courseKeys.all });
            queryClient.removeQueries({ queryKey: courseKeys.detail(id) });
        },
    });
}
