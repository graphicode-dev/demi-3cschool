/**
 * Programs Curriculum Feature - Mutation Hooks
 *
 * TanStack Query mutation hooks for creating, updating, and deleting programs curriculums.
 *
 * @example
 * ```tsx
 * // Create
 * const { mutateAsync: create } = useCreateProgramCurriculum();
 * await create({ name: 'test', caption: 'Test', description: 'Test', is_active: 1 });
 *
 * // Update
 * const { mutateAsync: update } = useUpdateProgramCurriculum();
 * await update({ id: '1', data: { name: 'updated' } });
 *
 * // Delete
 * const { mutateAsync: remove } = useDeleteProgramCurriculum();
 * await remove('1');
 * ```
 */

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { programsCurriculumKeys } from "./programsCurriculum.keys";
import { programsCurriculumApi } from "./programsCurriculum.api";
import type {
    ProgramCurriculum,
    ProgramCurriculumCreatePayload,
    ProgramCurriculumUpdatePayload,
} from "../types";

// ============================================================================
// Mutation Hooks
// ============================================================================

/**
 * Hook to create a new programs curriculum
 *
 * @example
 * ```tsx
 * const { mutateAsync, isPending } = useCreateProgramCurriculum();
 *
 * const handleCreate = async (data: ProgramCurriculumCreatePayload) => {
 *     await mutateAsync(data);
 * };
 * ```
 */
export function useCreateProgramCurriculum() {
    const queryClient = useQueryClient();

    return useMutation<
        ProgramCurriculum,
        Error,
        ProgramCurriculumCreatePayload
    >({
        mutationFn: (payload) => programsCurriculumApi.create(payload),
        onSuccess: () => {
            // Invalidate list queries to refetch
            queryClient.invalidateQueries({
                queryKey: programsCurriculumKeys.lists(),
            });
        },
    });
}

/**
 * Hook to update an existing programs curriculum
 *
 * @example
 * ```tsx
 * const { mutateAsync, isPending } = useUpdateProgramCurriculum();
 *
 * const handleUpdate = async (id: string, data: ProgramCurriculumUpdatePayload) => {
 *     await mutateAsync({ id, data });
 * };
 * ```
 */
export function useUpdateProgramCurriculum() {
    const queryClient = useQueryClient();

    return useMutation<
        ProgramCurriculum,
        Error,
        { id: string | number; data: ProgramCurriculumUpdatePayload }
    >({
        mutationFn: ({ id, data }) => programsCurriculumApi.update(id, data),
        onSuccess: (_, variables) => {
            // Invalidate the specific detail query
            queryClient.invalidateQueries({
                queryKey: programsCurriculumKeys.detail(variables.id),
            });
            // Invalidate list queries
            queryClient.invalidateQueries({
                queryKey: programsCurriculumKeys.lists(),
            });
        },
    });
}

/**
 * Hook to delete a programs curriculum
 *
 * @example
 * ```tsx
 * const { mutateAsync, isPending } = useDeleteProgramCurriculum();
 *
 * const handleDelete = async (id: string) => {
 *     await mutateAsync(id);
 * };
 * ```
 */
export function useDeleteProgramCurriculum() {
    const queryClient = useQueryClient();

    return useMutation<void, Error, string | number>({
        mutationFn: (id) => programsCurriculumApi.delete(id),
        onSuccess: (_, id) => {
            // Remove from cache
            queryClient.removeQueries({
                queryKey: programsCurriculumKeys.detail(id),
            });
            // Invalidate list queries
            queryClient.invalidateQueries({
                queryKey: programsCurriculumKeys.lists(),
            });
        },
    });
}
