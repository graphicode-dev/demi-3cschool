import {
    useQuery,
    useMutation,
    useQueryClient,
    type UseQueryOptions,
} from "@tanstack/react-query";
import { assignmentSubmissionsApi } from "./assignmentSubmissions.api";
import { assignmentSubmissionsKeys } from "./assignmentSubmissions.keys";
import type {
    AssignmentGroup,
    AssignmentSubmission,
    ReviewAssignmentPayload,
} from "./assignmentSubmissions.types";

// ============================================
// Assignment Groups Query
// ============================================

/**
 * Get assignment groups (optionally filtered by lesson)
 * @param lessonId - Optional lesson ID to filter by
 * @param options - Additional query options
 */
export const useAssignmentGroups = (
    lessonId?: number | string,
    options?: Partial<UseQueryOptions<AssignmentGroup[], Error>>
) => {
    return useQuery({
        queryKey: assignmentSubmissionsKeys.groups(lessonId),
        queryFn: ({ signal }) =>
            assignmentSubmissionsApi.getAssignmentGroups(lessonId, signal),
        ...options,
    });
};

// ============================================
// Submit Assignment Mutation
// ============================================

/**
 * Submit an assignment
 */
export const useSubmitAssignment = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({
            assignmentId,
            student_notes,
            files,
        }: {
            assignmentId: number | string;
            student_notes: string;
            files: File[];
        }) =>
            assignmentSubmissionsApi.submitAssignment(assignmentId, {
                student_notes,
                files,
            }),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: assignmentSubmissionsKeys.all,
            });
        },
    });
};

// ============================================
// Review Assignment Mutation
// ============================================

/**
 * Review an assignment submission
 */
export const useReviewAssignment = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({
            assignmentId,
            payload,
        }: {
            assignmentId: number | string;
            payload: ReviewAssignmentPayload;
        }) => assignmentSubmissionsApi.reviewAssignment(assignmentId, payload),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: assignmentSubmissionsKeys.all,
            });
        },
    });
};
