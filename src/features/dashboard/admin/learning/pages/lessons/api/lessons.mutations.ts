/**
 * Lessons Feature - Mutation Hooks
 *
 * TanStack Query hooks for writing lesson data.
 * All mutations automatically invalidate relevant queries.
 *
 * @example
 * ```tsx
 * // Create lesson
 * const createMutation = useCreateLesson();
 * await createMutation.mutateAsync(payload);
 *
 * // Update lesson
 * const updateMutation = useUpdateLesson();
 * await updateMutation.mutateAsync({ id: lessonId, data: payload });
 *
 * // Delete lesson
 * const deleteMutation = useDeleteLesson();
 * await deleteMutation.mutateAsync(lessonId);
 * ```
 */

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { lessonKeys } from "./lessons.keys";
import { lessonsApi } from "./lessons.api";
import type {
    Lesson,
    LessonCreatePayload,
    LessonUpdatePayload,
} from "../types/lessons.types";
import { ApiError } from "@/shared/api";

// ============================================================================
// Create Mutation
// ============================================================================

/**
 * Hook to create a new lesson
 *
 * @example
 * ```tsx
 * const { mutate, mutateAsync, isPending, error } = useCreateLesson();
 *
 * const handleSubmit = async (data: LessonCreatePayload) => {
 *     try {
 *         const lesson = await mutateAsync(data);
 *         toast.success('Lesson created successfully');
 *     } catch (error) {
 *         // Error toast shown automatically by global handler
 *     }
 * };
 * ```
 */
export function useCreateLesson() {
    const queryClient = useQueryClient();

    return useMutation<Lesson, ApiError, LessonCreatePayload>({
        mutationFn: lessonsApi.create,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: lessonKeys.all });
        },
    });
}

// ============================================================================
// Update Mutation
// ============================================================================

/**
 * Hook to update an existing lesson
 *
 * @example
 * ```tsx
 * const { mutate, isPending } = useUpdateLesson();
 *
 * const handleUpdate = (data: LessonUpdatePayload) => {
 *     mutate(
 *         { id: lessonId, data },
 *         {
 *             onSuccess: () => {
 *                 toast.success('Lesson updated');
 *             },
 *         }
 *     );
 * };
 * ```
 */
export function useUpdateLesson() {
    const queryClient = useQueryClient();

    return useMutation<
        Lesson,
        ApiError,
        { id: string; data: LessonUpdatePayload }
    >({
        mutationFn: ({ id, data }) => lessonsApi.update(id, data),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: lessonKeys.lists() });
            queryClient.invalidateQueries({
                queryKey: lessonKeys.detail(variables.id),
            });
        },
    });
}

// ============================================================================
// Delete Mutation
// ============================================================================

/**
 * Hook to delete a lesson
 *
 * @example
 * ```tsx
 * const { mutate, isPending } = useDeleteLesson();
 *
 * const handleDelete = () => {
 *     if (confirm('Are you sure?')) {
 *         mutate(lessonId, {
 *             onSuccess: () => {
 *                 toast.success('Lesson deleted');
 *                 navigate('/lessons');
 *             },
 *         });
 *     }
 * };
 * ```
 */
export function useDeleteLesson() {
    const queryClient = useQueryClient();

    return useMutation<void, ApiError, string>({
        mutationFn: (id) => lessonsApi.delete(id),
        onSuccess: (_, id) => {
            queryClient.invalidateQueries({ queryKey: lessonKeys.all });
            queryClient.removeQueries({ queryKey: lessonKeys.detail(id) });
        },
    });
}
