/**
 * Students Feature - Main Export
 */

// Types
export type {
    StudentRoleRef,
    StudentUserInformation,
    StudentsListParams,
    StudentCreatePayload,
    StudentUpdatePayload,
} from "./types";

// API
export {
    studentsApi,
    studentsKeys,
    useStudentsList,
    useStudent,
    useCreateStudent,
    useUpdateStudent,
    useDeleteStudent,
} from "./api";

// Pages
export {
    StudentsListPage,
    StudentsCreatePage,
    StudentsEditPage,
    StudentsViewPage,
} from "./pages";

// Navigation
export { studentsPaths, studentsRoutes } from "./navigation";
