/**
 * Teachers Feature - Types
 */

export interface TeacherRoleRef {
    id: number;
    name: string;
    caption: string;
}

export interface TeachersListParams {
    page?: number;
    search?: string;
}

export interface TeacherCreatePayload {
    name: string;
    email: string;
    password: string;
    role_id: number;
}

export interface TeacherUpdatePayload {
    name?: string;
    email?: string;
    role_id?: number;
}
