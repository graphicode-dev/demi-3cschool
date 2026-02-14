// ============================================================================
// Metadata Types
// ============================================================================

import { User } from "@/auth/auth.types";

/**
 * Filter definition for lesson quiz attempts metadata
 */
export interface LessonQuizAttemptFilterDefinition {
    label: string;
    type: "text" | "select" | "number" | "boolean" | "date";
    operators: string[];
    searchable: boolean;
}

/**
 * Filters map
 */
export interface LessonQuizAttemptFilters {
    [key: string]: LessonQuizAttemptFilterDefinition;
}

/**
 * Operator definitions
 */
export interface LessonQuizAttemptOperators {
    [key: string]: string;
}

/**
 * Field type definition
 */
export interface LessonQuizAttemptFieldType {
    label: string;
    component: string;
    validation: string;
}

/**
 * Field types map
 */
export interface LessonQuizAttemptFieldTypes {
    [key: string]: LessonQuizAttemptFieldType;
}

/**
 * Lesson Quiz Attempts metadata response data
 */
export interface LessonQuizAttemptsMetadata {
    filters: LessonQuizAttemptFilters;
    operators: LessonQuizAttemptOperators;
    fieldTypes: LessonQuizAttemptFieldTypes;
}

// ============================================================================
// Common Types
// ============================================================================

interface LessonQuiz {
    id: number;
    timeLimit: number;
    passingScore: number;
    maxAttempts: number;
}

// ============================================================================
// Lesson Quiz Attempt Queries Types
// ============================================================================

export interface LessonQuizAttempt {
    id: number;
    user: User;
    lessonQuiz: LessonQuiz;
    startedAt: string;
    completedAt: string;
    score: number;
    totalPoints: number;
    scorePercentage: number;
    isPassed: boolean;
    attemptNumber: number;
    status: string;
    answersCount: number;
    createdAt: string;
    updatedAt: string;
}

// ============================================================================
// Lesson Quiz Attempt Mutations Types
// ============================================================================

export interface LessonQuizAttemptsAnswer {
    lesson_quiz_question_id: number;
    selected_option_id: number;
    text_answer: string;
}

export interface LessonQuizAttemptsStore {
    lessonQuizId: number;
}
