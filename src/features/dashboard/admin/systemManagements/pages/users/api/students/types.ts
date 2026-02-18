import type { User } from "../../types";

// ============================================================================
// Student Types (reuses User from parent types)
// ============================================================================

export type Student = User;

// ============================================================================
// Mutation Payloads
// ============================================================================

export interface StudentUserInformationPayload {
    governorate_id?: number;
    phone_code?: string;
    phone_number?: string;
    date_of_birth?: string;
    grade_id?: number;
    gender?: string;
}

export interface CreateStudentPayload {
    name: string;
    email: string;
    password: string;
    user_information?: StudentUserInformationPayload;
}

export interface UpdateStudentPayload {
    name?: string;
    email?: string;
    password?: string;
    user_information?: StudentUserInformationPayload;
}
