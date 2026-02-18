import type { User } from "../../types";

// ============================================================================
// Teacher Types (reuses User from parent types)
// ============================================================================

export type Teacher = User;

// ============================================================================
// Teacher Metadata Types
// ============================================================================

export interface MetadataFilter {
    column: string;
    label: string;
    type: string;
    operators: string[];
    searchable: boolean;
}

export interface MetadataFieldType {
    operators: string[];
    inputType: string;
}

export interface TeacherMetadata {
    filters: MetadataFilter[];
    operators: Record<string, string>;
    fieldTypes: Record<string, MetadataFieldType>;
}

// ============================================================================
// Mutation Payloads
// ============================================================================

export interface CreateTeacherPayload {
    name: string;
    email: string;
    password: string;
}

export interface UpdateTeacherPayload {
    name?: string;
    email?: string;
    password?: string;
}
