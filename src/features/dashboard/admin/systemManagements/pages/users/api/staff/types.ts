import type { User } from "../../types";

// ============================================================================
// Staff Types (reuses User from parent types)
// ============================================================================

export type Staff = User;

// ============================================================================
// Staff Metadata Types
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

export interface StaffMetadata {
    filters: MetadataFilter[];
    operators: Record<string, string>;
    fieldTypes: Record<string, MetadataFieldType>;
}

// ============================================================================
// Mutation Payloads
// ============================================================================

export interface CreateStaffPayload {
    name: string;
    email: string;
    password: string;
    roleId: string;
}

export interface UpdateStaffPayload {
    name?: string;
    email?: string;
    password?: string;
    roleId?: string;
}
