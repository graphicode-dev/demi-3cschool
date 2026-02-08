/**
 * Level Quizzes Feature - Domain Types
 *
 * Types for the Level Quizzes domain including:
 * - LevelQuiz entity
 * - List/Detail response types
 * - Create/Update payloads
 * - Query parameters
 * - Metadata types
 */

// ============================================================================
// Entity Types
// ============================================================================

/**
 * Level reference in quiz
 */
export interface LevelQuizLevelRef {
    id: string;
    title: string;
}

/**
 * Level Quiz entity
 */
export interface LevelQuiz {
    id: string;
    level: LevelQuizLevelRef;
    timeLimit: number;
    passingScore: number;
    maxAttempts: number;
    shuffleQuestions: number;
    showAnswers: number;
    createdAt: string;
    updatedAt: string;
}

// ============================================================================
// Metadata Types
// ============================================================================

/**
 * Filter definition for level quizzes metadata
 */
export interface LevelQuizFilterDefinition {
    label: string;
    type: "text" | "select" | "number" | "boolean" | "date";
    operators: string[];
    searchable: boolean;
}

/**
 * Filters map
 */
export interface LevelQuizFilters {
    [key: string]: LevelQuizFilterDefinition;
}

/**
 * Operator definitions
 */
export interface LevelQuizOperators {
    [key: string]: string;
}

/**
 * Field type definition
 */
export interface LevelQuizFieldType {
    label: string;
    component: string;
    validation: string;
}

/**
 * Field types map
 */
export interface LevelQuizFieldTypes {
    [key: string]: LevelQuizFieldType;
}

/**
 * Level Quizzes metadata response data
 */
export interface LevelQuizzesMetadata {
    filters: LevelQuizFilters;
    operators: LevelQuizOperators;
    fieldTypes: LevelQuizFieldTypes;
}

// ============================================================================
// Payload Types
// ============================================================================

/**
 * Create level quiz payload
 */
export interface LevelQuizCreatePayload {
    levelId: string;
    timeLimit: number;
    passingScore: number;
    maxAttempts: number;
    shuffleQuestions: boolean;
    showAnswers: boolean;
}

/**
 * Update level quiz payload
 */
export interface LevelQuizUpdatePayload {
    levelId?: string;
    timeLimit?: number;
    passingScore?: number;
    maxAttempts?: number;
    shuffleQuestions?: boolean;
    showAnswers?: boolean;
}
