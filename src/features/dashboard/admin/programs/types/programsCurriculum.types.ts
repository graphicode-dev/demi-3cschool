/**
 * Programs Curriculum Feature - Domain Types
 *
 * Types for the Programs Curriculum domain including:
 * - ProgramCurriculum entity
 * - List/Detail response types
 * - Create/Update payloads
 * - Query parameters
 * - Metadata types
 */

// ============================================================================
// Entity Types
// ============================================================================

/**
 * Programs Curriculum entity
 */
export interface ProgramCurriculum {
    id: number;
    name: string;
    caption: string;
    description: string;
    isActive: number | boolean;
    createdAt: string | null;
    updatedAt: string | null;
}

// ============================================================================
// Metadata Types
// ============================================================================

/**
 * Filter definition for programs curriculum metadata
 */
export interface ProgramCurriculumFilterDefinition {
    column: string;
    label: string;
    type: "text" | "select" | "boolean" | "date";
    operators: string[];
    searchable: boolean;
}

/**
 * Operator definitions
 */
export interface ProgramCurriculumOperators {
    [key: string]: string;
}

/**
 * Field type definition
 */
export interface ProgramCurriculumFieldType {
    label: string;
    component: string;
    validation: string;
}

/**
 * Field types map
 */
export interface ProgramCurriculumFieldTypes {
    [key: string]: ProgramCurriculumFieldType;
}

/**
 * Programs Curriculum metadata response data
 */
export interface ProgramsCurriculumMetadata {
    filters: ProgramCurriculumFilterDefinition[];
    operators: ProgramCurriculumOperators;
    fieldTypes: ProgramCurriculumFieldTypes;
}

// ============================================================================
// API Response Types
// ============================================================================

/**
 * Paginated data structure
 */
export interface ProgramCurriculumPaginatedData<T> {
    perPage: number;
    currentPage: number;
    lastPage: number;
    nextPageUrl: string | null;
    items: T[];
}

/**
 * Paginated response wrapper
 */
export interface ProgramCurriculumPaginatedResponse<T> {
    success: boolean;
    message: string;
    data: ProgramCurriculumPaginatedData<T>;
}

// ============================================================================
// Query Parameters
// ============================================================================

/**
 * List query parameters for programs curriculum
 */
export interface ProgramsCurriculumListParams {
    page?: number;
    pageSize?: number;
    search?: string;
    sortBy?: string;
    sortOrder?: "asc" | "desc";
    [key: string]: unknown;
}

// ============================================================================
// Payload Types
// ============================================================================

/**
 * Create programs curriculum payload
 */
export interface ProgramCurriculumCreatePayload {
    name: string;
    caption: string;
    description: string;
    is_active: number | boolean;
}

/**
 * Update programs curriculum payload
 */
export interface ProgramCurriculumUpdatePayload {
    name?: string;
    caption?: string;
    description?: string;
    is_active?: number | boolean;
}
