/**
 * Training Centers Feature - Main Export
 */

// Types
export type {
    TrainingCenter,
    TrainingCenterCreatePayload,
    TrainingCenterUpdatePayload,
} from "./types";

// API
export {
    trainingCentersApi,
    trainingCentersKeys,
    useTrainingCentersList,
    useTrainingCenter,
    useCreateTrainingCenter,
    useUpdateTrainingCenter,
    useDeleteTrainingCenter,
} from "./api";

// Pages
export {
    TrainingCentersListPage,
    TrainingCentersCreatePage,
    TrainingCentersEditPage,
    TrainingCentersViewPage,
} from "./pages";

// Navigation
export { trainingCentersPaths, trainingCentersRoutes } from "./navigation";
