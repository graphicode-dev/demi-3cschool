import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
    acceptanceTestStudentApi,
    acceptanceTestAdminExamsApi,
    acceptanceTestAdminQuestionsApi,
    acceptanceTestAdminStudentsApi,
} from "./acceptanceTest.api";
import { acceptanceTestKeys } from "./acceptanceTest.keys";
import type {
    AcceptanceExamSubmitAnswerPayload,
    AcceptanceExamCreatePayload,
    AcceptanceExamUpdatePayload,
    AcceptanceExamQuestionCreatePayload,
    AcceptanceExamQuestionUpdatePayload,
    AcceptanceExamUpdateStudentStatusPayload,
} from "../types";

// ============================================
// Student Queries
// ============================================

/**
 * Get student's available exam
 */
export const useStudentExam = () => {
    return useQuery({
        queryKey: acceptanceTestKeys.studentExam(),
        queryFn: () => acceptanceTestStudentApi.getStudentExam(),
    });
};

/**
 * Get exam by ID
 */
export const useExamById = (
    examId: string,
    options?: { enabled?: boolean }
) => {
    return useQuery({
        queryKey: acceptanceTestKeys.examById(examId),
        queryFn: () => acceptanceTestStudentApi.getExamById(examId),
        enabled: options?.enabled ?? !!examId,
    });
};

/**
 * Get my attempts
 */
export const useMyAttempts = () => {
    return useQuery({
        queryKey: acceptanceTestKeys.myAttempts(),
        queryFn: () => acceptanceTestStudentApi.getMyAttempts(),
    });
};

/**
 * Get attempt result
 */
export const useAttemptResult = (
    attemptId: string,
    options?: { enabled?: boolean }
) => {
    return useQuery({
        queryKey: acceptanceTestKeys.attemptResult(attemptId),
        queryFn: () => acceptanceTestStudentApi.getAttemptResult(attemptId),
        enabled: options?.enabled ?? !!attemptId,
    });
};

// ============================================
// Student Mutations
// ============================================

/**
 * Start exam mutation
 */
export const useStartExam = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (examId: string) =>
            acceptanceTestStudentApi.startExam(examId),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: acceptanceTestKeys.myAttempts(),
            });
        },
    });
};

/**
 * Submit answer mutation
 */
export const useSubmitAnswer = () => {
    return useMutation({
        mutationFn: ({
            attemptId,
            questionId,
            data,
        }: {
            attemptId: string;
            questionId: string;
            data: AcceptanceExamSubmitAnswerPayload;
        }) =>
            acceptanceTestStudentApi.submitAnswer(attemptId, questionId, data),
    });
};

/**
 * Complete exam mutation
 */
export const useCompleteExam = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (attemptId: string) =>
            acceptanceTestStudentApi.completeExam(attemptId),
        onSuccess: (_, attemptId) => {
            queryClient.invalidateQueries({
                queryKey: acceptanceTestKeys.attemptResult(attemptId),
            });
            queryClient.invalidateQueries({
                queryKey: acceptanceTestKeys.myAttempts(),
            });
        },
    });
};

// ============================================
// Admin - Exams Queries
// ============================================

/**
 * List all exams (admin)
 */
export const useAdminExamsList = (params?: {
    page?: number;
    search?: string;
}) => {
    return useQuery({
        queryKey: acceptanceTestKeys.adminExamsList(params),
        queryFn: () => acceptanceTestAdminExamsApi.list(params),
    });
};

/**
 * Get single exam (admin)
 */
export const useAdminExamDetail = (
    id: string,
    options?: { enabled?: boolean }
) => {
    return useQuery({
        queryKey: acceptanceTestKeys.adminExamDetail(id),
        queryFn: () => acceptanceTestAdminExamsApi.getOne(id),
        enabled: options?.enabled ?? !!id,
    });
};

/**
 * Get exam attempts (admin)
 */
export const useAdminExamAttempts = (
    examId: string,
    options?: { enabled?: boolean }
) => {
    return useQuery({
        queryKey: acceptanceTestKeys.adminExamAttempts(examId),
        queryFn: () => acceptanceTestAdminExamsApi.getAttempts(examId),
        enabled: options?.enabled ?? !!examId,
    });
};

// ============================================
// Admin - Exams Mutations
// ============================================

/**
 * Create exam mutation (admin)
 */
export const useAdminCreateExam = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: AcceptanceExamCreatePayload) =>
            acceptanceTestAdminExamsApi.create(data),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: acceptanceTestKeys.adminExams(),
            });
        },
    });
};

/**
 * Update exam mutation (admin)
 */
export const useAdminUpdateExam = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({
            id,
            data,
        }: {
            id: string;
            data: AcceptanceExamUpdatePayload;
        }) => acceptanceTestAdminExamsApi.update(id, data),
        onSuccess: (_, { id }) => {
            queryClient.invalidateQueries({
                queryKey: acceptanceTestKeys.adminExamDetail(id),
            });
            queryClient.invalidateQueries({
                queryKey: acceptanceTestKeys.adminExams(),
            });
        },
    });
};

/**
 * Delete exam mutation (admin)
 */
export const useAdminDeleteExam = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: string) => acceptanceTestAdminExamsApi.delete(id),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: acceptanceTestKeys.adminExams(),
            });
        },
    });
};

// ============================================
// Admin - Questions Mutations
// ============================================

/**
 * Create question mutation (admin)
 */
export const useAdminCreateQuestion = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({
            examId,
            data,
        }: {
            examId: string;
            data: AcceptanceExamQuestionCreatePayload;
        }) => acceptanceTestAdminQuestionsApi.create(examId, data),
        onSuccess: (_, { examId }) => {
            queryClient.invalidateQueries({
                queryKey: acceptanceTestKeys.adminExamDetail(examId),
            });
        },
    });
};

/**
 * Update question mutation (admin)
 */
export const useAdminUpdateQuestion = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({
            questionId,
            data,
        }: {
            questionId: string;
            data: AcceptanceExamQuestionUpdatePayload;
        }) => acceptanceTestAdminQuestionsApi.update(questionId, data),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: acceptanceTestKeys.adminQuestions(),
            });
        },
    });
};

/**
 * Delete question mutation (admin)
 */
export const useAdminDeleteQuestion = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (questionId: string) =>
            acceptanceTestAdminQuestionsApi.delete(questionId),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: acceptanceTestKeys.adminQuestions(),
            });
        },
    });
};

// ============================================
// Admin - Students Queries
// ============================================

/**
 * List students by acceptance status (admin)
 */
export const useAdminStudentsList = (params?: {
    status?: string;
    search?: string;
    page?: number;
}) => {
    return useQuery({
        queryKey: acceptanceTestKeys.adminStudentsList(params),
        queryFn: () => acceptanceTestAdminStudentsApi.list(params),
    });
};

/**
 * Get student attempt result (admin)
 */
export const useAdminStudentAttemptResult = (
    attemptId: string,
    options?: { enabled?: boolean }
) => {
    return useQuery({
        queryKey: acceptanceTestKeys.adminStudentAttemptResult(attemptId),
        queryFn: () =>
            acceptanceTestAdminStudentsApi.getAttemptResult(attemptId),
        enabled: options?.enabled ?? !!attemptId,
    });
};

// ============================================
// Admin - Students Mutations
// ============================================

/**
 * Update student acceptance status mutation (admin)
 */
export const useAdminUpdateStudentStatus = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({
            userId,
            data,
        }: {
            userId: string;
            data: AcceptanceExamUpdateStudentStatusPayload;
        }) => acceptanceTestAdminStudentsApi.updateStatus(userId, data),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: acceptanceTestKeys.adminStudents(),
            });
        },
    });
};
