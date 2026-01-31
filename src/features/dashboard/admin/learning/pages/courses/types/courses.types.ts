/**
 * Courses Feature - Domain Types
 *
 * Types for the Courses domain including:
 * - Course entity
 * - List/Detail response types
 * - Create/Update payloads
 * - Query parameters
 * - Metadata types
 */

import { ProgramsCurriculum } from "@/features/dashboard/admin/learning/types";

// ============================================================================
// Entity Types
// ============================================================================

/**
 * Course image object
 */
export interface CourseImage {
    id: string;
    name: string;
    fileName: string;
    mimeType: string;
    size: number;
    humanReadableSize: string;
    url: string;
}

/**
 * Course entity
 */
export interface Course {
    id: string;
    title: string;
    description: string;
    slug: string;
    isActive: boolean;
    image: CourseImage | null;
    createdAt: string;
    updatedAt: string;
}

// ============================================================================
// Metadata Types
// ============================================================================

/**
 * Filter definition for courses metadata
 */
export interface CourseFilterDefinition {
    column: string;
    label: string;
    type: "text" | "select" | "boolean" | "date";
    operators: string[];
    searchable: boolean;
}

/**
 * Operator definitions
 */
export interface CourseOperators {
    [key: string]: string;
}

/**
 * Field type definition
 */
export interface CourseFieldType {
    label: string;
    component: string;
    validation: string;
}

/**
 * Field types map
 */
export interface CourseFieldTypes {
    [key: string]: CourseFieldType;
}

/**
 * Courses metadata response data
 */
export interface CoursesMetadata {
    filters: CourseFilterDefinition[];
    operators: CourseOperators;
    fieldTypes: CourseFieldTypes;
}

// ============================================================================
// API Response Types
// ============================================================================

/**
 * Paginated data structure
 */
export interface PaginatedData<T> {
    perPage: number;
    currentPage: number;
    lastPage: number;
    nextPageUrl: string | null;
    items: T[];
}

/**
 * Paginated response wrapper
 */
export interface PaginatedResponse<T> {
    success: boolean;
    message: string;
    data: PaginatedData<T>;
}

// ============================================================================
// Query Parameters
// ============================================================================

/**
 * Program type for courses
 * @deprecated Use ProgramsCurriculum instead
 */
export type ProgramType = ProgramsCurriculum;

/**
 * List query parameters for courses
 * Extends global ListQueryParams for search/sort/filter support
 */
export interface CoursesListParams {
    page?: number;
    pageSize?: number;
    search?: string;
    sortBy?: string;
    sortOrder?: "asc" | "desc";
    programs_curriculum?: ProgramsCurriculum;
    [key: string]: unknown;
}

/**
 * List by program type parameters
 */
export interface CoursesByProgramParams {
    programType: ProgramType;
    page?: number;
}

// ============================================================================
// Payload Types
// ============================================================================

/**
 * Create course payload (FormData)
 */
export interface CourseCreatePayload {
    programCurriculumId: string;
    title: string;
    description: string;
    slug: string;
    isActive: boolean;
    image?: File;
}

/**
 * Update course payload (FormData)
 */
export interface CourseUpdatePayload {
    title?: string;
    description?: string;
    slug?: string;
    isActive?: boolean;
    image?: File;
}
