/**
 * Self Study paths
 * Routes for the self study feature under classroom
 */
export const selfStudy = {
    main: () => "/dashboard/classroom/self-study",
    lesson: (sessionId: number | string) =>
        `/dashboard/classroom/self-study/lesson/${sessionId}`,
} as const;

export const selfStudyPaths = {
    main: selfStudy.main,
    lesson: selfStudy.lesson,
};
