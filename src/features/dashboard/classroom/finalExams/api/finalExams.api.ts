import { api } from "@/shared/api/client";
import type {
    FinalExam,
    FinalExamAttempt,
    FinalExamResult,
    FinalExamSubmitAnswerPayload,
    FinalExamSubmitAnswerResponse,
} from "../types";

/**
 * Final Exams API
 * Student endpoints for final exam operations
 */
export const finalExamsApi = {
    // Get all available exams for student - GET /api/final-exams
    getExams: async (): Promise<FinalExam[]> => {
        const response = await api.get<FinalExam[]>("/final-exams");
        return response.data ?? [];
    },

    // Get exam by ID - GET /api/final-exams/{id}
    getExamById: async (examId: string): Promise<FinalExam> => {
        const response = await api.get<FinalExam>(`/final-exams/${examId}`);
        return response.data!;
    },

    // Start exam - POST /api/final-exams/{examId}/start
    startExam: async (examId: string): Promise<FinalExamAttempt> => {
        const response = await api.post<FinalExamAttempt>(
            `/final-exams/${examId}/start`
        );
        return response.data!;
    },

    // Submit answer - POST /api/final-exams/attempts/{attemptId}/questions/{questionId}/answer
    submitAnswer: async (
        attemptId: string,
        questionId: string,
        data: FinalExamSubmitAnswerPayload
    ): Promise<FinalExamSubmitAnswerResponse> => {
        const response = await api.post<FinalExamSubmitAnswerResponse>(
            `/final-exams/attempts/${attemptId}/questions/${questionId}/answer`,
            data
        );
        return response.data!;
    },

    // Complete exam - POST /api/final-exams/attempts/{attemptId}/complete
    completeExam: async (attemptId: string): Promise<FinalExamResult> => {
        const response = await api.post<FinalExamResult>(
            `/final-exams/attempts/${attemptId}/complete`
        );
        return response.data!;
    },

    // Get attempt result - GET /api/final-exams/attempts/{attemptId}/result
    getAttemptResult: async (attemptId: string): Promise<FinalExamResult> => {
        const response = await api.get<FinalExamResult>(
            `/final-exams/attempts/${attemptId}/result`
        );
        return response.data!;
    },

    // Get my attempts for an exam - GET /api/final-exams/{examId}/my-attempts
    getMyAttempts: async (examId: string): Promise<FinalExamAttempt[]> => {
        const response = await api.get<FinalExamAttempt[]>(
            `/final-exams/${examId}/my-attempts`
        );
        return response.data ?? [];
    },
};
