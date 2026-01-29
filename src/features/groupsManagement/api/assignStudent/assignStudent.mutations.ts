/**
 * Assign Student Management Feature - Mutation Hooks
 *
 * TanStack Query hooks for student assignment operations.
 * All mutations automatically invalidate relevant queries.
 *
 * @example
 * ```tsx
 * // Assign student to group
 * const assignMutation = useAssignStudentMutation();
 * await assignMutation.mutateAsync({ groupId: 1, payload: { student_id: 2 } });
 *
 * // Update student enrollment
 * const updateMutation = useUpdateStudentEnrollmentMutation();
 * await updateMutation.mutateAsync({ groupId: 1, studentId: 2, payload: { status: 'active' } });
 *
 * // Transfer student
 * const transferMutation = useTransferStudentMutation();
 * await transferMutation.mutateAsync({ groupId: 1, studentId: 2, payload: { newGroupId: 3 } });
 *
 * // Remove student
 * const removeMutation = useRemoveStudentMutation();
 * await removeMutation.mutateAsync({ groupId: 1, studentId: 2 });
 * ```
 */

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { assignStudentKeys } from "./assignStudent.keys";
import { assignStudentApi } from "./assignStudent.api";
import type {
    AssignStudentPayload,
    UpdateStudentEnrollmentPayload,
    TransferStudentPayload,
    GroupStudent,
} from "../../types/assignStudent.types";
import { ApiError } from "@/shared/api";

// ============================================================================
// Assign Student Mutation
// ============================================================================

/**
 * Hook for assigning a student to a group
 */
export const useAssignStudentMutation = () => {
    const queryClient = useQueryClient();

    return useMutation<
        GroupStudent,
        ApiError,
        { groupId: string; data: AssignStudentPayload }
    >({
        mutationFn: ({ groupId, data }) =>
            assignStudentApi.assignStudent(groupId, data),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({
                queryKey: assignStudentKeys.lists(),
            });
            queryClient.invalidateQueries({
                queryKey: assignStudentKeys.groupStudentsById(
                    variables.groupId
                ),
            });
        },
    });
};

// ============================================================================
// Update Student Enrollment Mutation
// ============================================================================

/**
 * Hook for updating student enrollment details
 */
export const useUpdateStudentEnrollmentMutation = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({
            groupId,
            studentId,
            payload,
        }: {
            groupId: number | string;
            studentId: number | string;
            payload: UpdateStudentEnrollmentPayload;
        }) =>
            assignStudentApi.updateStudentEnrollment(
                groupId,
                studentId,
                payload
            ),
        onSuccess: (updatedStudent, { groupId, studentId }) => {
            // Invalidate group students queries
            queryClient.invalidateQueries({
                queryKey: assignStudentKeys.groupStudentsById(groupId),
            });

            // Invalidate specific student detail if it exists
            queryClient.invalidateQueries({
                queryKey: assignStudentKeys.studentDetailById(studentId),
            });

            // Optionally invalidate all assign-student queries
            queryClient.invalidateQueries({
                queryKey: assignStudentKeys.all,
            });
        },
        onError: (error, variables) => {
            console.error("Failed to update student enrollment:", error);
            console.error("Variables:", variables);
        },
    });
};

// ============================================================================
// Transfer Student Mutation
// ============================================================================

/**
 * Hook for transferring a student to another group
 */
export const useTransferStudentMutation = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({
            groupId,
            studentId,
            payload,
        }: {
            groupId: number | string;
            studentId: number | string;
            payload: TransferStudentPayload;
        }) => assignStudentApi.transferStudent(groupId, studentId, payload),
        onSuccess: (transferredStudent, { groupId, studentId, payload }) => {
            // Invalidate current group students queries
            queryClient.invalidateQueries({
                queryKey: assignStudentKeys.groupStudentsById(groupId),
            });

            // Invalidate new group students queries
            queryClient.invalidateQueries({
                queryKey: assignStudentKeys.groupStudentsById(
                    payload.newGroupId
                ),
            });

            // Invalidate specific student detail
            queryClient.invalidateQueries({
                queryKey: assignStudentKeys.studentDetailById(studentId),
            });

            // Optionally invalidate all assign-student queries
            queryClient.invalidateQueries({
                queryKey: assignStudentKeys.all,
            });
        },
        onError: (error, variables) => {
            console.error("Failed to transfer student:", error);
            console.error("Variables:", variables);
        },
    });
};

// ============================================================================
// Remove Student Mutation
// ============================================================================

/**
 * Hook for removing a student from a group
 */
export const useRemoveStudentMutation = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({
            groupId,
            studentId,
        }: {
            groupId: number | string;
            studentId: number | string;
        }) => assignStudentApi.removeStudent(groupId, studentId),
        onSuccess: (_, { groupId, studentId }) => {
            // Invalidate group students queries to refresh the list
            queryClient.invalidateQueries({
                queryKey: assignStudentKeys.groupStudentsById(groupId),
            });

            // Invalidate specific student detail
            queryClient.invalidateQueries({
                queryKey: assignStudentKeys.studentDetailById(studentId),
            });

            // Optionally invalidate all assign-student queries
            queryClient.invalidateQueries({
                queryKey: assignStudentKeys.all,
            });
        },
        onError: (error, variables) => {
            console.error("Failed to remove student:", error);
            console.error("Variables:", variables);
        },
    });
};

// ============================================================================
// Optimistic Update Hooks
// ============================================================================

/**
 * Hook for assigning student with optimistic updates
 */
export const useAssignStudentWithOptimism = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({
            groupId,
            payload,
        }: {
            groupId: number | string;
            payload: AssignStudentPayload;
        }) => assignStudentApi.assignStudent(groupId, payload),
        onMutate: async ({ groupId, payload }) => {
            // Cancel any outgoing refetches
            await queryClient.cancelQueries({
                queryKey: assignStudentKeys.groupStudentsById(groupId),
            });

            // Snapshot the previous value
            const previousStudents = queryClient.getQueryData<GroupStudent[]>(
                assignStudentKeys.groupStudentsById(groupId)
            );

            // Optimistically update to the new value
            const optimisticStudent: GroupStudent = {
                id: Date.now().toString(), // Temporary ID
                enrolledAt: new Date().toISOString().split("T")[0],
                leftAt: null,
                status: "active",
                note: payload.note || "",
                student: {
                    id: payload.student_id,
                    name: "Loading...", // Will be updated with actual data
                },
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
            };

            queryClient.setQueryData(
                assignStudentKeys.groupStudentsById(groupId),
                (old: GroupStudent[] | undefined) =>
                    old ? [...old, optimisticStudent] : [optimisticStudent]
            );

            // Return context with the snapshotted value
            return { previousStudents, groupId };
        },
        onError: (err, variables, context) => {
            // If the mutation fails, use the context returned from onMutate to roll back
            if (context?.previousStudents) {
                queryClient.setQueryData(
                    assignStudentKeys.groupStudentsById(context.groupId),
                    context.previousStudents
                );
            }
        },
        onSettled: (_, __, ___, context) => {
            // Always refetch after error or success
            if (context) {
                queryClient.invalidateQueries({
                    queryKey: assignStudentKeys.groupStudentsById(
                        context.groupId
                    ),
                });
            }
        },
    });
};

/**
 * Hook for batch student operations
 */
export const useBatchStudentAssignmentMutation = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({
            groupId,
            operations,
        }: {
            groupId: number | string;
            operations: Array<{
                type: "assign" | "remove" | "update";
                studentId?: number | string;
                payload?: AssignStudentPayload | UpdateStudentEnrollmentPayload;
            }>;
        }) => {
            const results = await Promise.allSettled(
                operations.map(async (operation) => {
                    switch (operation.type) {
                        case "assign":
                            if (!operation.payload)
                                throw new Error(
                                    "Payload required for assign operation"
                                );
                            return assignStudentApi.assignStudent(
                                groupId,
                                operation.payload as AssignStudentPayload
                            );
                        case "remove":
                            if (!operation.studentId)
                                throw new Error(
                                    "Student ID required for remove operation"
                                );
                            return assignStudentApi.removeStudent(
                                groupId,
                                operation.studentId
                            );
                        case "update":
                            if (!operation.studentId || !operation.payload)
                                throw new Error(
                                    "Student ID and payload required for update operation"
                                );
                            return assignStudentApi.updateStudentEnrollment(
                                groupId,
                                operation.studentId,
                                operation.payload as UpdateStudentEnrollmentPayload
                            );
                        default:
                            throw new Error(
                                `Unknown operation type: ${operation.type}`
                            );
                    }
                })
            );

            return results;
        },
        onSuccess: (_, { groupId }) => {
            // Invalidate all relevant queries after batch operation
            queryClient.invalidateQueries({
                queryKey: assignStudentKeys.groupStudentsById(groupId),
            });
            queryClient.invalidateQueries({
                queryKey: assignStudentKeys.all,
            });
        },
        onError: (error, variables) => {
            console.error("Failed to perform batch student operations:", error);
            console.error("Variables:", variables);
        },
    });
};
