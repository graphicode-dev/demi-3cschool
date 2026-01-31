/**
 * Learning Feature - Path Builders
 *
 * Centralized, type-safe path builders for Standard and Professional Learning.
 * Includes Courses, Levels, and Lessons paths for both curriculum types.
 *
 * @example
 * ```ts
 * import { learningPaths } from '@/features/learning/navigation/paths';
 *
 * navigate(learningPaths.standard.courses.list());
 * navigate(learningPaths.professional.levels.view(levelId));
 * ```
 */

import { registerFeaturePaths } from "@/router/paths.registry";

const STANDARD_BASE_PATH = "/dashboard/standard-learning";
const PROFESSIONAL_BASE_PATH = "/dashboard/professional-learning";

// ============================================================================
// Standard Learning Paths
// ============================================================================

export const standardLearningPaths = {
    courses: {
        list: () => `${STANDARD_BASE_PATH}/courses`,
        create: () => `${STANDARD_BASE_PATH}/courses/create`,
        edit: (id: string | number) =>
            `${STANDARD_BASE_PATH}/courses/edit/${id}`,
        view: (id: string | number) =>
            `${STANDARD_BASE_PATH}/courses/view/${id}`,
    },
    levels: {
        list: () => `${STANDARD_BASE_PATH}/levels`,
        create: () => `${STANDARD_BASE_PATH}/levels/create`,
        edit: (id: string | number) =>
            `${STANDARD_BASE_PATH}/levels/edit/${id}`,
        view: (id: string | number) =>
            `${STANDARD_BASE_PATH}/levels/view/${id}`,
    },
    lessons: {
        list: () => `${STANDARD_BASE_PATH}/lessons`,
        listByLevel: (levelId: string | number) =>
            `${STANDARD_BASE_PATH}/lessons?levelId=${levelId}`,
        create: () => `${STANDARD_BASE_PATH}/lessons/create`,
        edit: (id: string | number) =>
            `${STANDARD_BASE_PATH}/lessons/edit/${id}`,
        view: (id: string | number) =>
            `${STANDARD_BASE_PATH}/lessons/view/${id}`,
    },
} as const;

// ============================================================================
// Professional Learning Paths
// ============================================================================

export const professionalLearningPaths = {
    courses: {
        list: () => `${PROFESSIONAL_BASE_PATH}/courses`,
        create: () => `${PROFESSIONAL_BASE_PATH}/courses/create`,
        edit: (id: string | number) =>
            `${PROFESSIONAL_BASE_PATH}/courses/edit/${id}`,
        view: (id: string | number) =>
            `${PROFESSIONAL_BASE_PATH}/courses/view/${id}`,
    },
    levels: {
        list: () => `${PROFESSIONAL_BASE_PATH}/levels`,
        create: () => `${PROFESSIONAL_BASE_PATH}/levels/create`,
        edit: (id: string | number) =>
            `${PROFESSIONAL_BASE_PATH}/levels/edit/${id}`,
        view: (id: string | number) =>
            `${PROFESSIONAL_BASE_PATH}/levels/view/${id}`,
    },
    lessons: {
        list: () => `${PROFESSIONAL_BASE_PATH}/lessons`,
        listByLevel: (levelId: string | number) =>
            `${PROFESSIONAL_BASE_PATH}/lessons?levelId=${levelId}`,
        create: () => `${PROFESSIONAL_BASE_PATH}/lessons/create`,
        edit: (id: string | number) =>
            `${PROFESSIONAL_BASE_PATH}/lessons/edit/${id}`,
        view: (id: string | number) =>
            `${PROFESSIONAL_BASE_PATH}/lessons/view/${id}`,
    },
} as const;

// ============================================================================
// Combined Learning Paths
// ============================================================================

export const learningPaths = {
    standard: standardLearningPaths,
    professional: professionalLearningPaths,
} as const;

// ============================================================================
// Register Feature Paths
// ============================================================================

export const learningManagementPaths = registerFeaturePaths("learning", {
    // Standard Learning
    standardCoursesList: standardLearningPaths.courses.list,
    standardCoursesCreate: standardLearningPaths.courses.create,
    standardCoursesEdit: standardLearningPaths.courses.edit,
    standardCoursesView: standardLearningPaths.courses.view,
    standardLevelsList: standardLearningPaths.levels.list,
    standardLevelsCreate: standardLearningPaths.levels.create,
    standardLevelsEdit: standardLearningPaths.levels.edit,
    standardLessonsList: standardLearningPaths.lessons.list,
    standardLessonsListByLevel: standardLearningPaths.lessons.listByLevel,
    standardLessonsCreate: standardLearningPaths.lessons.create,
    standardLessonsEdit: standardLearningPaths.lessons.edit,
    standardLessonsView: standardLearningPaths.lessons.view,
    // Professional Learning
    professionalCoursesList: professionalLearningPaths.courses.list,
    professionalCoursesCreate: professionalLearningPaths.courses.create,
    professionalCoursesEdit: professionalLearningPaths.courses.edit,
    professionalCoursesView: professionalLearningPaths.courses.view,
    professionalLevelsList: professionalLearningPaths.levels.list,
    professionalLevelsCreate: professionalLearningPaths.levels.create,
    professionalLevelsEdit: professionalLearningPaths.levels.edit,
    professionalLessonsList: professionalLearningPaths.lessons.list,
    professionalLessonsListByLevel:
        professionalLearningPaths.lessons.listByLevel,
    professionalLessonsCreate: professionalLearningPaths.lessons.create,
    professionalLessonsEdit: professionalLearningPaths.lessons.edit,
    professionalLessonsView: professionalLearningPaths.lessons.view,
});

// ============================================================================
// Type Exports
// ============================================================================

export type StandardLearningPaths = typeof standardLearningPaths;
export type ProfessionalLearningPaths = typeof professionalLearningPaths;
export type LearningPaths = typeof learningPaths;
