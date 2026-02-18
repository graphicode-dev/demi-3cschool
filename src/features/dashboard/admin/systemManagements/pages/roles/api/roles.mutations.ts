/**
 * Roles Feature - Mutation Hooks
 *
 * TanStack Query mutation hooks for modifying roles data.
 *
 * @example
 * ```tsx
 * // Create a new role
 * const { mutate: create } = useCreateRole();
 * create({ name: "admin", caption: "Admin", squad_type: "CORE", scope: "GLOBAL" });
 *
 * // Update a role
 * const { mutate: update } = useUpdateRole();
 * update({ id: 1, payload: { name: "updated" } });
 *
 * // Delete a role
 * const { mutate: remove } = useDeleteRole();
 * remove(roleId);
 * ```
 */

import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { Role, CreateRolePayload, UpdateRolePayload } from "../types";
import { roleKeys } from "./roles.keys";
import { rolesApi } from "./roles.api";

// ============================================================================
// Create Role
// ============================================================================

/**
 * Hook to create a new role
 *
 * @example
 * ```tsx
 * const { mutate, isPending } = useCreateRole();
 * mutate({ name: "admin", caption: "Admin", squad_type: "CORE", scope: "GLOBAL" });
 * ```
 */
export function useCreateRole() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (payload: CreateRolePayload) =>
            rolesApi.create(payload),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: roleKeys.lists(),
            });
        },
    });
}

// ============================================================================
// Update Role
// ============================================================================

/**
 * Hook to update an existing role
 *
 * @example
 * ```tsx
 * const { mutate, isPending } = useUpdateRole();
 * mutate({ id: 1, payload: { name: "updated" } });
 * ```
 */
export function useUpdateRole() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, payload }: { id: number; payload: UpdateRolePayload }) =>
            rolesApi.update(id, payload),
        onSuccess: (data: Role) => {
            queryClient.invalidateQueries({
                queryKey: roleKeys.lists(),
            });
            queryClient.invalidateQueries({
                queryKey: roleKeys.detail(data.id),
            });
        },
    });
}

// ============================================================================
// Delete Role
// ============================================================================

/**
 * Hook to delete a role
 *
 * @example
 * ```tsx
 * const { mutate, isPending } = useDeleteRole();
 * mutate(roleId);
 * ```
 */
export function useDeleteRole() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: number) =>
            rolesApi.delete(id),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: roleKeys.lists(),
            });
        },
    });
}
