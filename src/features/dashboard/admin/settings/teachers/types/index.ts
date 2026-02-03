/**
 * Teachers Feature - Types
 */

export interface TeacherRoleRef {
    id: number;
    name: string;
    caption: string;
}

export interface Teacher {
    id: number;
    name: string;
    email: string;
    phoneVerified: boolean;
    emailVerified: boolean;
    image?: string | null;
    role: TeacherRoleRef;
    userInformation?: unknown;
    createdAt: string;
    updatedAt: string;
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
    role_id?:number
}
