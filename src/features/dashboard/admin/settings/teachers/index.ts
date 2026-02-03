/**
 * Teachers Feature - Main Export
 */

// Types
export type {
    Teacher,
    TeacherRoleRef,
    TeachersListParams,
    TeacherCreatePayload,
    TeacherUpdatePayload,
} from "./types";

// API
export {
    teachersApi,
    teachersKeys,
    useTeachersList,
    useTeacher,
    useCreateTeacher,
    useUpdateTeacher,
    useDeleteTeacher,
} from "./api";

// Pages
export {
    TeachersListPage,
    TeachersCreatePage,
    TeachersEditPage,
    TeachersViewPage,
} from "./pages";

// Navigation
export { teachersPaths, teachersRoutes } from "./navigation";
