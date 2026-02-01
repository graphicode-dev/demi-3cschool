/**
 * Lesson Video Quiz Options Feature - Domain Types
 *
 * Types for the Lesson Video Quiz Options domain including:
 * - LessonVideoQuizOption entity
 * - List/Detail response types
 * - Create/Update payloads
 * - Query parameters
 * - Metadata types
 */

// ============================================================================
// Entity Types
// ============================================================================

/**
 * Question reference in option
 */
export interface LessonVideoQuizOptionQuestionRef {
    id: string | number;
    question: string;
}

/**
 * Lesson Video Quiz Option entity
 */
export interface LessonVideoQuizOption {
    id: string | number;
    question: LessonVideoQuizOptionQuestionRef;
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
 * Filter definition for lesson video quiz options metadata
 */
export interface LessonVideoQuizOptionFilterDefinition {
    label: string;
    type: "text" | "select" | "number" | "boolean" | "date";
    operators: string[];
    searchable: boolean;
}

/**
 * Filters map
 */
export interface LessonVideoQuizOptionFilters {
    [key: string]: LessonVideoQuizOptionFilterDefinition;
}

/**
 * Operator definitions
 */
export interface LessonVideoQuizOptionOperators {
    [key: string]: string;
}

/**
 * Field type definition
 */
export interface LessonVideoQuizOptionFieldType {
    label: string;
    component: string;
    validation: string;
}

/**
 * Field types map
 */
export interface LessonVideoQuizOptionFieldTypes {
    [key: string]: LessonVideoQuizOptionFieldType;
}

/**
 * Lesson Video Quiz Options metadata response data
 */
export interface LessonVideoQuizOptionsMetadata {
    filters: LessonVideoQuizOptionFilters;
    operators: LessonVideoQuizOptionOperators;
    fieldTypes: LessonVideoQuizOptionFieldTypes;
}

// ============================================================================
// Query Parameters
// ============================================================================

/**
 * List query parameters for lesson video quiz options
 */
export interface LessonVideoQuizOptionsListParams {
    page?: number;
}

// ============================================================================
// Payload Types
// ============================================================================

/**
 * Create lesson video quiz option payload
 */
export interface LessonVideoQuizOptionCreatePayload {
    questionId: string | number;
    optionText: string;
    isCorrect: boolean;
    order: number;
}

/**
 * Update lesson video quiz option payload
 */
export interface LessonVideoQuizOptionUpdatePayload {
    questionId?: string | number;
    optionText?: string;
    isCorrect?: boolean;
    order?: number;
}
