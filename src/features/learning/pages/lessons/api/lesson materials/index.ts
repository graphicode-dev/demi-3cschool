/**
 * Lesson Materials Feature - API Module
 *
 * Public exports for the lesson materials API layer.
 * Import from '@/features/lessons/lesson-materials/api'.
 *
 * @example
 * ```ts
 * import {
 *     useLessonMaterialsList,
 *     useLessonMaterial,
 *     useCreateLessonMaterial,
 *     lessonMaterialKeys,
 * } from '@/features/lessons/lesson-materials/api';
 * ```
 */

// Query Keys
export {
    lessonMaterialKeys,
    type LessonMaterialQueryKey,
} from "./lesson-materials.keys";

// API Functions
export { lessonMaterialsApi } from "./lesson-materials.api";

// Query Hooks
export {
    useLessonMaterialsList,
    useLessonMaterial,
} from "./lesson-materials.queries";

// Mutation Hooks
export {
    useCreateLessonMaterial,
    useUpdateLessonMaterial,
    useDeleteLessonMaterial,
} from "./lesson-materials.mutations";
