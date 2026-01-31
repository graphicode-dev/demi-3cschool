/**
 * Lesson Materials Feature - Mutation Hooks
 *
 * TanStack Query hooks for writing lesson material data.
 * All mutations automatically invalidate relevant queries.
 * Uses FormData for create and update operations.
 *
 * @example
 * ```tsx
 * // Create lesson material
 * const createMutation = useCreateLessonMaterial();
 * await createMutation.mutateAsync(payload);
 *
 * // Update lesson material
 * const updateMutation = useUpdateLessonMaterial();
 * await updateMutation.mutateAsync({ id: materialId, data: payload });
 *
 * // Delete lesson material
 * const deleteMutation = useDeleteLessonMaterial();
 * await deleteMutation.mutateAsync(materialId);
 * ```
 */

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { lessonMaterialKeys } from "./lesson-materials.keys";
import { lessonMaterialsApi } from "./lesson-materials.api";
import { LessonMaterial, LessonMaterialCreatePayload, LessonMaterialUpdatePayload } from "../../types";
import { ApiError } from "@/shared/api";

// ============================================================================
// Create Mutation
// ============================================================================

/**
 * Hook to create a new lesson material
 *
 * @example
 * ```tsx
 * const { mutate, mutateAsync, isPending, error } = useCreateLessonMaterial();
 *
 * const handleSubmit = async (data: LessonMaterialCreatePayload) => {
 *     try {
 *         const material = await mutateAsync(data);
 *         toast.success('Lesson material created successfully');
 *     } catch (error) {
 *         // Error toast shown automatically by global handler
 *     }
 * };
 * ```
 */
export function useCreateLessonMaterial() {
    const queryClient = useQueryClient();

    return useMutation<LessonMaterial, ApiError, LessonMaterialCreatePayload>({
        mutationFn: lessonMaterialsApi.create,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: lessonMaterialKeys.all });
        },
    });
}

// ============================================================================
// Update Mutation
// ============================================================================

/**
 * Hook to update an existing lesson material
 *
 * @example
 * ```tsx
 * const { mutate, isPending } = useUpdateLessonMaterial();
 *
 * const handleUpdate = (data: LessonMaterialUpdatePayload) => {
 *     mutate(
 *         { id: materialId, data },
 *         {
 *             onSuccess: () => {
 *                 toast.success('Lesson material updated');
 *             },
 *         }
 *     );
 * };
 * ```
 */
export function useUpdateLessonMaterial() {
    const queryClient = useQueryClient();

    return useMutation<
        LessonMaterial,
        ApiError,
        { id: string; data: LessonMaterialUpdatePayload }
    >({
        mutationFn: ({ id, data }) => lessonMaterialsApi.update(id, data),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({
                queryKey: lessonMaterialKeys.lists(),
            });
            queryClient.invalidateQueries({
                queryKey: lessonMaterialKeys.detail(variables.id),
            });
        },
    });
}

// ============================================================================
// Delete Mutation
// ============================================================================

/**
 * Hook to delete a lesson material
 *
 * @example
 * ```tsx
 * const { mutate, isPending } = useDeleteLessonMaterial();
 *
 * const handleDelete = () => {
 *     if (confirm('Are you sure?')) {
 *         mutate(materialId, {
 *             onSuccess: () => {
 *                 toast.success('Lesson material deleted');
 *             },
 *         });
 *     }
 * };
 * ```
 */
export function useDeleteLessonMaterial() {
    const queryClient = useQueryClient();

    return useMutation<void, ApiError, string>({
        mutationFn: (id) => lessonMaterialsApi.delete(id),
        onSuccess: (_, id) => {
            queryClient.invalidateQueries({ queryKey: lessonMaterialKeys.all });
            queryClient.removeQueries({
                queryKey: lessonMaterialKeys.detail(id),
            });
        },
    });
}
