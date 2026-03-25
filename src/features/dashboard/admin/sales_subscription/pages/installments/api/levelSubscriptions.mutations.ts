/**
 * Level Subscriptions Feature - Mutation Hooks
 *
 * TanStack Query mutation hooks for creating and updating level subscriptions.
 *
 * @example
 * ```tsx
 * const { mutate: createSubscription, isPending } = useCreateLevelSubscription();
 *
 * const handleCreate = () => {
 *     createSubscription(payload, {
 *         onSuccess: () => {
 *             toast.success('Subscription created');
 *         },
 *     });
 * };
 * ```
 */

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { levelSubscriptionKeys } from "./levelSubscriptions.keys";
import { levelSubscriptionsApi } from "./levelSubscriptions.api";
import type {
    LevelSubscription,
    LevelSubscriptionCreatePayload,
    LevelSubscriptionStatusPayload,
} from "../types";
import { ApiError } from "@/shared/api";

/**
 * Hook to create a new level subscription
 *
 * @returns Mutation for creating a subscription
 */
export function useCreateLevelSubscription() {
    const queryClient = useQueryClient();

    return useMutation<
        LevelSubscription,
        ApiError,
        LevelSubscriptionCreatePayload
    >({
        mutationFn: (payload) => levelSubscriptionsApi.create(payload),
        onSuccess: () => {
            // Invalidate all subscription lists
            queryClient.invalidateQueries({
                queryKey: levelSubscriptionKeys.lists(),
            });
        },
    });
}

/**
 * Hook to update a level subscription status
 *
 * @returns Mutation for updating subscription status
 */
export function useUpdateLevelSubscriptionStatus() {
    const queryClient = useQueryClient();

    return useMutation<
        LevelSubscription,
        ApiError,
        { id: string | number; payload: LevelSubscriptionStatusPayload }
    >({
        mutationFn: ({ id, payload }) =>
            levelSubscriptionsApi.updateStatus(id, payload),
        onSuccess: (data, variables) => {
            // Update the specific subscription in cache
            queryClient.setQueryData(
                levelSubscriptionKeys.detail(variables.id),
                data
            );
            // Invalidate lists to reflect status change
            queryClient.invalidateQueries({
                queryKey: levelSubscriptionKeys.lists(),
            });
        },
    });
}
