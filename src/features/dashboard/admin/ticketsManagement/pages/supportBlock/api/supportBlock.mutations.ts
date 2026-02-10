import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supportBlockKeys } from "./supportBlock.keys";
import { supportBlockApi } from "./supportBlock.api";
import type {
    CreateSupportBlockPayload,
    UpdateSupportBlockPayload,
} from "../types";

// ============================================================================
// Mutations
// ============================================================================

/**
 * Hook to create a new support block
 */
export function useCreateSupportBlock() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (payload: CreateSupportBlockPayload) =>
            supportBlockApi.create(payload),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: supportBlockKeys.all });
        },
    });
}

/**
 * Hook to update an existing support block
 */
export function useUpdateSupportBlock() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({
            id,
            payload,
        }: {
            id: number | string;
            payload: UpdateSupportBlockPayload;
        }) => supportBlockApi.update(id, payload),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: supportBlockKeys.all });
            queryClient.invalidateQueries({
                queryKey: supportBlockKeys.detail(variables.id),
            });
        },
    });
}

/**
 * Hook to delete a support block
 */
export function useDeleteSupportBlock() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: number | string) => supportBlockApi.delete(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: supportBlockKeys.all });
        },
    });
}
