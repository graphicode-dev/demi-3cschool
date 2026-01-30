/**
 * Student Types
 *
 * Type definitions for the students endpoint in System Managements.
 */

// ============================================================================
// Role Types
// ============================================================================

export interface StudentRole {
    id: number;
    name: string;
    caption: string;
}

// ============================================================================
// User Information Types
// ============================================================================

export interface UserInformation {
    // Add fields as needed when backend provides them
    [key: string]: unknown;
}

// ============================================================================
// Student Types
// ============================================================================

export interface Student {
    id: number;
    name: string;
    email: string;
    phoneVerified: boolean;
    emailVerified: boolean;
    image: string;
    role: StudentRole;
    userInformation: UserInformation | null;
    permissions: string[];
    createdAt: string;
    updatedAt: string;
}

// ============================================================================
// API Response Types
// ============================================================================

export interface StudentListParams {
    page?: number;
    perPage?: number;
    search?: string;
}

export interface PaginatedStudentData {
    perPage: number;
    currentPage: number;
    lastPage: number;
    nextPageUrl: string | null;
    items: Student[];
}

export interface StudentListResponse {
    success: boolean;
    message: string;
    data: Student[] | PaginatedStudentData;
}
