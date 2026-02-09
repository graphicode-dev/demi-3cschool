/**
 * Learning Feature - Path Builders
 *
 * Centralized, type-safe path builders for Grades navigation.
 * Flow: Grades -> Grade 4/5/6 -> Terms -> Lessons
 *
 * @example
 * ```ts
 * import { learningPaths, gradesPaths } from '@/features/learning/navigation/paths';
 *
 * navigate(gradesPaths.list());
 * navigate(gradesPaths.terms(4));
 * navigate(gradesPaths.lessons(4, 'first_term'));
 * ```
 */

import { registerFeaturePaths } from "@/router/paths.registry";

const GRADES_BASE_PATH = "/admin/grades";
const FIRST_TERM_BASE_PATH = "/admin/firstTerm-learning";
const SECOND_TERM_BASE_PATH = "/admin/secondTerm-learning";
const SUMMER_CAMP_BASE_PATH = "/admin/summer-camp";

// ============================================================================
// Grades Navigation Paths (New Structure)
// ============================================================================

export const gradesPaths = {
    /** List all grades */
    list: () => `${GRADES_BASE_PATH}`,
    /** Terms list for a specific grade */
    terms: (gradeId: string | number) =>
        `${GRADES_BASE_PATH}/${gradeId}/levels`,
    /** Lessons list for a specific grade and term */
    lessons: (gradeId: string | number, termId: string) =>
        `${GRADES_BASE_PATH}/${gradeId}/levels/${termId}/lessons`,
    /** Create lesson for a specific grade and term */
    lessonsCreate: (gradeId: string | number, termId: string) =>
        `${GRADES_BASE_PATH}/${gradeId}/levels/${termId}/lessons/create`,
    /** Edit lesson for a specific grade and term */
    lessonsEdit: (
        gradeId: string | number,
        termId: string,
        lessonId: string | number
    ) =>
        `${GRADES_BASE_PATH}/${gradeId}/levels/${termId}/lessons/edit/${lessonId}`,
    /** View lesson for a specific grade and term */
    lessonsView: (
        gradeId: string | number,
        termId: string,
        lessonId: string | number
    ) =>
        `${GRADES_BASE_PATH}/${gradeId}/levels/${termId}/lessons/view/${lessonId}`,
} as const;

// ============================================================================
// First Term Learning Paths
// ============================================================================

export const FirstTermLearningPaths = {
    courses: {
        list: () => `${FIRST_TERM_BASE_PATH}/courses`,
        create: () => `${FIRST_TERM_BASE_PATH}/courses/create`,
        edit: (id: string | number) =>
            `${FIRST_TERM_BASE_PATH}/courses/edit/${id}`,
        view: (id: string | number) =>
            `${FIRST_TERM_BASE_PATH}/courses/view/${id}`,
    },
    levels: {
        list: () => `${FIRST_TERM_BASE_PATH}/levels`,
        create: () => `${FIRST_TERM_BASE_PATH}/levels/create`,
        edit: (id: string | number) =>
            `${FIRST_TERM_BASE_PATH}/levels/edit/${id}`,
        view: (id: string | number) =>
            `${FIRST_TERM_BASE_PATH}/levels/view/${id}`,
    },
    lessons: {
        list: () => `${FIRST_TERM_BASE_PATH}/lessons`,
        listByLevel: (levelId: string | number) =>
            `${FIRST_TERM_BASE_PATH}/lessons?levelId=${levelId}`,
        create: () => `${FIRST_TERM_BASE_PATH}/lessons/create`,
        edit: (id: string | number) =>
            `${FIRST_TERM_BASE_PATH}/lessons/edit/${id}`,
        view: (id: string | number) =>
            `${FIRST_TERM_BASE_PATH}/lessons/view/${id}`,
    },
} as const;

// ============================================================================
// Second Term Learning Paths
// ============================================================================

export const SecondTermLearningPaths = {
    courses: {
        list: () => `${SECOND_TERM_BASE_PATH}/courses`,
        create: () => `${SECOND_TERM_BASE_PATH}/courses/create`,
        edit: (id: string | number) =>
            `${SECOND_TERM_BASE_PATH}/courses/edit/${id}`,
        view: (id: string | number) =>
            `${SECOND_TERM_BASE_PATH}/courses/view/${id}`,
    },
    levels: {
        list: () => `${SECOND_TERM_BASE_PATH}/levels`,
        create: () => `${SECOND_TERM_BASE_PATH}/levels/create`,
        edit: (id: string | number) =>
            `${SECOND_TERM_BASE_PATH}/levels/edit/${id}`,
        view: (id: string | number) =>
            `${SECOND_TERM_BASE_PATH}/levels/view/${id}`,
    },
    lessons: {
        list: () => `${SECOND_TERM_BASE_PATH}/lessons`,
        listByLevel: (levelId: string | number) =>
            `${SECOND_TERM_BASE_PATH}/lessons?levelId=${levelId}`,
        create: () => `${SECOND_TERM_BASE_PATH}/lessons/create`,
        edit: (id: string | number) =>
            `${SECOND_TERM_BASE_PATH}/lessons/edit/${id}`,
        view: (id: string | number) =>
            `${SECOND_TERM_BASE_PATH}/lessons/view/${id}`,
    },
} as const;

// ============================================================================
// Summer Camp Learning Paths
// ============================================================================

export const SummerCampLearningPaths = {
    courses: {
        list: () => `${SUMMER_CAMP_BASE_PATH}/courses`,
        create: () => `${SUMMER_CAMP_BASE_PATH}/courses/create`,
        edit: (id: string | number) =>
            `${SUMMER_CAMP_BASE_PATH}/courses/edit/${id}`,
        view: (id: string | number) =>
            `${SUMMER_CAMP_BASE_PATH}/courses/view/${id}`,
    },
    levels: {
        list: () => `${SUMMER_CAMP_BASE_PATH}/levels`,
        create: () => `${SUMMER_CAMP_BASE_PATH}/levels/create`,
        edit: (id: string | number) =>
            `${SUMMER_CAMP_BASE_PATH}/levels/edit/${id}`,
        view: (id: string | number) =>
            `${SUMMER_CAMP_BASE_PATH}/levels/view/${id}`,
    },
    lessons: {
        list: () => `${SUMMER_CAMP_BASE_PATH}/lessons`,
        listByLevel: (levelId: string | number) =>
            `${SUMMER_CAMP_BASE_PATH}/lessons?levelId=${levelId}`,
        create: () => `${SUMMER_CAMP_BASE_PATH}/lessons/create`,
        edit: (id: string | number) =>
            `${SUMMER_CAMP_BASE_PATH}/lessons/edit/${id}`,
        view: (id: string | number) =>
            `${SUMMER_CAMP_BASE_PATH}/lessons/view/${id}`,
    },
} as const;

// ============================================================================
// Combined Learning Paths
// ============================================================================

export const learningPaths = {
    firstTerm: FirstTermLearningPaths,
    secondTerm: SecondTermLearningPaths,
    summerCamp: SummerCampLearningPaths,
} as const;

// ============================================================================
// Register Feature Paths
// ============================================================================

export const learningManagementPaths = registerFeaturePaths("learning", {
    // First Term Learning
    firstTermCoursesList: FirstTermLearningPaths.courses.list,
    firstTermCoursesCreate: FirstTermLearningPaths.courses.create,
    firstTermCoursesEdit: FirstTermLearningPaths.courses.edit,
    firstTermCoursesView: FirstTermLearningPaths.courses.view,
    firstTermLevelsList: FirstTermLearningPaths.levels.list,
    firstTermLevelsCreate: FirstTermLearningPaths.levels.create,
    firstTermLevelsEdit: FirstTermLearningPaths.levels.edit,
    firstTermLessonsList: FirstTermLearningPaths.lessons.list,
    firstTermLessonsListByLevel: FirstTermLearningPaths.lessons.listByLevel,
    firstTermLessonsCreate: FirstTermLearningPaths.lessons.create,
    firstTermLessonsEdit: FirstTermLearningPaths.lessons.edit,
    firstTermLessonsView: FirstTermLearningPaths.lessons.view,

    // Second Term Learning
    secondTermCoursesList: SecondTermLearningPaths.courses.list,
    secondTermCoursesCreate: SecondTermLearningPaths.courses.create,
    secondTermCoursesEdit: SecondTermLearningPaths.courses.edit,
    secondTermCoursesView: SecondTermLearningPaths.courses.view,
    secondTermLevelsList: SecondTermLearningPaths.levels.list,
    secondTermLevelsCreate: SecondTermLearningPaths.levels.create,
    secondTermLevelsEdit: SecondTermLearningPaths.levels.edit,
    secondTermLessonsList: SecondTermLearningPaths.lessons.list,
    secondTermLessonsListByLevel: SecondTermLearningPaths.lessons.listByLevel,
    secondTermLessonsCreate: SecondTermLearningPaths.lessons.create,
    secondTermLessonsEdit: SecondTermLearningPaths.lessons.edit,
    secondTermLessonsView: SecondTermLearningPaths.lessons.view,

    // Summer Camp Learning
    summerCampCoursesList: SummerCampLearningPaths.courses.list,
    summerCampCoursesCreate: SummerCampLearningPaths.courses.create,
    summerCampCoursesEdit: SummerCampLearningPaths.courses.edit,
    summerCampCoursesView: SummerCampLearningPaths.courses.view,
    summerCampLevelsList: SummerCampLearningPaths.levels.list,
    summerCampLevelsCreate: SummerCampLearningPaths.levels.create,
    summerCampLevelsEdit: SummerCampLearningPaths.levels.edit,
    summerCampLessonsList: SummerCampLearningPaths.lessons.list,
    summerCampLessonsListByLevel: SummerCampLearningPaths.lessons.listByLevel,
    summerCampLessonsCreate: SummerCampLearningPaths.lessons.create,
    summerCampLessonsEdit: SummerCampLearningPaths.lessons.edit,
    summerCampLessonsView: SummerCampLearningPaths.lessons.view,
});

// ============================================================================
// Type Exports
// ============================================================================

export type FirstTermLearningPaths = typeof FirstTermLearningPaths;
export type SecondTermLearningPaths = typeof SecondTermLearningPaths;
export type SummerCampLearningPaths = typeof SummerCampLearningPaths;
export type LearningPaths = typeof learningPaths;
