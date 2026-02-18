/**
 * Acceptance Exam Attempts Feature - Domain Types
 *
 * Types for the Acceptance Exam Attempts domain including:
 * - AcceptanceExamAttempt entity
 * - Answer/Complete payloads
 * - Query parameters
 */

import { AcceptanceExam } from "./acceptance-exams.types";

// ============================================================================
// Entity Types
// ============================================================================

/**
 * Student reference in attempt
 */
export interface AcceptanceExamAttemptStudentRef {
    id: number;
    name: string;
    email: string;
}

/**
 * Attempt status enum
 */
export type AcceptanceExamAttemptStatus =
    | "in_progress"
    | "completed"
    | "expired";

/**
 * Acceptance Exam Attempt entity
 */
export interface AcceptanceExamAttempt {
    id: number;
    acceptanceExamId: number;
    studentId: number;
    attemptNumber: number;
    status: AcceptanceExamAttemptStatus;
    startedAt: string;
    completedAt: string | null;
    score: number | null;
    totalPoints: number | null;
    percentage: number | null;
    passed: boolean | null;
    acceptanceExam?: AcceptanceExam;
    student?: AcceptanceExamAttemptStudentRef;
    answers?: AcceptanceExamAttemptAnswer[];
    createdAt: string;
    updatedAt: string;
}

/**
 * Attempt answer entity (in result response)
 */
export interface AcceptanceExamAttemptAnswer {
    id: number;
    attemptId: number;
    questionId: number;
    selectedOptionId: number | null;
    textAnswer: string | null;
    isCorrect: boolean | null;
    pointsEarned: number | null;
}

// ============================================================================
// Payload Types
// ============================================================================

/**
 * Answer a question payload
 */
export interface AcceptanceExamAttemptAnswerPayload {
    selected_option_id?: string;
    text_answer?: string;
}

// ============================================================================
// Query Parameters
// ============================================================================

/**
 * List query parameters for attempt history
 */
export interface AcceptanceExamAttemptsListParams {
    page?: number;
}
