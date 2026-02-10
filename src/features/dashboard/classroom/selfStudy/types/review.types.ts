/**
 * Session Review Types
 *
 * Types for content and teacher reviews in group sessions
 */

// ============================================================================
// Review Entity Types
// ============================================================================

/**
 * Lesson reference in review
 */
export interface ReviewLessonRef {
    id: number;
    title: string;
}

/**
 * Session reference in review
 */
export interface ReviewSessionRef {
    id: number;
    sessionDate: string;
    lesson: ReviewLessonRef;
}

/**
 * Session Review entity (for both content and teacher reviews)
 */
export interface SessionReview {
    id: number;
    rate: number;
    comment: string;
    session: ReviewSessionRef;
    student: Record<string, unknown>;
    createdAt: string;
    updatedAt: string;
}

// ============================================================================
// Payload Types
// ============================================================================

/**
 * Create/Update review payload
 */
export interface SessionReviewPayload {
    rate: number;
    comment: string;
}

// ============================================================================
// Response Types
// ============================================================================

/**
 * Get review response
 */
export interface GetSessionReviewResponse {
    success: boolean;
    message: string;
    data: SessionReview | null;
}

/**
 * Create review response
 */
export interface CreateSessionReviewResponse {
    success: boolean;
    message: string;
    data: SessionReview;
}
