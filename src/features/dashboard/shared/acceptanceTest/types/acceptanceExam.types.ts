import { Grade } from "@/shared/types";

// Acceptance Exam Status
export type AcceptanceExamStatus =
    | "pending"
    | "waiting"
    | "rejected"
    | "accepted";

// Acceptance Exam Question Option
export interface AcceptanceExamQuestionOption {
    id: number;
    questionId: number;
    optionText: string;
    isCorrect: boolean;
    order: number;
}

// Acceptance Exam Question
export interface AcceptanceExamQuestion {
    id: number;
    acceptanceExamId: number;
    question: string;
    type: string;
    points: number;
    order: number;
    explanation: string;
    isActive: boolean;
    options: AcceptanceExamQuestionOption[];
}

// Acceptance Exam
export interface AcceptanceExam {
    id: number;
    gradeId: number;
    grade: Grade;
    title: string;
    description: string;
    timeLimit: number;
    passingScore: number;
    maxAttempts: number;
    shuffleQuestions: boolean;
    showAnswers: boolean;
    isActive: boolean;
    questionsCount: number;
    questions: AcceptanceExamQuestion[];
}

// Acceptance Exam Attempt
export interface AcceptanceExamAttempt {
    id: number;
    acceptanceExamId: number;
    studentId: number;
    attemptNumber: number;
    status: "in_progress" | "completed";
    score?: number;
    totalPoints?: number;
    percentage?: number;
    passed?: boolean;
    startedAt: string;
    completedAt?: string;
    quiz?: AcceptanceExam;
    questions?: AcceptanceExamQuestion[];
}

// Acceptance Exam Attempt Result
export interface AcceptanceExamAttemptResult {
    id: number;
    status: "in_progress" | "completed";
    score: number;
    totalPoints: number;
    percentage: number;
    passed: boolean;
    startedAt: string;
    completedAt?: string;
}

// Submit Answer Payload
export interface AcceptanceExamSubmitAnswerPayload {
    selectedOptionId?: number;
    textAnswer?: string;
}

// Submit Answer Response
export interface AcceptanceExamSubmitAnswerResponse {
    success: boolean;
    message: string;
}

// ============================================
// Admin Types
// ============================================

// Create Exam Payload
export interface AcceptanceExamCreatePayload {
    title: string;
    description?: string;
    timeLimit: number;
    passingScore: number;
    maxAttempts?: number;
    shuffleQuestions?: boolean;
    showAnswers?: boolean;
    isActive?: boolean;
    gradeId?: number;
}

// Update Exam Payload
export interface AcceptanceExamUpdatePayload {
    title?: string;
    description?: string;
    timeLimit?: number;
    passingScore?: number;
    maxAttempts?: number;
    shuffleQuestions?: boolean;
    showAnswers?: boolean;
    isActive?: boolean;
    gradeId?: number;
}

// Question Option Payload
export interface AcceptanceExamQuestionOptionPayload {
    text: string;
    isCorrect: boolean;
}

// Create Question Payload
export interface AcceptanceExamQuestionCreatePayload {
    question: string;
    type: "single_choice" | "multiple_choice" | "true_false" | "short_answer";
    points?: number;
    order?: number;
    explanation?: string;
    options: AcceptanceExamQuestionOptionPayload[];
}

// Update Question Payload
export interface AcceptanceExamQuestionUpdatePayload {
    question?: string;
    type?: "single_choice" | "multiple_choice" | "true_false" | "short_answer";
    points?: number;
    order?: number;
    explanation?: string;
    options?: AcceptanceExamQuestionOptionPayload[];
}

// Student with Acceptance Status
export interface AcceptanceExamStudent {
    id: number;
    name: string;
    email: string;
    userInformation: {
        acceptanceExam: AcceptanceExamStatus;
        phoneNumber?: string;
    };
}

// Update Student Status Payload
export interface AcceptanceExamUpdateStudentStatusPayload {
    status: AcceptanceExamStatus;
}

// Update Student Status Response
export interface AcceptanceExamUpdateStudentStatusResponse {
    id: number;
    userId: number;
    acceptanceExam: AcceptanceExamStatus;
}
