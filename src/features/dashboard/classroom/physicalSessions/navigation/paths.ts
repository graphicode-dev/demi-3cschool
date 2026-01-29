/**
 * Physical Sessions paths
 * Routes for the physical sessions feature under classroom
 */
export const physicalSessions = {
    main: () => "/dashboard/classroom/physical-sessions",
} as const;

export const physicalSessionsPaths = {
    main: physicalSessions.main,
};
