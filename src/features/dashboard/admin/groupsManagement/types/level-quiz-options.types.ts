/**
 * Level Quiz Options Feature - Domain Types
 *
 * Types for the Level Quiz Options domain including:
 * - LevelQuizOption entity
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
export interface LevelQuizOptionQuestionRef {
    id: number;
    question: string;
}

/**
 * Level Quiz Option entity
 */
export interface LevelQuizOption {
    id: number;
    question: LevelQuizOptionQuestionRef;
    optionText: string;
    isCorrect: number;
    order: number;
    createdAt: string;
    updatedAt: string;
}

// ============================================================================
// Metadata Types
// ============================================================================

/**
 * Filter definition for level quiz options metadata
 */
export interface LevelQuizOptionFilterDefinition {
    label: string;
    type: "text" | "select" | "number" | "boolean" | "date";
    operators: string[];
    searchable: boolean;
}

/**
 * Filters map
 */
export interface LevelQuizOptionFilters {
    [key: string]: LevelQuizOptionFilterDefinition;
}

/**
 * Operator definitions
 */
export interface LevelQuizOptionOperators {
    [key: string]: string;
}

/**
 * Field type definition
 */
export interface LevelQuizOptionFieldType {
    label: string;
    component: string;
    validation: string;
}

/**
 * Field types map
 */
export interface LevelQuizOptionFieldTypes {
    [key: string]: LevelQuizOptionFieldType;
}

/**
 * Level Quiz Options metadata response data
 */
export interface LevelQuizOptionsMetadata {
    filters: LevelQuizOptionFilters;
    operators: LevelQuizOptionOperators;
    fieldTypes: LevelQuizOptionFieldTypes;
}

/**
 * List query parameters for level quiz options
 */
export interface LevelQuizOptionsListParams {
    page?: number;
}

// ============================================================================
// Payload Types
// ============================================================================

/**
 * Single option item for batch create
 */
export interface OptionItem {
    option_text: string;
    is_correct: boolean;
    order: number;
}

/**
 * Create level quiz option payload (single option)
 */
export interface LevelQuizOptionCreateSinglePayload {
    question_id: string;
    option_text: string;
    is_correct: boolean;
    order: number;
}

/**
 * Create level quiz options payload (multiple options)
 */
export interface LevelQuizOptionCreateMultiPayload {
    question_id: string;
    options: OptionItem[];
}

/**
 * Create level quiz option payload (union type)
 */
export type LevelQuizOptionCreatePayload =
    | LevelQuizOptionCreateSinglePayload
    | LevelQuizOptionCreateMultiPayload;

/**
 * Update level quiz option payload
 */
export interface LevelQuizOptionUpdatePayload {
    questionId?: string;
    optionText?: string;
    isCorrect?: number;
    order?: number;
}
