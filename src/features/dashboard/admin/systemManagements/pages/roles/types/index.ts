// ============================================================================
// Role Types
// ============================================================================

export interface Role {
    id: number;
    name: string;
    caption: string;
    squadType: string | null;
    squadTypeLabel: string | null;
    scope: string;
    scopeLabel: string;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
}

// ============================================================================
// Role Metadata Types
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

export interface RoleMetadata {
    filters: MetadataFilter[];
    operators: Record<string, string>;
    fieldTypes: Record<string, MetadataFieldType>;
}

// ============================================================================
// Mutation Payloads
// ============================================================================

export interface CreateRolePayload {
    name: string;
    caption: string;
    squad_type: "CORE" | "EXECUTION";
    color?: string;
    scope: "SQUAD" | "GLOBAL";
}

export interface UpdateRolePayload {
    name?: string;
    caption?: string;
    squad_type?: "CORE" | "EXECUTION";
    scope?: "SQUAD" | "GLOBAL";
}
