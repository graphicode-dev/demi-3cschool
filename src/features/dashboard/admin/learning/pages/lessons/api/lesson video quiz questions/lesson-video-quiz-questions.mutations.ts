/**
 * Lesson Video Quiz Questions Feature - Mutation Hooks
 *
 * TanStack Query mutation hooks for lesson video quiz questions CRUD operations.
 */

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { lessonVideoQuizQuestionKeys } from "./lesson-video-quiz-questions.keys";
import { lessonVideoQuizQuestionsApi } from "./lesson-video-quiz-questions.api";
import {
    LessonVideoQuizQuestion,
    LessonVideoQuizQuestionCreatePayload,
    LessonVideoQuizQuestionUpdatePayload,
} from "../../types";

/**
 * Hook to create a new lesson video quiz question
 */
export function useCreateLessonVideoQuizQuestion() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (payload: LessonVideoQuizQuestionCreatePayload) =>
            lessonVideoQuizQuestionsApi.create(payload),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: lessonVideoQuizQuestionKeys.all,
            });
        },
    });
}

/**
 * Hook to update an existing lesson video quiz question
 */
export function useUpdateLessonVideoQuizQuestion() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({
            id,
            data,
        }: {
            id: string;
            data: LessonVideoQuizQuestionUpdatePayload;
        }) => lessonVideoQuizQuestionsApi.update(id, data),
        onSuccess: (updatedQuestion: LessonVideoQuizQuestion) => {
            queryClient.invalidateQueries({
                queryKey: lessonVideoQuizQuestionKeys.all,
            });
            queryClient.setQueryData(
                lessonVideoQuizQuestionKeys.detail(String(updatedQuestion.id)),
                updatedQuestion
            );
        },
    });
}

/**
 * Hook to delete a lesson video quiz question
 */
export function useDeleteLessonVideoQuizQuestion() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: string) => lessonVideoQuizQuestionsApi.delete(id),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: lessonVideoQuizQuestionKeys.all,
            });
        },
    });
}
