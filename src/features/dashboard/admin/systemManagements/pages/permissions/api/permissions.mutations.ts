/**
 * Permissions Feature - Mutation Hooks
 *
 * TanStack Query mutation hooks for modifying permissions data.
 *
 * @example
 * ```tsx
 * // Assign permissions to a user
 * const { mutate: assign } = useAssignUserPermissions();
 * assign({ userId: 5, permission_ids: [1, 2, 3] });
 *
 * // Remove a permission from a user
 * const { mutate: remove } = useRemoveUserPermission(userId);
 * remove(permissionId);
 * ```
 */

import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { AssignUserPermissionsPayload } from "../types";
import { permissionKeys } from "./permissions.keys";
import { permissionsApi } from "./permissions.api";

// ============================================================================
// Assign User Permissions
// ============================================================================

/**
 * Hook to assign permissions to a user
 *
 * @example
 * ```tsx
 * const { mutate, isPending } = useAssignUserPermissions();
 * mutate({ userId: 5, permission_ids: [1, 2, 3] });
 * ```
 */
export function useAssignUserPermissions() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({
            userId,
            ...payload
        }: AssignUserPermissionsPayload & { userId: number }) =>
            permissionsApi.assignUserPermissions(userId, payload),
        onSuccess: (_data, variables) => {
            queryClient.invalidateQueries({
                queryKey: permissionKeys.userPermissions(variables.userId),
            });
        },
    });
}

// ============================================================================
// Remove User Permission
// ============================================================================

/**
 * Hook to remove a permission from a user
 *
 * @param userId - User ID to remove permission from
 *
 * @example
 * ```tsx
 * const { mutate, isPending } = useRemoveUserPermission(userId);
 * mutate(permissionId);
 * ```
 */
export function useRemoveUserPermission(userId: number) {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (permissionId: number) =>
            permissionsApi.removeUserPermission(userId, permissionId),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: permissionKeys.userPermissions(userId),
            });
        },
    });
}
