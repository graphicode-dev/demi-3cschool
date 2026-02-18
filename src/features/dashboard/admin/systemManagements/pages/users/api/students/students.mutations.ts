/**
 * Students Feature - Mutation Hooks
 *
 * TanStack Query mutation hooks for modifying students data.
 *
 * @example
 * ```tsx
 * // Create a new student
 * const { mutate: create } = useCreateStudent();
 * create({ name: "ahmed", email: "ahmed@gmail.com", password: "password" });
 *
 * // Update a student
 * const { mutate: update } = useUpdateStudent();
 * update({ id: 5, payload: { name: "Updated" } });
 *
 * // Delete a student
 * const { mutate: remove } = useDeleteStudent();
 * remove(studentId);
 * ```
 */

import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { Student, CreateStudentPayload, UpdateStudentPayload } from "./types";
import { studentKeys } from "./students.keys";
import { studentsApi } from "./students.api";

// ============================================================================
// Create Student
// ============================================================================

/**
 * Hook to create a new student
 *
 * @example
 * ```tsx
 * const { mutate, isPending } = useCreateStudent();
 * mutate({ name: "ahmed", email: "ahmed@gmail.com", password: "password" });
 * ```
 */
export function useCreateStudent() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (payload: CreateStudentPayload) =>
            studentsApi.create(payload),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: studentKeys.lists(),
            });
        },
    });
}

// ============================================================================
// Update Student
// ============================================================================

/**
 * Hook to update an existing student
 *
 * @example
 * ```tsx
 * const { mutate, isPending } = useUpdateStudent();
 * mutate({ id: 5, payload: { name: "Updated" } });
 * ```
 */
export function useUpdateStudent() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, payload }: { id: number; payload: UpdateStudentPayload }) =>
            studentsApi.update(id, payload),
        onSuccess: (data: Student) => {
            queryClient.invalidateQueries({
                queryKey: studentKeys.lists(),
            });
            queryClient.invalidateQueries({
                queryKey: studentKeys.detail(data.id),
            });
        },
    });
}

// ============================================================================
// Delete Student
// ============================================================================

/**
 * Hook to delete a student
 *
 * @example
 * ```tsx
 * const { mutate, isPending } = useDeleteStudent();
 * mutate(studentId);
 * ```
 */
export function useDeleteStudent() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: number) =>
            studentsApi.delete(id),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: studentKeys.lists(),
            });
        },
    });
}
