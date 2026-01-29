/**
 * Groups Management Feature - Mutation Hooks
 *
 * TanStack Query hooks for writing group data.
 * All mutations automatically invalidate relevant queries.
 *
 * @example
 * ```tsx
 * // Create group
 * const createMutation = useCreateGroup();
 * await createMutation.mutateAsync(payload);
 *
 * // Update group
 * const updateMutation = useUpdateGroup();
 * await updateMutation.mutateAsync({ id: groupId, data: payload });
 *
 * // Delete group
 * const deleteMutation = useDeleteGroup();
 * await deleteMutation.mutateAsync(groupId);
 * ```
 */

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { groupKeys } from "./groups.keys";
import { groupsApi } from "./groups.api";
import type {
    Group,
    GroupCreatePayload,
    GroupUpdatePayload,
} from "../types/groups.types";
import { ApiError } from "@/shared/api";

// ============================================================================
// Create Mutation
// ============================================================================

/**
 * Hook to create a new group
 *
 * @example
 * ```tsx
 * const { mutate, mutateAsync, isPending, error } = useCreateGroup();
 *
 * const handleSubmit = async (data: GroupCreatePayload) => {
 *     try {
 *         const group = await mutateAsync(data);
 *         toast.success('Group created successfully');
 *     } catch (error) {
 *         // Error toast shown automatically by global handler
 *     }
 * };
 * ```
 */
export function useCreateGroup() {
    const queryClient = useQueryClient();

    return useMutation<Group, ApiError, GroupCreatePayload>({
        mutationFn: groupsApi.create,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: groupKeys.all });
        },
    });
}

// ============================================================================
// Update Mutation
// ============================================================================

/**
 * Hook to update an existing group
 *
 * @example
 * ```tsx
 * const { mutate, isPending } = useUpdateGroup();
 *
 * const handleUpdate = (data: GroupUpdatePayload) => {
 *     mutate(
 *         { id: groupId, data },
 *         {
 *             onSuccess: () => {
 *                 toast.success('Group updated');
 *             },
 *         }
 *     );
 * };
 * ```
 */
export function useUpdateGroup() {
    const queryClient = useQueryClient();

    return useMutation<Group, ApiError, { id: string; data: GroupUpdatePayload }>({
        mutationFn: ({ id, data }) => groupsApi.update(id, data),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: groupKeys.lists() });
            queryClient.invalidateQueries({
                queryKey: groupKeys.detail(variables.id),
            });
        },
    });
}

// ============================================================================
// Delete Mutation
// ============================================================================

/**
 * Hook to delete a group
 *
 * @example
 * ```tsx
 * const { mutate, isPending } = useDeleteGroup();
 *
 * const handleDelete = () => {
 *     if (confirm('Are you sure?')) {
 *         mutate(groupId, {
 *             onSuccess: () => {
 *                 toast.success('Group deleted');
 *                 navigate('/groups');
 *             },
 *         });
 *     }
 * };
 * ```
 */
export function useDeleteGroup() {
    const queryClient = useQueryClient();

    return useMutation<void, ApiError, string>({
        mutationFn: (id) => groupsApi.delete(id),
        onSuccess: (_, id) => {
            queryClient.invalidateQueries({ queryKey: groupKeys.all });
            queryClient.removeQueries({ queryKey: groupKeys.detail(id) });
        },
    });
}
