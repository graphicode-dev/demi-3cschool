import { CLASSROOM_PATH } from "../../navigation/constant";

/**
 * Virtual Sessions paths
 * Routes for the virtual sessions feature under classroom
 */
export const virtualSessionsPaths = {
    main: () => `${CLASSROOM_PATH}/virtual-sessions`,
    recording: (sessionId: number | string) =>
        `${CLASSROOM_PATH}/virtual-sessions/recording/${sessionId}`,
} as const;
