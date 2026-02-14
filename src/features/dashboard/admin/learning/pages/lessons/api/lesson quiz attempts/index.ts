/**
 * Lesson Quiz Attempts Feature - API Module
 *
 * Public exports for the lesson quiz attempts API layer.
 * Import from '@/features/lessons/lesson-quiz-attempts/api'.
 *
 * @example
 * ```ts
 * import {
 *     useLessonQuizAttemptsList,
 *     useLessonQuizAttempt,
 *     useCreateLessonQuizAttempt,
 *     useLessonQuizAttemptsMetadata,
 *     lessonQuizAttemptKeys,
 * } from '@/features/lessons/lesson-quiz-attempts/api';
 * ```
 */

// Query Keys
export {
    lessonQuizAttemptKeys,
    type LessonQuizAttemptQueryKey,
} from "./lesson-quiz-attempts.keys";

// API Functions
export { lessonQuizAttemptsApi } from "./lesson-quiz-attempts.api";

// Query Hooks
export {
    useLessonQuizAttemptsMetadata,
    useLessonQuizAttemptsList,
    useLessonQuizAttemptsInfinite,
    useLessonQuizAttempt,
    useLessonQuizAttemptHistory,
} from "./lesson-quiz-attempts.queries";

// Mutation Hooks
export {
    useAnswerLessonQuizAttempt,
    useCompleteLessonQuizAttempt,
    useStartLessonQuizAttempt,
} from "./lesson-quiz-attempts.mutations";
