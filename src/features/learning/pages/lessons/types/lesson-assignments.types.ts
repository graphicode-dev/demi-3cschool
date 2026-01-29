/**
 * Lesson Assignments Feature - Domain Types
 *
 * Types for the Lesson Assignments domain including:
 * - LessonAssignment entity
 * - List/Detail response types
 * - Create/Update payloads (FormData)
 */

// ============================================================================
// Entity Types
// ============================================================================

/**
 * File reference in assignment
 */
export interface LessonAssignmentFile {
    id: string;
    name: string;
    fileName: string;
    mimeType: string;
    size: number;
    humanReadableSize: string;
    url: string;
}

/**
 * Lesson Assignment entity
 */
export interface LessonAssignment {
    id: string;
    title: string;
    file: LessonAssignmentFile;
    createdAt: string;
    updatedAt: string;
}

// ============================================================================
// API Response Types
// ============================================================================

/**
 * List response wrapper (array)
 */
export interface ListResponse<T> {
    success: boolean;
    message: string;
    data: T[];
}

// ============================================================================
// Payload Types (FormData)
// ============================================================================

/**
 * Create lesson assignment payload (FormData)
 */
export interface LessonAssignmentCreatePayload {
    lessonId: string;
    title: string;
    file?: File;
}

/**
 * Update lesson assignment payload (FormData)
 */
export interface LessonAssignmentUpdatePayload {
    lessonId?: string;
    title?: string;
    file?: File;
}
