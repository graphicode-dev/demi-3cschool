/**
 * Lesson Quiz Questions Feature - Domain Types
 *
 * Types for the Lesson Quiz Questions domain including:
 * - LessonQuizQuestion entity
 * - List/Detail response types
 * - Create/Update payloads
 * - Query parameters
 * - Metadata types
 */

// ============================================================================
// Entity Types
// ============================================================================

/**
 * Quiz reference in question
 */
export interface LessonQuizQuestionQuizRef {
    id: string | number;
}

/**
 * Question type enum
 */
export type LessonQuestionType =
    | "single_choice"
    | "multiple_choice"
    | "true_false"
    | "short_answer";

/**
 * Lesson Quiz Question entity
 */
export interface LessonQuizQuestion {
    id: string | number;
    quiz: LessonQuizQuestionQuizRef;
    question: string;
    type: LessonQuestionType;
    points: number;
    order: number;
    explanation: string;
    isActive: number | boolean;
    createdAt: string;
    updatedAt: string;
}

// ============================================================================
// Metadata Types
// ============================================================================

/**
 * Filter definition for lesson quiz questions metadata
 */
export interface LessonQuizQuestionFilterDefinition {
    label: string;
    type: "text" | "select" | "number" | "boolean" | "date";
    operators: string[];
    searchable: boolean;
}

/**
 * Filters map
 */
export interface LessonQuizQuestionFilters {
    [key: string]: LessonQuizQuestionFilterDefinition;
}

/**
 * Operator definitions
 */
export interface LessonQuizQuestionOperators {
    [key: string]: string;
}

/**
 * Field type definition
 */
export interface LessonQuizQuestionFieldType {
    label: string;
    component: string;
    validation: string;
}

/**
 * Field types map
 */
export interface LessonQuizQuestionFieldTypes {
    [key: string]: LessonQuizQuestionFieldType;
}

/**
 * Lesson Quiz Questions metadata response data
 */
export interface LessonQuizQuestionsMetadata {
    filters: LessonQuizQuestionFilters;
    operators: LessonQuizQuestionOperators;
    fieldTypes: LessonQuizQuestionFieldTypes;
}

// ============================================================================
// Query Parameters
// ============================================================================

/**
 * List query parameters for lesson quiz questions
 */
export interface LessonQuizQuestionsListParams {
    page?: number;
}

// ============================================================================
// Payload Types
// ============================================================================

/**
 * Create lesson quiz question payload
 */
export interface LessonQuizQuestionCreatePayload {
    quizId: string;
    question: string;
    type: LessonQuestionType;
    points: number;
    order: number;
    explanation: string;
    isActive: boolean;
}

/**
 * Update lesson quiz question payload
 */
export interface LessonQuizQuestionUpdatePayload {
    quizId?: string;
    question?: string;
    type?: LessonQuestionType;
    points?: number;
    order?: number;
    explanation?: string;
    isActive?: boolean;
}
