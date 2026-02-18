/**
 * Acceptance Exam Options Feature - Domain Types
 *
 * Types for the Acceptance Exam Options domain including:
 * - AcceptanceExamOption entity
 * - List/Detail response types
 * - Create/Update payloads
 * - Query parameters
 * - Metadata types
 */

// ============================================================================
// Entity Types
// ============================================================================

/**
 * Acceptance Exam Option entity
 */
export interface AcceptanceExamOption {
    id: number;
    questionId: number;
    optionText: string;
    isCorrect: boolean;
    order: number;
    createdAt: string;
    updatedAt: string;
}

// ============================================================================
// Metadata Types
// ============================================================================

/**
 * Filter definition for acceptance exam options metadata
 */
export interface AcceptanceExamOptionFilterDefinition {
    label: string;
    type: "text" | "select" | "number" | "boolean" | "date";
    operators: string[];
    searchable: boolean;
}

/**
 * Filters map
 */
export interface AcceptanceExamOptionFilters {
    [key: string]: AcceptanceExamOptionFilterDefinition;
}

/**
 * Operator definitions
 */
export interface AcceptanceExamOptionOperators {
    [key: string]: string;
}

/**
 * Field type definition
 */
export interface AcceptanceExamOptionFieldType {
    label: string;
    component: string;
    validation: string;
}

/**
 * Field types map
 */
export interface AcceptanceExamOptionFieldTypes {
    [key: string]: AcceptanceExamOptionFieldType;
}

/**
 * Acceptance Exam Options metadata response data
 */
export interface AcceptanceExamOptionsMetadata {
    filters: AcceptanceExamOptionFilters;
    operators: AcceptanceExamOptionOperators;
    fieldTypes: AcceptanceExamOptionFieldTypes;
}

/**
 * List query parameters for acceptance exam options
 */
export interface AcceptanceExamOptionsListParams {
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
 * Create acceptance exam options payload
 */
export interface AcceptanceExamOptionCreatePayload {
    questionId: number;
    options: OptionItem[];
}

/**
 * Update acceptance exam option payload
 */
export interface AcceptanceExamOptionUpdatePayload {
    option_text?: string;
    is_correct?: boolean;
    order?: number;
}
