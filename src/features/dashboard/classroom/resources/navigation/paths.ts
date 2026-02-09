/**
 * Learning Resources Feature - Paths
 *
 * Type-safe path builders for the resources feature.
 */

import { CLASSROOM_PATH } from "@/features/dashboard/classroom/navigation/constant";

export const resourcesPaths = {
    root: () => `${CLASSROOM_PATH}/resources`,
    session: (sessionId: string) => `${CLASSROOM_PATH}/resources/${sessionId}`,
};

export type ResourcesPaths = typeof resourcesPaths;
