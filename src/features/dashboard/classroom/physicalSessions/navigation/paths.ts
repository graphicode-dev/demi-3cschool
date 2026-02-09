import { CLASSROOM_PATH } from "../../navigation/constant";

/**
 * Physical Sessions paths
 * Routes for the physical sessions feature under classroom
 */
export const physicalSessionsPaths = {
    main: () => `${CLASSROOM_PATH}/physical-sessions`,
} as const;
