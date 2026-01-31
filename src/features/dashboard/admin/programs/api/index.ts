/**
 * Programs Feature - API Module
 *
 * Public exports for the Programs API layer.
 * Import from '@/features/dashboard/admin/programs/api'.
 *
 * @example
 * ```ts
 * import {
 *     useProgramsCurriculumList,
 *     useProgramCurriculum,
 *     programsCurriculumKeys,
 * } from '@/features/dashboard/admin/programs/api';
 * ```
 */

// Types
export type {
    ProgramCurriculum,
    ProgramsCurriculumListParams,
    ProgramCurriculumCreatePayload,
    ProgramCurriculumUpdatePayload,
    ProgramsCurriculumMetadata,
    ProgramCurriculumPaginatedData,
    ProgramCurriculumPaginatedResponse,
} from "../types";

// Query Keys
export {
    programsCurriculumKeys,
    type ProgramsCurriculumQueryKey,
} from "./programsCurriculum.keys";

// API Functions
export { programsCurriculumApi } from "./programsCurriculum.api";

// Query Hooks
export {
    useProgramsCurriculumMetadata,
    useProgramsCurriculumList,
    useProgramCurriculum,
} from "./programsCurriculum.queries";

// Mutation Hooks
export {
    useCreateProgramCurriculum,
    useUpdateProgramCurriculum,
    useDeleteProgramCurriculum,
} from "./programsCurriculum.mutations";

// Legacy export for backward compatibility
export const programsKeys = {};
