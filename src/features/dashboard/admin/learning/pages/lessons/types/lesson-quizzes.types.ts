/**
 * Lesson Quizzes Feature - Domain Types
 *
 * Types for the Lesson Quizzes domain including:
 * - LessonQuiz entity
 * - List/Detail response types
 * - Create/Update payloads
 * - Query parameters
 * - Metadata types
 */

// ============================================================================
// Entity Types
// ============================================================================

/**
 * Lesson reference in quiz
 */
export interface LessonQuizLessonRef {
    id: string | number;
    title: string;
}

/**
 * Lesson Quiz entity
 */
export interface LessonQuiz {
    id: string | number;
    lesson: LessonQuizLessonRef;
    timeLimit: number;
    passingScore: number;
    maxAttempts: number;
    shuffleQuestions: number | boolean;
    showAnswers: number | boolean;
    createdAt: string;
    updatedAt: string;
}

// ============================================================================
// Metadata Types
// ============================================================================

/**
 * Filter definition for lesson quizzes metadata
 */
export interface LessonQuizFilterDefinition {
    label: string;
    type: "text" | "select" | "number" | "boolean" | "date";
    operators: string[];
    searchable: boolean;
}

/**
 * Filters map
 */
export interface LessonQuizFilters {
    [key: string]: LessonQuizFilterDefinition;
}

/**
 * Operator definitions
 */
export interface LessonQuizOperators {
    [key: string]: string;
}

/**
 * Field type definition
 */
export interface LessonQuizFieldType {
    label: string;
    component: string;
    validation: string;
}

/**
 * Field types map
 */
export interface LessonQuizFieldTypes {
    [key: string]: LessonQuizFieldType;
}

/**
 * Lesson Quizzes metadata response data
 */
export interface LessonQuizzesMetadata {
    filters: LessonQuizFilters;
    operators: LessonQuizOperators;
    fieldTypes: LessonQuizFieldTypes;
}

// ============================================================================
// Payload Types
// ============================================================================

/**
 * Create lesson quiz payload
 */
export interface LessonQuizCreatePayload {
    lessonId: string;
    timeLimit: number;
    passingScore: number;
    maxAttempts: number;
    shuffleQuestions: boolean;
    showAnswers: boolean;
}

/**
 * Update lesson quiz payload
 */
export interface LessonQuizUpdatePayload {
    lessonId?: string;
    timeLimit?: number;
    passingScore?: number;
    maxAttempts?: number;
    shuffleQuestions?: boolean;
    showAnswers?: boolean;
}
