import { api } from "@/shared/api/client";
import type {
    AcceptanceExam,
    AcceptanceExamAttempt,
    AcceptanceExamAttemptResult,
    AcceptanceExamSubmitAnswerPayload,
    AcceptanceExamSubmitAnswerResponse,
    AcceptanceExamCreatePayload,
    AcceptanceExamUpdatePayload,
    AcceptanceExamQuestion,
    AcceptanceExamQuestionCreatePayload,
    AcceptanceExamQuestionUpdatePayload,
    AcceptanceExamStudent,
    AcceptanceExamUpdateStudentStatusPayload,
    AcceptanceExamUpdateStudentStatusResponse,
} from "../types";

// ============================================
// Student API
// ============================================
export const acceptanceTestStudentApi = {
    // Get student's available exam - GET /api/acceptance-exams/my-exam
    getStudentExam: async () => {
        const response = await api.get<AcceptanceExam>(
            "/acceptance-exams/my-exam"
        );
        return response.data;
    },

    // Get exam by ID - GET /api/acceptance-exams/{id}
    getExamById: async (examId: string) => {
        const response = await api.get<AcceptanceExam>(
            `/acceptance-exams/${examId}`
        );
        return response.data;
    },

    // Start exam - POST /api/acceptance-exams/{examId}/start
    startExam: async (examId: string) => {
        const response = await api.post<AcceptanceExamAttempt>(
            `/acceptance-exams/${examId}/start`
        );
        return response.data;
    },

    // Submit answer - POST /api/acceptance-exams/attempts/{attemptId}/questions/{questionId}/answer
    submitAnswer: async (
        attemptId: string,
        questionId: string,
        data: AcceptanceExamSubmitAnswerPayload
    ) => {
        const response = await api.post<AcceptanceExamSubmitAnswerResponse>(
            `/acceptance-exams/attempts/${attemptId}/questions/${questionId}/answer`,
            data
        );
        return response.data;
    },

    // Complete exam - POST /api/acceptance-exams/attempts/{attemptId}/complete
    completeExam: async (attemptId: string) => {
        const response = await api.post<AcceptanceExamAttemptResult>(
            `/acceptance-exams/attempts/${attemptId}/complete`
        );
        return response.data;
    },

    // Get attempt result - GET /api/acceptance-exams/attempts/{attemptId}/result
    getAttemptResult: async (attemptId: string) => {
        const response = await api.get<AcceptanceExamAttemptResult>(
            `/acceptance-exams/attempts/${attemptId}/result`
        );
        return response.data;
    },

    // Get my attempts - GET /api/acceptance-exams/my-attempts
    getMyAttempts: async () => {
        const response = await api.get<AcceptanceExamAttempt[]>(
            `/acceptance-exams/my-attempts`
        );
        return response.data;
    },
};

// ============================================
// Admin API - Exam Management
// ============================================
export const acceptanceTestAdminExamsApi = {
    // List all exams - GET /api/acceptance-exams
    list: async (params?: { page?: number; search?: string }) => {
        const response = await api.get<AcceptanceExam[]>("/acceptance-exams", {
            params,
        });
        return response.data;
    },

    // Get single exam - GET /api/acceptance-exams/{id}
    getOne: async (id: string) => {
        const response = await api.get<AcceptanceExam>(
            `/acceptance-exams/${id}`
        );
        return response.data;
    },

    // Create exam - POST /api/acceptance-exams
    create: async (data: AcceptanceExamCreatePayload) => {
        const response = await api.post<AcceptanceExam>(
            "/acceptance-exams",
            data
        );
        return response.data;
    },

    // Update exam - PUT /api/acceptance-exams/{id}
    update: async (id: string, data: AcceptanceExamUpdatePayload) => {
        const response = await api.put<AcceptanceExam>(
            `/acceptance-exams/${id}`,
            data
        );
        return response.data;
    },

    // Delete exam - DELETE /api/acceptance-exams/{id}
    delete: async (id: string) => {
        const response = await api.delete(`/acceptance-exams/${id}`);
        return response.data;
    },

    // Get all attempts for an exam - GET /api/acceptance-exams/{examId}/attempts
    getAttempts: async (examId: string) => {
        const response = await api.get<AcceptanceExamAttempt[]>(
            `/acceptance-exams/${examId}/attempts`
        );
        return response.data;
    },
};

// ============================================
// Admin API - Question Management
// ============================================
export const acceptanceTestAdminQuestionsApi = {
    // Add question to exam - POST /api/acceptance-exams/{examId}/questions
    create: async (
        examId: string,
        data: AcceptanceExamQuestionCreatePayload
    ) => {
        const response = await api.post<AcceptanceExamQuestion>(
            `/acceptance-exams/${examId}/questions`,
            data
        );
        return response.data;
    },

    // Update question - PUT /api/acceptance-exams/questions/{questionId}
    update: async (
        questionId: string,
        data: AcceptanceExamQuestionUpdatePayload
    ) => {
        const response = await api.put<AcceptanceExamQuestion>(
            `/acceptance-exams/questions/${questionId}`,
            data
        );
        return response.data;
    },

    // Delete question - DELETE /api/acceptance-exams/questions/{questionId}
    delete: async (questionId: string) => {
        const response = await api.delete(
            `/acceptance-exams/questions/${questionId}`
        );
        return response.data;
    },
};

// ============================================
// Admin API - Student Status Management
// ============================================
export const acceptanceTestAdminStudentsApi = {
    // Get students by acceptance status - GET /api/acceptance-exams/students
    list: async (params?: {
        status?: string;
        search?: string;
        page?: number;
    }) => {
        const response = await api.get<AcceptanceExamStudent[]>(
            "/acceptance-exams/students",
            { params }
        );
        return response.data;
    },

    // Update student acceptance status - PUT /api/acceptance-exams/students/{userId}/status
    updateStatus: async (
        userId: string,
        data: AcceptanceExamUpdateStudentStatusPayload
    ) => {
        const response =
            await api.put<AcceptanceExamUpdateStudentStatusResponse>(
                `/acceptance-exams/students/${userId}/status`,
                data
            );
        return response.data;
    },

    // Get attempt result - GET /api/acceptance-exams/attempts/{attemptId}/result
    getAttemptResult: async (attemptId: string) => {
        const response = await api.get<AcceptanceExamAttemptResult>(
            `/acceptance-exams/attempts/${attemptId}/result`
        );
        return response.data;
    },
};
