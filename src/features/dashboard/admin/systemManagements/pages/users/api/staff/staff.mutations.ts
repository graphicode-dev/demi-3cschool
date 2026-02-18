/**
 * Staff Feature - Mutation Hooks
 *
 * TanStack Query mutation hooks for modifying staff data.
 *
 * @example
 * ```tsx
 * // Create a new staff member
 * const { mutate: create } = useCreateStaff();
 * create({ name: "Test", email: "test@example.com", password: "password", roleId: "1" });
 *
 * // Update a staff member
 * const { mutate: update } = useUpdateStaff();
 * update({ id: 1, payload: { name: "Updated" } });
 *
 * // Delete a staff member
 * const { mutate: remove } = useDeleteStaff();
 * remove(staffId);
 * ```
 */

import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { Staff, CreateStaffPayload, UpdateStaffPayload } from "./types";
import { staffKeys } from "./staff.keys";
import { staffApi } from "./staff.api";

// ============================================================================
// Create Staff
// ============================================================================

/**
 * Hook to create a new staff member
 *
 * @example
 * ```tsx
 * const { mutate, isPending } = useCreateStaff();
 * mutate({ name: "Test", email: "test@example.com", password: "password", roleId: "1" });
 * ```
 */
export function useCreateStaff() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (payload: CreateStaffPayload) =>
            staffApi.create(payload),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: staffKeys.lists(),
            });
        },
    });
}

// ============================================================================
// Update Staff
// ============================================================================

/**
 * Hook to update an existing staff member
 *
 * @example
 * ```tsx
 * const { mutate, isPending } = useUpdateStaff();
 * mutate({ id: 1, payload: { name: "Updated" } });
 * ```
 */
export function useUpdateStaff() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, payload }: { id: number; payload: UpdateStaffPayload }) =>
            staffApi.update(id, payload),
        onSuccess: (data: Staff) => {
            queryClient.invalidateQueries({
                queryKey: staffKeys.lists(),
            });
            queryClient.invalidateQueries({
                queryKey: staffKeys.detail(data.id),
            });
        },
    });
}

// ============================================================================
// Delete Staff
// ============================================================================

/**
 * Hook to delete a staff member
 *
 * @example
 * ```tsx
 * const { mutate, isPending } = useDeleteStaff();
 * mutate(staffId);
 * ```
 */
export function useDeleteStaff() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: number) =>
            staffApi.delete(id),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: staffKeys.lists(),
            });
        },
    });
}
