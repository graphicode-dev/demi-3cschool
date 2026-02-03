import { useMutation, useQueryClient } from "@tanstack/react-query";
import { enrollmentsGroupKeys } from "./enrollmentsGroup.keys";
import { enrollmentsGroupApi } from "./enrollmentsGroup.api";
import type { EnrollVariables } from "../types";

// ============================================================================
// Enroll Mutation
// ============================================================================

/**
 * Hook to enroll in a group
 */
export const useEnrollMutation = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ groupId, programId }: EnrollVariables) =>
            enrollmentsGroupApi.enroll(groupId, programId),
        onSuccess: () => {
            // Invalidate all enrollment group queries to refetch data
            queryClient.invalidateQueries({
                queryKey: enrollmentsGroupKeys.all,
            });
        },
    });
};

