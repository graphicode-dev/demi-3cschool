import {
    useQuery,
    useMutation,
    useQueryClient,
    type UseQueryOptions,
    type UseMutationOptions,
} from "@tanstack/react-query";
import { finalExamsApi } from "./finalExams.api";
import { finalExamsKeys } from "./finalExams.keys";
import type {
    FinalExam,
    QuizAttempt,
    QuizAnswerResponse,
    SubmitAnswerPayload,
} from "../types";

/**
 * Hook to fetch my final exams
 */
export function useMyFinalExams(
    options?: Omit<UseQueryOptions<FinalExam[], Error>, "queryKey" | "queryFn">
) {
    return useQuery({
        queryKey: finalExamsKeys.myFinalExams(),
        queryFn: ({ signal }) => finalExamsApi.getMyFinalExams(signal),
        ...options,
    });
}

/**
 * Hook to fetch attempts history for a quiz
 */
export function useAttemptsHistory(
    quizId: string,
    options?: Omit<
        UseQueryOptions<QuizAttempt[], Error>,
        "queryKey" | "queryFn"
    >
) {
    return useQuery({
        queryKey: finalExamsKeys.attemptsHistory(quizId),
        queryFn: ({ signal }) =>
            finalExamsApi.getAttemptsHistory(quizId, signal),
        enabled: !!quizId,
        ...options,
    });
}

/**
 * Hook to start a quiz attempt
 */
export function useStartAttempt(
    options?: Omit<UseMutationOptions<QuizAttempt, Error, number>, "mutationFn">
) {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (levelQuizId: number) =>
            finalExamsApi.startAttempt(levelQuizId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: finalExamsKeys.all });
        },
        ...options,
    });
}

/**
 * Hook to submit an answer
 */
export function useSubmitAnswer(
    options?: Omit<
        UseMutationOptions<
            QuizAnswerResponse,
            Error,
            { attemptId: string; payload: SubmitAnswerPayload }
        >,
        "mutationFn"
    >
) {
    return useMutation({
        mutationFn: ({ attemptId, payload }) =>
            finalExamsApi.submitAnswer(attemptId, payload),
        ...options,
    });
}

/**
 * Hook to complete a quiz attempt
 */
export function useCompleteAttempt(
    options?: Omit<UseMutationOptions<QuizAttempt, Error, string>, "mutationFn">
) {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (attemptId: string) =>
            finalExamsApi.completeAttempt(attemptId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: finalExamsKeys.all });
        },
        ...options,
    });
}
