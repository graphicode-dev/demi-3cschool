/**
 * Level Prices Feature - Mutation Hooks
 *
 * TanStack Query mutations for level price operations.
 */

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { levelPriceKeys } from "./priceLists.keys";
import { levelPricesApi } from "./priceLists.api";
import type { ApiError } from "@/shared/api";
import type {
    LevelPrice,
    LevelPriceCreatePayload,
    LevelPriceUpdatePayload,
} from "../types";

// ============================================================================
// Create Level Price Mutation
// ============================================================================

/**
 * Hook to create a new level price
 */
export function useCreateLevelPrice() {
    const queryClient = useQueryClient();

    return useMutation<LevelPrice, ApiError, LevelPriceCreatePayload>({
        mutationFn: (payload) => levelPricesApi.create(payload),
        onSuccess: (newLevelPrice) => {
            // Invalidate lists to refetch
            queryClient.invalidateQueries({ queryKey: levelPriceKeys.lists() });
            // Invalidate by-level if we know the level
            if (newLevelPrice.level?.id) {
                queryClient.invalidateQueries({
                    queryKey: levelPriceKeys.forLevel(
                        String(newLevelPrice.level.id)
                    ),
                });
            }
        },
    });
}

// ============================================================================
// Update Level Price Mutation
// ============================================================================

/**
 * Hook to update an existing level price
 */
export function useUpdateLevelPrice() {
    const queryClient = useQueryClient();

    return useMutation<
        LevelPrice,
        ApiError,
        { id: string | number; payload: LevelPriceUpdatePayload }
    >({
        mutationFn: ({ id, payload }) => levelPricesApi.update(id, payload),
        onSuccess: (updatedLevelPrice) => {
            // Update the specific item in cache
            queryClient.setQueryData(
                levelPriceKeys.detail(String(updatedLevelPrice.id)),
                updatedLevelPrice
            );
            // Invalidate lists
            queryClient.invalidateQueries({ queryKey: levelPriceKeys.lists() });
            // Invalidate by-level if we know the level
            if (updatedLevelPrice.level?.id) {
                queryClient.invalidateQueries({
                    queryKey: levelPriceKeys.forLevel(
                        String(updatedLevelPrice.level.id)
                    ),
                });
            }
        },
    });
}

// ============================================================================
// Delete Level Price Mutation
// ============================================================================

/**
 * Hook to delete a level price
 */
export function useDeleteLevelPrice() {
    const queryClient = useQueryClient();

    return useMutation<void, ApiError, string | number>({
        mutationFn: (id) => levelPricesApi.delete(id),
        onSuccess: () => {
            // Invalidate all lists
            queryClient.invalidateQueries({ queryKey: levelPriceKeys.lists() });
            queryClient.invalidateQueries({
                queryKey: levelPriceKeys.byLevel(),
            });
        },
    });
}
