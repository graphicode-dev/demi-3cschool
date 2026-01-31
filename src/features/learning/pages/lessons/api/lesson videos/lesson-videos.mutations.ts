/**
 * Lesson Videos Feature - Mutation Hooks
 *
 * TanStack Query hooks for writing lesson video data.
 * All mutations automatically invalidate relevant queries.
 *
 * @example
 * ```tsx
 * // Create lesson video
 * const createMutation = useCreateLessonVideo();
 * await createMutation.mutateAsync(payload);
 *
 * // Update lesson video
 * const updateMutation = useUpdateLessonVideo();
 * await updateMutation.mutateAsync({ id: videoId, data: payload });
 *
 * // Delete lesson video
 * const deleteMutation = useDeleteLessonVideo();
 * await deleteMutation.mutateAsync(videoId);
 * ```
 */

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { lessonVideoKeys } from "./lesson-videos.keys";
import { lessonVideosApi } from "./lesson-videos.api";
import { LessonVideo, LessonVideoCreatePayload, LessonVideoUpdatePayload } from "../../types";
import { ApiError } from "@/shared/api";

// ============================================================================
// Create Mutation
// ============================================================================

/**
 * Hook to create a new lesson video
 *
 * @example
 * ```tsx
 * const { mutate, mutateAsync, isPending, error } = useCreateLessonVideo();
 *
 * const handleSubmit = async (data: LessonVideoCreatePayload) => {
 *     try {
 *         const video = await mutateAsync(data);
 *         toast.success('Lesson video created successfully');
 *     } catch (error) {
 *         // Error toast shown automatically by global handler
 *     }
 * };
 * ```
 */
export function useCreateLessonVideo() {
    const queryClient = useQueryClient();

    return useMutation<LessonVideo, ApiError, LessonVideoCreatePayload>({
        mutationFn: lessonVideosApi.create,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: lessonVideoKeys.all });
        },
    });
}

// ============================================================================
// Update Mutation
// ============================================================================

/**
 * Hook to update an existing lesson video
 *
 * @example
 * ```tsx
 * const { mutate, isPending } = useUpdateLessonVideo();
 *
 * const handleUpdate = (data: LessonVideoUpdatePayload) => {
 *     mutate(
 *         { id: videoId, data },
 *         {
 *             onSuccess: () => {
 *                 toast.success('Lesson video updated');
 *             },
 *         }
 *     );
 * };
 * ```
 */
export function useUpdateLessonVideo() {
    const queryClient = useQueryClient();

    return useMutation<
        LessonVideo,
        ApiError,
        { id: string; data: LessonVideoUpdatePayload }
    >({
        mutationFn: ({ id, data }) => lessonVideosApi.update(id, data),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({
                queryKey: lessonVideoKeys.lists(),
            });
            queryClient.invalidateQueries({
                queryKey: lessonVideoKeys.detail(variables.id),
            });
        },
    });
}

// ============================================================================
// Delete Mutation
// ============================================================================

/**
 * Hook to delete a lesson video
 *
 * @example
 * ```tsx
 * const { mutate, isPending } = useDeleteLessonVideo();
 *
 * const handleDelete = () => {
 *     if (confirm('Are you sure?')) {
 *         mutate(videoId, {
 *             onSuccess: () => {
 *                 toast.success('Lesson video deleted');
 *             },
 *         });
 *     }
 * };
 * ```
 */
export function useDeleteLessonVideo() {
    const queryClient = useQueryClient();

    return useMutation<void, ApiError, string>({
        mutationFn: (id) => lessonVideosApi.delete(id),
        onSuccess: (_, id) => {
            queryClient.invalidateQueries({ queryKey: lessonVideoKeys.all });
            queryClient.removeQueries({ queryKey: lessonVideoKeys.detail(id) });
        },
    });
}
