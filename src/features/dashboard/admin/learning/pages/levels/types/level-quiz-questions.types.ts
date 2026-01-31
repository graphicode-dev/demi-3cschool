/**
 * Level Quiz Questions Feature - Domain Types
 *
 * Types for the Level Quiz Questions domain including:
 * - LevelQuizQuestion entity
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
export interface LevelQuizQuestionQuizRef {
    id: string;
}

/**
 * Question type enum
 */
export type QuestionType =
    | "single_choice"
    | "multiple_choice"
    | "true_false"
    | "short_answer";

/**
 * Level Quiz Question entity
 */
export interface LevelQuizQuestion {
    id: string;
    quiz: LevelQuizQuestionQuizRef;
    question: string;
    type: QuestionType;
    points: number;
    order: number;
    explanation: string;
    isActive: number;
    createdAt: string;
    updatedAt: string;
}

// ============================================================================
// Metadata Types
// ============================================================================

/**
 * Filter definition for level quiz questions metadata
 */
export interface LevelQuizQuestionFilterDefinition {
    label: string;
    type: "text" | "select" | "number" | "boolean" | "date";
    operators: string[];
    searchable: boolean;
}

/**
 * Filters map
 */
export interface LevelQuizQuestionFilters {
    [key: string]: LevelQuizQuestionFilterDefinition;
}

/**
 * Operator definitions
 */
export interface LevelQuizQuestionOperators {
    [key: string]: string;
}

/**
 * Field type definition
 */
export interface LevelQuizQuestionFieldType {
    label: string;
    component: string;
    validation: string;
}

/**
 * Field types map
 */
export interface LevelQuizQuestionFieldTypes {
    [key: string]: LevelQuizQuestionFieldType;
}

/**
 * Level Quiz Questions metadata response data
 */
export interface LevelQuizQuestionsMetadata {
    filters: LevelQuizQuestionFilters;
    operators: LevelQuizQuestionOperators;
    fieldTypes: LevelQuizQuestionFieldTypes;
}

// ============================================================================
// Query Parameters
// ============================================================================

/**
 * List query parameters for level quiz questions
 */
export interface LevelQuizQuestionsListParams {
    page?: number;
}

// ============================================================================
// Payload Types
// ============================================================================

/**
 * Create level quiz question payload
 */
export interface LevelQuizQuestionCreatePayload {
    quizId: string;
    question: string;
    type: QuestionType;
    points: number;
    order: number;
    explanation: string;
    isActive: boolean;
}

/**
 * Update level quiz question payload
 */
export interface LevelQuizQuestionUpdatePayload {
    quizId?: string;
    question?: string;
    type?: QuestionType;
    points?: number;
    order?: number;
    explanation?: string;
    isActive?: boolean;
}
