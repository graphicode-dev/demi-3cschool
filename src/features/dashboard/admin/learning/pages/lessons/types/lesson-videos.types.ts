/**
 * Lesson Videos Feature - Domain Types
 *
 * Types for the Lesson Videos domain including:
 * - LessonVideo entity
 * - List/Detail response types
 * - Create/Update payloads
 */

// ============================================================================
// Entity Types
// ============================================================================

/**
 * Lesson reference in video
 */
export interface LessonVideoLessonRef {
    id: string;
    title: string;
}

/**
 * Lesson Video entity
 */
export interface LessonVideo {
    id: string;
    lesson: LessonVideoLessonRef;
    title: string;
    description: string;
    duration: string | number;
    provider: string;
    videoReferenceAr: string;
    videoReferenceEn: string;
    isActive: number;
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
// Payload Types
// ============================================================================

/**
 * Create lesson video payload
 */
export interface LessonVideoCreatePayload {
    lessonId: string;
    title: string;
    description: string;
    duration: number;
    provider: string;
    videoReferenceAr: string;
    videoReferenceEn: string;
    isActive: number;
}

/**
 * Update lesson video payload
 */
export interface LessonVideoUpdatePayload {
    lessonId?: string;
    title?: string;
    description?: string;
    duration?: number;
    provider?: string;
    videoReferenceAr?: string;
    videoReferenceEn?: string;
    isActive?: number;
}
