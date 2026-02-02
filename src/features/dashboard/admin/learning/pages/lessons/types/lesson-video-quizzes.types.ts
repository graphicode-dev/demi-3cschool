/**
 * Lesson Video Quizzes Feature - Domain Types
 *
 * Types for the Lesson Video Quizzes domain including:
 * - LessonVideoQuiz entity
 * - List/Detail response types
 * - Create/Update payloads
 * - Query parameters
 * - Metadata types
 */

// ============================================================================
// Entity Types
// ============================================================================

/**
 * Lesson Video reference in quiz
 */
export interface LessonVideoQuizVideoRef {
    id: string | number;
    title: string;
}

/**
 * Lesson Video Quiz entity
 */
export interface LessonVideoQuiz {
    id: string | number;
    lessonVideo: LessonVideoQuizVideoRef;
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
 * Filter definition for lesson video quizzes metadata
 */
export interface LessonVideoQuizFilterDefinition {
    label: string;
    type: "text" | "select" | "number" | "boolean" | "date";
    operators: string[];
    searchable: boolean;
}

/**
 * Filters map
 */
export interface LessonVideoQuizFilters {
    [key: string]: LessonVideoQuizFilterDefinition;
}

/**
 * Operator definitions
 */
export interface LessonVideoQuizOperators {
    [key: string]: string;
}

/**
 * Field type definition
 */
export interface LessonVideoQuizFieldType {
    label: string;
    component: string;
    validation: string;
}

/**
 * Field types map
 */
export interface LessonVideoQuizFieldTypes {
    [key: string]: LessonVideoQuizFieldType;
}

/**
 * Lesson Video Quizzes metadata response data
 */
export interface LessonVideoQuizzesMetadata {
    filters: LessonVideoQuizFilters;
    operators: LessonVideoQuizOperators;
    fieldTypes: LessonVideoQuizFieldTypes;
}

// ============================================================================
// Query Parameters
// ============================================================================

/**
 * List query parameters for lesson video quizzes
 */
export interface LessonVideoQuizzesListParams {
    page?: number;
    perPage?: number;
    lessonVideoId?: string | number;
}

/**
 * Paginated data structure for lesson video quizzes
 */
export interface LessonVideoQuizzesPaginatedData {
    perPage: number;
    currentPage: number;
    lastPage: number;
    nextPageUrl: string | null;
    items: LessonVideoQuiz[];
}

/**
 * Paginated response for lesson video quizzes list
 */
export interface LessonVideoQuizzesPaginatedResponse {
    data: LessonVideoQuiz[];
    pagination: {
        currentPage: number;
        lastPage: number;
        perPage: number;
        total: number;
    };
}

// ============================================================================
// Payload Types
// ============================================================================

/**
 * Create lesson video quiz payload
 */
export interface LessonVideoQuizCreatePayload {
    lessonVideoId: string;
    timeLimit: number;
    passingScore: number;
    maxAttempts: number;
    shuffleQuestions: boolean;
    showAnswers: boolean;
}

/**
 * Update lesson video quiz payload
 */
export interface LessonVideoQuizUpdatePayload {
    lessonVideoId?: string;
    timeLimit?: number;
    passingScore?: number;
    maxAttempts?: number;
    shuffleQuestions?: boolean;
    showAnswers?: boolean;
}
