/**
 * Acceptance Exam Options Feature - Mutation Hooks
 */

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { acceptanceExamOptionKeys } from "./acceptance-exam-options.keys";
import { acceptanceExamOptionsApi } from "./acceptance-exam-options.api";
import {
    AcceptanceExamOption,
    AcceptanceExamOptionCreatePayload,
    AcceptanceExamOptionUpdatePayload,
} from "../../../../types/acceptance-exam-options.types";
import { ApiError } from "@/shared/api";

// ============================================================================
// Create Mutation
// ============================================================================

export function useCreateAcceptanceExamOption() {
    const queryClient = useQueryClient();

    return useMutation<
        AcceptanceExamOption[],
        ApiError,
        AcceptanceExamOptionCreatePayload
    >({
        mutationFn: acceptanceExamOptionsApi.create,
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: acceptanceExamOptionKeys.all,
            });
        },
    });
}

// ============================================================================
// Update Mutation
// ============================================================================

export function useUpdateAcceptanceExamOption() {
    const queryClient = useQueryClient();

    return useMutation<
        AcceptanceExamOption,
        ApiError,
        { id: string; data: AcceptanceExamOptionUpdatePayload }
    >({
        mutationFn: ({ id, data }) => acceptanceExamOptionsApi.update(id, data),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({
                queryKey: acceptanceExamOptionKeys.lists(),
            });
            queryClient.invalidateQueries({
                queryKey: acceptanceExamOptionKeys.detail(variables.id),
            });
        },
    });
}

// ============================================================================
// Delete Mutation
// ============================================================================

export function useDeleteAcceptanceExamOption() {
    const queryClient = useQueryClient();

    return useMutation<void, ApiError, string>({
        mutationFn: (id) => acceptanceExamOptionsApi.delete(id),
        onSuccess: (_, id) => {
            queryClient.invalidateQueries({
                queryKey: acceptanceExamOptionKeys.all,
            });
            queryClient.removeQueries({
                queryKey: acceptanceExamOptionKeys.detail(id),
            });
        },
    });
}
