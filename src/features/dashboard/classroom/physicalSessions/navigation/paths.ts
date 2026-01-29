import { CLASSROOM_PATH } from "../../navigation/constant";

/**
 * Physical Sessions paths
 * Routes for the physical sessions feature under classroom
 */
export const physicalSessions = {
    main: () => `${CLASSROOM_PATH}/physical-sessions`,
} as const;

export const physicalSessionsPaths = {
    main: physicalSessions.main,
};
