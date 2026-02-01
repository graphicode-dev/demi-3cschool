/**
 * Lesson Video Quiz Questions Feature - Domain Types
 *
 * Types for the Lesson Video Quiz Questions domain including:
 * - LessonVideoQuizQuestion entity
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
export interface LessonVideoQuizQuestionQuizRef {
    id: string | number;
}

/**
 * Question type enum
 */
export type LessonVideoQuizQuestionType =
    | "single_choice"
    | "multiple_choice"
    | "true_false"
    | "short_answer";

/**
 * Lesson Video Quiz Question entity
 */
export interface LessonVideoQuizQuestion {
    id: string | number;
    quiz: LessonVideoQuizQuestionQuizRef;
    question: string;
    type: LessonVideoQuizQuestionType;
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
 * Filter definition for lesson video quiz questions metadata
 */
export interface LessonVideoQuizQuestionFilterDefinition {
    label: string;
    type: "text" | "select" | "number" | "boolean" | "date";
    operators: string[];
    searchable: boolean;
}

/**
 * Filters map
 */
export interface LessonVideoQuizQuestionFilters {
    [key: string]: LessonVideoQuizQuestionFilterDefinition;
}

/**
 * Operator definitions
 */
export interface LessonVideoQuizQuestionOperators {
    [key: string]: string;
}

/**
 * Field type definition
 */
export interface LessonVideoQuizQuestionFieldType {
    label: string;
    component: string;
    validation: string;
}

/**
 * Field types map
 */
export interface LessonVideoQuizQuestionFieldTypes {
    [key: string]: LessonVideoQuizQuestionFieldType;
}

/**
 * Lesson Video Quiz Questions metadata response data
 */
export interface LessonVideoQuizQuestionsMetadata {
    filters: LessonVideoQuizQuestionFilters;
    operators: LessonVideoQuizQuestionOperators;
    fieldTypes: LessonVideoQuizQuestionFieldTypes;
}

// ============================================================================
// Query Parameters
// ============================================================================

/**
 * List query parameters for lesson video quiz questions
 */
export interface LessonVideoQuizQuestionsListParams {
    page?: number;
}

// ============================================================================
// Payload Types
// ============================================================================

/**
 * Create lesson video quiz question payload
 */
export interface LessonVideoQuizQuestionCreatePayload {
    quizId: string | number;
    question: string;
    type: LessonVideoQuizQuestionType;
    points: number;
    order: number;
    explanation?: string;
    isActive?: boolean | number;
}

/**
 * Update lesson video quiz question payload
 */
export interface LessonVideoQuizQuestionUpdatePayload {
    quizId?: string | number;
    question?: string;
    type?: LessonVideoQuizQuestionType;
    points?: number;
    order?: number;
    explanation?: string;
    isActive?: boolean | number;
}
