/**
 * Training Centers Feature - API Module
 */

// Types
export type {
    TrainingCenter,
    TrainingCenterCreatePayload,
    TrainingCenterUpdatePayload,
} from "../types";

// Query Keys
export { trainingCentersKeys, type TrainingCentersQueryKey } from "./trainingCenters.keys";

// API Functions
export { trainingCentersApi } from "./trainingCenters.api";

// Query Hooks
export { useTrainingCentersList, useTrainingCenter } from "./trainingCenters.queries";

// Mutation Hooks
export {
    useCreateTrainingCenter,
    useUpdateTrainingCenter,
    useDeleteTrainingCenter,
} from "./trainingCenters.mutations";
