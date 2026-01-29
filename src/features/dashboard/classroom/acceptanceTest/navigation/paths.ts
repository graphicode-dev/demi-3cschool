import { CLASSROOM_PATH } from "../../navigation/constant";

/**
 * Acceptance Test paths
 * Under classroom layout
 */
export const acceptanceTest = {
    main: () => `${CLASSROOM_PATH}/acceptance-exam`,
    waiting: () => `${CLASSROOM_PATH}/acceptance-exam/waiting`,
    rejected: () => `${CLASSROOM_PATH}/acceptance-exam/rejected`,
} as const;

export const acceptanceTestPaths = {
    main: acceptanceTest.main,
    waiting: acceptanceTest.waiting,
    rejected: acceptanceTest.rejected,
};
