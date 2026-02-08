/**
 * Students Feature - Types
 */

export interface StudentRoleRef {
    id: number;
    name: string;
    caption: string;
}

export interface StudentUserInformation {
    id: number;
    parentPhoneCode: string | null;
    parentPhoneNumber: string | null;
    parentEmail: string | null;
    schoolName: string | null;
    dateOfBirth: string | null;
    gender: string | null;
    grade?: {
        id: number;
        name: string;
    } | null;
    governorate?: {
        id: number;
        name: string;
    } | null;
    country?: {
        id: number;
        name: string;
    } | null;
    acceptanceExam: unknown;
    nationality: string | null;
    address: string | null;
    emergencyContactName: string | null;
    emergencyContactPhone: string | null;
    bio: string | null;
    socialLinks: unknown;
    createdAt: string | null;
    updatedAt: string | null;
}

export interface StudentCreatePayload {
    name: string;
    email: string;
    password: string;
}

export interface StudentUpdatePayload {
    name?: string;
    email?: string;
    password?: string;
}
