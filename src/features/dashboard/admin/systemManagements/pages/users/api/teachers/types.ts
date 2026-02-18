import type { User } from "../../types";
import type { MetadataFilter, MetadataFieldType } from "../staff/types";

// ============================================================================
// Teacher Types (reuses User from parent types)
// ============================================================================

export type Teacher = User;

// ============================================================================
// Teacher Metadata Types
// ============================================================================

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
