/**
 * Acceptance Exams Feature - Domain Types
 *
 * Types for the Acceptance Exams domain including:
 * - AcceptanceExam entity
 * - List/Detail response types
 * - Create/Update payloads
 * - Query parameters
 * - Metadata types
 */

// ============================================================================
// Entity Types
// ============================================================================

/**
 * Grade reference in acceptance exam
 */
export interface AcceptanceExamGradeRef {
    id: number;
    name: string;
}

/**
 * Acceptance Exam entity
 */
export interface AcceptanceExam {
    id: number;
    grade: AcceptanceExamGradeRef;
    title: string;
    description: string;
    timeLimit: number;
    passingScore: number;
    maxAttempts: number;
    shuffleQuestions: boolean;
    showAnswers: boolean;
    isActive: boolean;
    questionsCount?: Record<string, unknown>;
    createdAt: string;
    updatedAt: string;
}

// ============================================================================
// Metadata Types
// ============================================================================

/**
 * Filter definition for acceptance exams metadata
 */
export interface AcceptanceExamFilterDefinition {
    label: string;
    type: "text" | "select" | "number" | "boolean" | "date";
    operators: string[];
    searchable: boolean;
}

/**
 * Filters map
 */
export interface AcceptanceExamFilters {
    [key: string]: AcceptanceExamFilterDefinition;
}

/**
 * Operator definitions
 */
export interface AcceptanceExamOperators {
    [key: string]: string;
}

/**
 * Field type definition
 */
export interface AcceptanceExamFieldType {
    label: string;
    component: string;
    validation: string;
}

/**
 * Field types map
 */
export interface AcceptanceExamFieldTypes {
    [key: string]: AcceptanceExamFieldType;
}

/**
 * Acceptance Exams metadata response data
 */
export interface AcceptanceExamsMetadata {
    filters: AcceptanceExamFilters;
    operators: AcceptanceExamOperators;
    fieldTypes: AcceptanceExamFieldTypes;
}

// ============================================================================
// Query Parameters
// ============================================================================

/**
 * List query parameters for acceptance exams
 */
export interface AcceptanceExamsListParams {
    page?: number;
}

// ============================================================================
// Payload Types
// ============================================================================

/**
 * Create acceptance exam payload
 */
export interface AcceptanceExamCreatePayload {
    gradeId: string;
    title: string;
    description: string;
    timeLimit: string;
    passingScore: string;
    maxAttempts: string;
    shuffleQuestions: boolean;
    showAnswers: boolean;
}

/**
 * Update acceptance exam payload
 */
export interface AcceptanceExamUpdatePayload {
    gradeId?: string;
    title?: string;
    description?: string;
    timeLimit?: string;
    passingScore?: string;
    maxAttempts?: string;
    shuffleQuestions?: boolean;
    showAnswers?: boolean;
}
