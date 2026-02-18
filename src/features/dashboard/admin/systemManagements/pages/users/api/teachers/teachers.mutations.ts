/**
 * Teachers Feature - Mutation Hooks
 *
 * TanStack Query mutation hooks for modifying teachers data.
 *
 * @example
 * ```tsx
 * // Create a new teacher
 * const { mutate: create } = useCreateTeacher();
 * create({ name: "Test", email: "test@example.com", password: "password" });
 *
 * // Update a teacher
 * const { mutate: update } = useUpdateTeacher();
 * update({ id: 6, payload: { name: "Updated" } });
 *
 * // Delete a teacher
 * const { mutate: remove } = useDeleteTeacher();
 * remove(teacherId);
 * ```
 */

import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { Teacher, CreateTeacherPayload, UpdateTeacherPayload } from "./types";
import { teacherKeys } from "./teachers.keys";
import { teachersApi } from "./teachers.api";

// ============================================================================
// Create Teacher
// ============================================================================

/**
 * Hook to create a new teacher
 *
 * @example
 * ```tsx
 * const { mutate, isPending } = useCreateTeacher();
 * mutate({ name: "Test", email: "test@example.com", password: "password" });
 * ```
 */
export function useCreateTeacher() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (payload: CreateTeacherPayload) =>
            teachersApi.create(payload),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: teacherKeys.lists(),
            });
        },
    });
}

// ============================================================================
// Update Teacher
// ============================================================================

/**
 * Hook to update an existing teacher
 *
 * @example
 * ```tsx
 * const { mutate, isPending } = useUpdateTeacher();
 * mutate({ id: 6, payload: { name: "Updated" } });
 * ```
 */
export function useUpdateTeacher() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, payload }: { id: number; payload: UpdateTeacherPayload }) =>
            teachersApi.update(id, payload),
        onSuccess: (data: Teacher) => {
            queryClient.invalidateQueries({
                queryKey: teacherKeys.lists(),
            });
            queryClient.invalidateQueries({
                queryKey: teacherKeys.detail(data.id),
            });
        },
    });
}

// ============================================================================
// Delete Teacher
// ============================================================================

/**
 * Hook to delete a teacher
 *
 * @example
 * ```tsx
 * const { mutate, isPending } = useDeleteTeacher();
 * mutate(teacherId);
 * ```
 */
export function useDeleteTeacher() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: number) =>
            teachersApi.delete(id),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: teacherKeys.lists(),
            });
        },
    });
}
