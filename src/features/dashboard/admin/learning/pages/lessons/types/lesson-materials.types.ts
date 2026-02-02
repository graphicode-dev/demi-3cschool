/**
 * Lesson Materials Feature - Domain Types
 *
 * Types for the Lesson Materials domain including:
 * - LessonMaterial entity
 * - List/Detail response types
 * - Create/Update payloads (FormData)
 */

// ============================================================================
// Entity Types
// ============================================================================

/**
 * File reference in material
 */
export interface LessonMaterialFile {
    id: string;
    name: string;
    fileName: string;
    mimeType: string;
    size: number;
    humanReadableSize: string;
    url: string;
}

/**
 * Lesson Material entity
 */
export interface LessonMaterial {
    id: string;
    title: string;
    file: LessonMaterialFile;
    createdAt: string;
    updatedAt: string;
}

// ============================================================================
// Payload Types (FormData)
// ============================================================================

/**
 * Create lesson material payload (FormData)
 */
export interface LessonMaterialCreatePayload {
    lessonId: string;
    title: string;
    file?: File;
}

/**
 * Update lesson material payload (FormData)
 */
export interface LessonMaterialUpdatePayload {
    lessonId?: string;
    title?: string;
    file?: File;
}

/**
 * List params for lesson materials
 */
export interface LessonMaterialsListParams {
    page?: number;
    perPage?: number;
}
