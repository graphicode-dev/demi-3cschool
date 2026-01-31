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
    FinalExamAttempt,
    FinalExamResult,
    FinalExamSubmitAnswerPayload,
    FinalExamSubmitAnswerResponse,
} from "../types";

/**
 * Hook to fetch all available exams
 */
export function useExams(
    options?: Omit<UseQueryOptions<FinalExam[], Error>, "queryKey" | "queryFn">
) {
    return useQuery({
        queryKey: finalExamsKeys.lists(),
        queryFn: () => finalExamsApi.getExams(),
        ...options,
    });
}

/**
 * Hook to fetch a single exam by ID
 */
export function useExam(
    examId: string,
    options?: Omit<UseQueryOptions<FinalExam, Error>, "queryKey" | "queryFn">
) {
    return useQuery({
        queryKey: finalExamsKeys.detail(examId),
        queryFn: () => finalExamsApi.getExamById(examId),
        enabled: !!examId,
        ...options,
    });
}

/**
 * Hook to fetch attempt result
 */
export function useAttemptResult(
    attemptId: string,
    options?: Omit<
        UseQueryOptions<FinalExamResult, Error>,
        "queryKey" | "queryFn"
    >
) {
    return useQuery({
        queryKey: finalExamsKeys.result(attemptId),
        queryFn: () => finalExamsApi.getAttemptResult(attemptId),
        enabled: !!attemptId,
        ...options,
    });
}

/**
 * Hook to fetch my attempts for an exam
 */
export function useMyAttempts(
    examId: string,
    options?: Omit<
        UseQueryOptions<FinalExamAttempt[], Error>,
        "queryKey" | "queryFn"
    >
) {
    return useQuery({
        queryKey: finalExamsKeys.myAttempts(examId),
        queryFn: () => finalExamsApi.getMyAttempts(examId),
        enabled: !!examId,
        ...options,
    });
}

/**
 * Hook to start an exam
 */
export function useStartExam(
    options?: Omit<
        UseMutationOptions<FinalExamAttempt, Error, string>,
        "mutationFn"
    >
) {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (examId: string) => finalExamsApi.startExam(examId),
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
            FinalExamSubmitAnswerResponse,
            Error,
            {
                attemptId: string;
                questionId: string;
                data: FinalExamSubmitAnswerPayload;
            }
        >,
        "mutationFn"
    >
) {
    return useMutation({
        mutationFn: ({
            attemptId,
            questionId,
            data,
        }: {
            attemptId: string;
            questionId: string;
            data: FinalExamSubmitAnswerPayload;
        }) => finalExamsApi.submitAnswer(attemptId, questionId, data),
        ...options,
    });
}

/**
 * Hook to complete an exam
 */
export function useCompleteExam(
    options?: Omit<
        UseMutationOptions<FinalExamResult, Error, string>,
        "mutationFn"
    >
) {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (attemptId: string) =>
            finalExamsApi.completeExam(attemptId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: finalExamsKeys.all });
        },
        ...options,
    });
}
