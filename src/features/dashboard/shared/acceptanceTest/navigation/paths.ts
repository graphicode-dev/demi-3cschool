/**
 * Acceptance Test paths
 * These are public routes (not under dashboard) for the acceptance exam flow
 */
export const acceptanceTest = {
    main: () => "/acceptance-exam",
    waiting: () => "/acceptance-exam/waiting",
    rejected: () => "/acceptance-exam/rejected",
} as const;

export const acceptanceTestPaths = {
    main: acceptanceTest.main,
    waiting: acceptanceTest.waiting,
    rejected: acceptanceTest.rejected,
};
