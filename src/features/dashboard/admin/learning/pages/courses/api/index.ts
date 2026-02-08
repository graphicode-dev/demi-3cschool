/**
 * Courses Feature - API Module
 *
 * Public exports for the courses API layer.
 * Import from '@/features/courses/api' or '@/features/courses'.
 *
 * @example
 * ```ts
 * import {
 *     useCoursesList,
 *     useCoursesByProgram,
 *     useCourse,
 *     useCreateCourse,
 *     useCoursesMetadata,
 *     courseKeys,
 * } from '@/features/courses';
 * ```
 */

// Types
export type {
    Course,
    CourseImage,
    CoursesListParams,
    CoursesByProgramParams,
    CourseCreatePayload,
    CourseUpdatePayload,
    CoursesMetadata,
    CourseFilterDefinition,
    CourseOperators,
    CourseFieldType,
    CourseFieldTypes,
    ProgramType,
} from "../types/courses.types";

// Query Keys
export { courseKeys, type CourseQueryKey } from "./courses.keys";

// API Functions
export { coursesApi } from "./courses.api";

// Query Hooks
export {
    useCoursesMetadata,
    useCoursesList,
    useCoursesByProgram,
    useCoursesInfinite,
    useCoursesInfiniteByProgram,
    useCourse,
} from "./courses.queries";

// Mutation Hooks
export {
    useCreateCourse,
    useUpdateCourse,
    useDeleteCourse,
} from "./courses.mutations";
