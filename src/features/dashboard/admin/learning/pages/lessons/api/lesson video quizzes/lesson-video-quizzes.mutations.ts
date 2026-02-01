/**
 * Lesson Video Quizzes Feature - Mutation Hooks
 *
 * TanStack Query mutation hooks for lesson video quizzes CRUD operations.
 */

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { lessonVideoQuizKeys } from "./lesson-video-quizzes.keys";
import { lessonVideoQuizzesApi } from "./lesson-video-quizzes.api";
import {
    LessonVideoQuiz,
    LessonVideoQuizCreatePayload,
    LessonVideoQuizUpdatePayload,
} from "../../types";

/**
 * Hook to create a new lesson video quiz
 */
export function useCreateLessonVideoQuiz() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (payload: LessonVideoQuizCreatePayload) =>
            lessonVideoQuizzesApi.create(payload),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: lessonVideoQuizKeys.all,
            });
        },
    });
}

/**
 * Hook to update an existing lesson video quiz
 */
export function useUpdateLessonVideoQuiz() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({
            id,
            data,
        }: {
            id: string;
            data: LessonVideoQuizUpdatePayload;
        }) => lessonVideoQuizzesApi.update(id, data),
        onSuccess: (updatedQuiz: LessonVideoQuiz) => {
            queryClient.invalidateQueries({
                queryKey: lessonVideoQuizKeys.all,
            });
            queryClient.setQueryData(
                lessonVideoQuizKeys.detail(String(updatedQuiz.id)),
                updatedQuiz
            );
        },
    });
}

/**
 * Hook to delete a lesson video quiz
 */
export function useDeleteLessonVideoQuiz() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: string) => lessonVideoQuizzesApi.delete(id),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: lessonVideoQuizKeys.all,
            });
        },
    });
}
