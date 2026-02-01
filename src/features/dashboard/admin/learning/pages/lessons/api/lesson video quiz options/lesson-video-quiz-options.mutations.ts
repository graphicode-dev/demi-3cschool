/**
 * Lesson Video Quiz Options Feature - Mutation Hooks
 *
 * TanStack Query mutation hooks for lesson video quiz options CRUD operations.
 */

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { lessonVideoQuizOptionKeys } from "./lesson-video-quiz-options.keys";
import { lessonVideoQuizOptionsApi } from "./lesson-video-quiz-options.api";
import {
    LessonVideoQuizOption,
    LessonVideoQuizOptionCreatePayload,
    LessonVideoQuizOptionUpdatePayload,
} from "../../types";

/**
 * Hook to create a new lesson video quiz option
 */
export function useCreateLessonVideoQuizOption() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (payload: LessonVideoQuizOptionCreatePayload) =>
            lessonVideoQuizOptionsApi.create(payload),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: lessonVideoQuizOptionKeys.all,
            });
        },
    });
}

/**
 * Hook to update an existing lesson video quiz option
 */
export function useUpdateLessonVideoQuizOption() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({
            id,
            data,
        }: {
            id: string;
            data: LessonVideoQuizOptionUpdatePayload;
        }) => lessonVideoQuizOptionsApi.update(id, data),
        onSuccess: (updatedOption: LessonVideoQuizOption) => {
            queryClient.invalidateQueries({
                queryKey: lessonVideoQuizOptionKeys.all,
            });
            queryClient.setQueryData(
                lessonVideoQuizOptionKeys.detail(String(updatedOption.id)),
                updatedOption
            );
        },
    });
}

/**
 * Hook to delete a lesson video quiz option
 */
export function useDeleteLessonVideoQuizOption() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: string) => lessonVideoQuizOptionsApi.delete(id),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: lessonVideoQuizOptionKeys.all,
            });
        },
    });
}
