import { CLASSROOM_PATH } from "../../navigation/constant";

/**
 * Self Study paths
 * Routes for the self study feature under classroom
 */
export const selfStudyPaths = {
    main: () => `${CLASSROOM_PATH}/self-study`,
    lesson: (sessionId: number | string) =>
        `${CLASSROOM_PATH}/self-study/lesson/${sessionId}`,
} as const;
