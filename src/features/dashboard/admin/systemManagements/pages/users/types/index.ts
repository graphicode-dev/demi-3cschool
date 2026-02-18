// ============================================================================
// User Types
// ============================================================================

export interface UserRole {
    id: number;
    name: string;
    caption: string;
}

export interface UserGrade {
    id: number;
    name: string;
}

export interface UserGovernorate {
    id: number;
    name: string;
}

export interface UserCountry {
    id: number;
    name: string;
}

export interface UserInformation {
    id: number;
    parentPhoneCode: string;
    parentPhoneNumber: string;
    parentEmail: string;
    schoolName: string;
    dateOfBirth: string;
    gender: string;
    grade: UserGrade | null;
    governorate: UserGovernorate | null;
    hasAcceptanceExam: boolean;
    nationality: string | null;
    address: string | null;
    country: UserCountry | null;
    emergencyContactName: string | null;
    emergencyContactPhone: string | null;
    bio: string | null;
    socialLinks: string | null;
    createdAt: string;
    updatedAt: string;
}

export interface UserSquad {
    id: number;
    name: string;
}

export interface User {
    id: number;
    name: string;
    email: string;
    phoneVerified: boolean;
    emailVerified: boolean;
    image: string;
    role: UserRole;
    squad: UserSquad | null;
    scope: string;
    userInformation: UserInformation | null;
    createdAt: string;
    updatedAt: string;
}
