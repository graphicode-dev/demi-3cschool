import { CLASSROOM_PATH } from "../../navigation/constant";

/**
 * Acceptance Test paths
 * Under classroom layout
 */
export const acceptanceTestPaths = {
    main: () => `${CLASSROOM_PATH}/acceptance-exam`,
    waiting: () => `${CLASSROOM_PATH}/acceptance-exam/waiting`,
    rejected: () => `${CLASSROOM_PATH}/acceptance-exam/rejected`,
} as const;
