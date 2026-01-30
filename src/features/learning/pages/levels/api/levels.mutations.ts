/**
 * Levels Feature - Mutation Hooks
 *
 * TanStack Query hooks for writing level data.
 * All mutations automatically invalidate relevant queries.
 *
 * @example
 * ```tsx
 * // Create level
 * const createMutation = useCreateLevel();
 * await createMutation.mutateAsync(payload);
 *
 * // Update level
 * const updateMutation = useUpdateLevel();
 * await updateMutation.mutateAsync({ id: levelId, data: payload });
 *
 * // Delete level
 * const deleteMutation = useDeleteLevel();
 * await deleteMutation.mutateAsync(levelId);
 * ```
 */

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { levelKeys } from "./levels.keys";
import { levelsApi } from "./levels.api";
import type {
    Level,
    LevelCreatePayload,
    LevelUpdatePayload,
} from "../types/levels.types";
import { ApiError } from "@/shared/api";

// ============================================================================
// Create Mutation
// ============================================================================

/**
 * Hook to create a new level
 *
 * @example
 * ```tsx
 * const { mutate, mutateAsync, isPending, error } = useCreateLevel();
 *
 * const handleSubmit = async (data: LevelCreatePayload) => {
 *     try {
 *         const levels = await mutateAsync(data);
 *         toast.success('Level created successfully');
 *     } catch (error) {
 *         // Error toast shown automatically by global handler
 *     }
 * };
 * ```
 */
export function useCreateLevel() {
    const queryClient = useQueryClient();

    return useMutation<Level[], ApiError, LevelCreatePayload>({
        mutationFn: levelsApi.create,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: levelKeys.all });
        },
    });
}

// ============================================================================
// Update Mutation
// ============================================================================

/**
 * Hook to update an existing level
 *
 * @example
 * ```tsx
 * const { mutate, isPending } = useUpdateLevel();
 *
 * const handleUpdate = (data: LevelUpdatePayload) => {
 *     mutate(
 *         { id: levelId, data },
 *         {
 *             onSuccess: () => {
 *                 toast.success('Level updated');
 *             },
 *         }
 *     );
 * };
 * ```
 */
export function useUpdateLevel() {
    const queryClient = useQueryClient();

    return useMutation<Level, ApiError, { id: string; data: LevelUpdatePayload }>({
        mutationFn: ({ id, data }) => levelsApi.update(id, data),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: levelKeys.lists() });
            queryClient.invalidateQueries({
                queryKey: levelKeys.detail(variables.id),
            });
        },
    });
}

// ============================================================================
// Delete Mutation
// ============================================================================

/**
 * Hook to delete a level
 *
 * @example
 * ```tsx
 * const { mutate, isPending } = useDeleteLevel();
 *
 * const handleDelete = () => {
 *     if (confirm('Are you sure?')) {
 *         mutate(levelId, {
 *             onSuccess: () => {
 *                 toast.success('Level deleted');
 *                 navigate('/levels');
 *             },
 *         });
 *     }
 * };
 * ```
 */
export function useDeleteLevel() {
    const queryClient = useQueryClient();

    return useMutation<void, ApiError, string>({
        mutationFn: (id) => levelsApi.delete(id),
        onSuccess: (_, id) => {
            queryClient.invalidateQueries({ queryKey: levelKeys.all });
            queryClient.removeQueries({ queryKey: levelKeys.detail(id) });
        },
    });
}
