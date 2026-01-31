/**
 * Learning Resources Feature - Paths
 *
 * Type-safe path builders for the resources feature.
 */

import { CLASSROOM_PATH } from "@/features/dashboard/classroom/navigation/constant";

export const RESOURCES_BASE_PATH = `${CLASSROOM_PATH}/resources`;

export const resourcesPaths = {
    root: () => RESOURCES_BASE_PATH,
    session: (sessionId: string) => `${RESOURCES_BASE_PATH}/${sessionId}`,
};

export type ResourcesPaths = typeof resourcesPaths;
