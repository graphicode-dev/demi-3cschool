/**
 * Lesson Quiz Attempts Feature - Mutation Hooks
 *
 * TanStack Query hooks for writing lesson quiz attempt data.
 * All mutations automatically invalidate relevant queries.
 *
 * @example
 * ```tsx
 * // Start lesson quiz attempt
 * const attemptMutation = useStartLessonQuizAttempt();
 * await attemptMutation.mutateAsync(payload);
 *
 * // Answer lesson quiz attempt
 * const answerMutation = useAnswerLessonQuizAttempt();
 * await answerMutation.mutateAsync({ id: attemptId, data: payload });
 *
 * // Complete lesson quiz attempt
 * const completeMutation = useCompleteLessonQuizAttempt();
 * await completeMutation.mutateAsync(attemptId);
 * ```
 */

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { lessonQuizAttemptKeys } from "./lesson-quiz-attempts.keys";
import { lessonQuizAttemptsApi } from "./lesson-quiz-attempts.api";
import {
    LessonQuizAttempt,
    LessonQuizAttemptsAnswer,
    LessonQuizAttemptsStore,
} from "../../types";
import { ApiError } from "@/shared/api";

// ============================================================================
// Start Quiz Attempt Mutation
// ============================================================================

/**
 * Hook to start a new lesson quiz attempt
 *
 * @example
 * ```tsx
 * const { mutate, mutateAsync, isPending, error } = useStartLessonQuizAttempt();
 *
 * const handleStartQuiz = async (data: LessonQuizAttemptsStore) => {
 *     try {
 *         const attempt = await mutateAsync(data);
 *         toast.success('Quiz attempt started successfully');
 *     } catch (error) {
 *         // Error toast shown automatically by global handler
 *     }
 * };
 * ```
 */
export function useStartLessonQuizAttempt() {
    const queryClient = useQueryClient();

    return useMutation<LessonQuizAttempt, ApiError, LessonQuizAttemptsStore>({
        mutationFn: lessonQuizAttemptsApi.attempt,
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: lessonQuizAttemptKeys.all,
            });
        },
    });
}

// ============================================================================
// Answer Quiz Attempt Mutation
// ============================================================================

/**
 * Hook to answer a lesson quiz attempt
 *
 * @example
 * ```tsx
 * const { mutate, isPending } = useAnswerLessonQuizAttempt();
 *
 * const handleAnswer = (data: LessonQuizAttemptsAnswer) => {
 *     mutate(
 *         { id: attemptId, data },
 *         {
 *             onSuccess: () => {
 *                 toast.success('Answer submitted successfully');
 *             },
 *         }
 *     );
 * };
 * ```
 */
export function useAnswerLessonQuizAttempt() {
    const queryClient = useQueryClient();

    return useMutation<
        LessonQuizAttempt,
        ApiError,
        { id: string; data: LessonQuizAttemptsAnswer }
    >({
        mutationFn: ({ id, data }) => lessonQuizAttemptsApi.answer(data, id),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({
                queryKey: lessonQuizAttemptKeys.lists(),
            });
            queryClient.invalidateQueries({
                queryKey: lessonQuizAttemptKeys.detail(variables.id),
            });
        },
    });
}

// ============================================================================
// Complete Quiz Attempt Mutation
// ============================================================================

/**
 * Hook to complete a lesson quiz attempt
 *
 * @example
 * ```tsx
 * const { mutate, isPending } = useCompleteLessonQuizAttempt();
 *
 * const handleComplete = (attemptId: string) => {
 *     mutate(attemptId, {
 *         onSuccess: () => {
 *             toast.success('Quiz completed successfully');
 *         },
 *     });
 * };
 * ```
 */
export function useCompleteLessonQuizAttempt() {
    const queryClient = useQueryClient();

    return useMutation<LessonQuizAttempt, ApiError, string>({
        mutationFn: lessonQuizAttemptsApi.complete,
        onSuccess: (_, id) => {
            queryClient.invalidateQueries({
                queryKey: lessonQuizAttemptKeys.all,
            });
            queryClient.invalidateQueries({
                queryKey: lessonQuizAttemptKeys.detail(id),
            });
        },
    });
}
