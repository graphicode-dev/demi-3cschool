/**
 * Lesson Quiz Options Feature - Domain Types
 *
 * Types for the Lesson Quiz Options domain including:
 * - LessonQuizOption entity
 * - List/Detail response types
 * - Create/Update payloads (single and multiple options)
 * - Query parameters
 * - Metadata types
 */

// ============================================================================
// Entity Types
// ============================================================================

/**
 * Question reference in option
 */
export interface LessonQuizOptionQuestionRef {
    id: string | number;
    question: string;
}

/**
 * Lesson Quiz Option entity
 */
export interface LessonQuizOption {
    id: string | number;
    question: LessonQuizOptionQuestionRef;
    optionText: string;
    isCorrect: number | boolean;
    order: number;
    createdAt: string;
    updatedAt: string;
}

// ============================================================================
// Metadata Types
// ============================================================================

/**
 * Filter definition for lesson quiz options metadata
 */
export interface LessonQuizOptionFilterDefinition {
    label: string;
    type: "text" | "select" | "number" | "boolean" | "date";
    operators: string[];
    searchable: boolean;
}

/**
 * Filters map
 */
export interface LessonQuizOptionFilters {
    [key: string]: LessonQuizOptionFilterDefinition;
}

/**
 * Operator definitions
 */
export interface LessonQuizOptionOperators {
    [key: string]: string;
}

/**
 * Field type definition
 */
export interface LessonQuizOptionFieldType {
    label: string;
    component: string;
    validation: string;
}

/**
 * Field types map
 */
export interface LessonQuizOptionFieldTypes {
    [key: string]: LessonQuizOptionFieldType;
}

/**
 * Lesson Quiz Options metadata response data
 */
export interface LessonQuizOptionsMetadata {
    filters: LessonQuizOptionFilters;
    operators: LessonQuizOptionOperators;
    fieldTypes: LessonQuizOptionFieldTypes;
}

// ============================================================================
// Query Parameters
// ============================================================================

/**
 * List query parameters for lesson quiz options
 */
export interface LessonQuizOptionsListParams {
    page?: number;
}

// ============================================================================
// Payload Types
// ============================================================================

/**
 * Single option item for batch create
 */
export interface LessonQuizOptionItem {
    optionText: string;
    isCorrect: boolean;
    order: number;
}

/**
 * Create single lesson quiz option payload
 */
export interface LessonQuizOptionCreateSinglePayload {
    questionId: string;
    optionText: string;
    isCorrect: boolean;
    order: number;
}

/**
 * Create multiple lesson quiz options payload
 */
export interface LessonQuizOptionCreateMultiplePayload {
    questionId: string;
    options: LessonQuizOptionItem[];
}

/**
 * Create lesson quiz option payload (single or multiple)
 */
export type LessonQuizOptionCreatePayload =
    | LessonQuizOptionCreateSinglePayload
    | LessonQuizOptionCreateMultiplePayload;

/**
 * Update lesson quiz option payload
 */
export interface LessonQuizOptionUpdatePayload {
    questionId?: string;
    optionText?: string;
    isCorrect?: boolean;
    order?: number;
}
