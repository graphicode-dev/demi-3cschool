/**
 * Acceptance Exams Feature - Mutation Hooks
 *
 * TanStack Query hooks for writing acceptance exam data.
 * All mutations automatically invalidate relevant queries.
 */

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { acceptanceExamKeys } from "./acceptance-exams.keys";
import { acceptanceExamApi } from "./acceptance-exams.api";
import { AcceptanceExam } from "../../../../types";
import {
    AcceptanceExamCreatePayload,
    AcceptanceExamUpdatePayload,
} from "../../../../types/acceptance-exams.types";
import { ApiError } from "@/shared/api";

// ============================================================================
// Create Mutation
// ============================================================================

export function useCreateAcceptanceExam() {
    const queryClient = useQueryClient();

    return useMutation<AcceptanceExam, ApiError, AcceptanceExamCreatePayload>({
        mutationFn: acceptanceExamApi.create,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: acceptanceExamKeys.all });
        },
    });
}

// ============================================================================
// Update Mutation
// ============================================================================

export function useUpdateAcceptanceExam() {
    const queryClient = useQueryClient();

    return useMutation<
        AcceptanceExam,
        ApiError,
        { id: string; data: AcceptanceExamUpdatePayload }
    >({
        mutationFn: ({ id, data }) => acceptanceExamApi.update(id, data),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({
                queryKey: acceptanceExamKeys.lists(),
            });
            queryClient.invalidateQueries({
                queryKey: acceptanceExamKeys.detail(variables.id),
            });
        },
    });
}

// ============================================================================
// Delete Mutation
// ============================================================================

export function useDeleteAcceptanceExam() {
    const queryClient = useQueryClient();

    return useMutation<void, ApiError, string>({
        mutationFn: (id) => acceptanceExamApi.delete(id),
        onSuccess: (_, id) => {
            queryClient.invalidateQueries({ queryKey: acceptanceExamKeys.all });
            queryClient.removeQueries({
                queryKey: acceptanceExamKeys.detail(id),
            });
        },
    });
}
