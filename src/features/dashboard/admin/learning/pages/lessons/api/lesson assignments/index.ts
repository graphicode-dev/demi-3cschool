/**
 * Lesson Assignments Feature - API Module
 *
 * Public exports for the lesson assignments API layer.
 * Import from '@/features/lessons/lesson-assignments/api'.
 *
 * @example
 * ```ts
 * import {
 *     useLessonAssignmentsList,
 *     useLessonAssignment,
 *     useCreateLessonAssignment,
 *     lessonAssignmentKeys,
 * } from '@/features/lessons/lesson-assignments/api';
 * ```
 */

// Query Keys
export {
    lessonAssignmentKeys,
    type LessonAssignmentQueryKey,
} from "./lesson-assignments.keys";

// API Functions
export { lessonAssignmentsApi } from "./lesson-assignments.api";

// Query Hooks
export {
    useLessonAssignmentsList,
    useLessonAssignmentsByLesson,
    useLessonAssignment,
} from "./lesson-assignments.queries";

// Mutation Hooks
export {
    useCreateLessonAssignment,
    useUpdateLessonAssignment,
    useDeleteLessonAssignment,
} from "./lesson-assignments.mutations";
