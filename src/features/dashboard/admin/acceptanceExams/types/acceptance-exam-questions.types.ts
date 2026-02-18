/**
 * Acceptance Exam Questions Feature - Domain Types
 *
 * Types for the Acceptance Exam Questions domain including:
 * - AcceptanceExamQuestion entity
 * - List/Detail response types
 * - Create/Update payloads
 * - Query parameters
 * - Metadata types
 */

// ============================================================================
// Entity Types
// ============================================================================

/**
 * Question type enum
 */
export type QuestionType =
    | "single_choice"
    | "multiple_choice"
    | "true_false"
    | "short_answer";

/**
 * Acceptance Exam Question entity
 */
export interface AcceptanceExamQuestion {
    id: number;
    acceptanceExamId: number;
    question: string;
    type: QuestionType;
    points: number;
    order: number;
    explanation: string;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
}

// ============================================================================
// Metadata Types
// ============================================================================

/**
 * Filter definition for acceptance exam questions metadata
 */
export interface AcceptanceExamQuestionFilterDefinition {
    label: string;
    type: "text" | "select" | "number" | "boolean" | "date";
    operators: string[];
    searchable: boolean;
}

/**
 * Filters map
 */
export interface AcceptanceExamQuestionFilters {
    [key: string]: AcceptanceExamQuestionFilterDefinition;
}

/**
 * Operator definitions
 */
export interface AcceptanceExamQuestionOperators {
    [key: string]: string;
}

/**
 * Field type definition
 */
export interface AcceptanceExamQuestionFieldType {
    label: string;
    component: string;
    validation: string;
}

/**
 * Field types map
 */
export interface AcceptanceExamQuestionFieldTypes {
    [key: string]: AcceptanceExamQuestionFieldType;
}

/**
 * Acceptance Exam Questions metadata response data
 */
export interface AcceptanceExamQuestionsMetadata {
    filters: AcceptanceExamQuestionFilters;
    operators: AcceptanceExamQuestionOperators;
    fieldTypes: AcceptanceExamQuestionFieldTypes;
}

// ============================================================================
// Query Parameters
// ============================================================================

/**
 * List query parameters for acceptance exam questions
 */
export interface AcceptanceExamQuestionsListParams {
    page?: number;
}

// ============================================================================
// Payload Types
// ============================================================================

/**
 * Create acceptance exam question payload
 */
export interface AcceptanceExamQuestionCreatePayload {
    acceptanceExamId: number;
    question: string;
    type: QuestionType;
    points: number;
    order: number;
    explanation: string;
    isActive: boolean;
}

/**
 * Update acceptance exam question payload
 */
export interface AcceptanceExamQuestionUpdatePayload {
    question?: string;
    type?: QuestionType;
    points?: number;
    order?: number;
    explanation?: string;
    isActive?: boolean;
}
