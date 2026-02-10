import { api } from "@/shared/api/client";
import { ApiResponse } from "@/shared/api";
import type {
    FinalExam,
    QuizAttempt,
    QuizAnswerResponse,
    SubmitAnswerPayload,
} from "../types";

/**
 * Final Exams API
 * Student endpoints for final exam operations
 */
export const finalExamsApi = {
    /**
     * Get my final exams - GET /level-quiz-attempts/my-final-exam
     */
    getMyFinalExams: async (signal?: AbortSignal): Promise<FinalExam[]> => {
        const response = await api.get<ApiResponse<FinalExam[]>>(
            "/level-quiz-attempts/my-final-exam",
            { signal }
        );

        if (response.error) {
            throw response.error;
        }

        return response.data?.data ?? [];
    },

    /**
     * Get quiz attempts history - GET /level-quiz-attempts/quiz/:quizId/history
     */
    getAttemptsHistory: async (
        quizId: string,
        signal?: AbortSignal
    ): Promise<QuizAttempt[]> => {
        const response = await api.get<ApiResponse<QuizAttempt[]>>(
            `/level-quiz-attempts/quiz/${quizId}/history`,
            { signal }
        );

        if (response.error) {
            throw response.error;
        }

        return response.data?.data ?? [];
    },

    /**
     * Start quiz attempt - POST /level-quiz-attempts
     */
    startAttempt: async (levelQuizId: number): Promise<QuizAttempt> => {
        const response = await api.post<ApiResponse<QuizAttempt>>(
            "/level-quiz-attempts",
            { levelQuizId }
        );

        if (response.error) {
            throw response.error;
        }

        if (!response.data?.data) {
            throw new Error("No data returned from server");
        }

        return response.data.data;
    },

    /**
     * Submit answer - POST /level-quiz-attempts/:id/answer
     */
    submitAnswer: async (
        attemptId: string,
        payload: SubmitAnswerPayload
    ): Promise<QuizAnswerResponse> => {
        const response = await api.post<ApiResponse<QuizAnswerResponse>>(
            `/level-quiz-attempts/${attemptId}/answer`,
            payload
        );

        if (response.error) {
            throw response.error;
        }

        if (!response.data?.data) {
            throw new Error("No data returned from server");
        }

        return response.data.data;
    },

    /**
     * Complete quiz attempt - POST /level-quiz-attempts/:id/complete
     */
    completeAttempt: async (attemptId: string): Promise<QuizAttempt> => {
        const response = await api.post<ApiResponse<QuizAttempt>>(
            `/level-quiz-attempts/${attemptId}/complete`
        );

        if (response.error) {
            throw response.error;
        }

        if (!response.data?.data) {
            throw new Error("No data returned from server");
        }

        return response.data.data;
    },
};
