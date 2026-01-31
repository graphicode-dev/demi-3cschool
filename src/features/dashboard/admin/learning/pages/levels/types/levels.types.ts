/**
 * Levels Feature - Domain Types
 *
 * Types for the Levels domain including:
 * - Level entity
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
 * Course reference in level
 */
export interface LevelCourseRef {
    id: string;
    title: string;
    programsCurriculum: ProgramsCurriculum;
}

/**
 * Full course object in grouped response
 */
export interface LevelCourse {
    id: string;
    program_curriculum_id: string;
    title: string;
    description: string;
    slug: string;
    is_active: boolean;
    created_at: string;
    updated_at: string;
}

/**
 * Level entity
 */
export interface Level {
    id: string;
    level: LevelCourseRef;
    title: string;
    description: string;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
}

/**
 * Grouped levels by course
 */
export interface LevelGroup {
    course: LevelCourse;
    levels: Level[];
}

// ============================================================================
// Metadata Types
// ============================================================================

/**
 * Filter definition for levels metadata
 */
export interface LevelFilterDefinition {
    column: string;
    label: string;
    type: "text" | "select" | "number" | "boolean" | "date";
    operators: string[];
    searchable: boolean;
}

/**
 * Operator definitions
 */
export interface LevelOperators {
    [key: string]: string;
}

/**
 * Field type definition
 */
export interface LevelFieldType {
    label: string;
    component: string;
    validation: string;
}

/**
 * Field types map
 */
export interface LevelFieldTypes {
    [key: string]: LevelFieldType;
}

/**
 * Levels metadata response data
 */
export interface LevelsMetadata {
    filters: LevelFilterDefinition[];
    operators: LevelOperators;
    fieldTypes: LevelFieldTypes;
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

/**
 * Grouped response wrapper (when type=group)
 */
export interface GroupedResponse<T> {
    success: boolean;
    message: string;
    data: T[];
}

// ============================================================================
// Query Parameters
// ============================================================================

/**
 * List query parameters for levels
 */
export interface LevelsListParams {
    page?: number;
    type?: "group";
    programs_curriculum?: ProgramsCurriculum;
}

/**
 * List by course ID parameters
 */
export interface LevelsByCourseParams {
    courseId: string;
    page?: number;
    type?: "group";
    programs_curriculum?: ProgramsCurriculum;
}

/**
 * Level by grade response item
 */
export interface LevelByGrade {
    id: number;
    title: string;
    slug: string;
    description: string;
    isActive: boolean;
    programsCurriculum: {
        id: number;
        name: string;
    };
    grade: {
        id: number;
        name: string;
        code: string;
    };
    createdAt: string;
    updatedAt: string;
}

// ============================================================================
// Payload Types
// ============================================================================

/**
 * Create level payload
 */
export interface LevelCreatePayload {
    courseId: string;
    title: string;
    description: string;
    isActive: boolean;
}

/**
 * Update level payload
 */
export interface LevelUpdatePayload {
    courseId?: string;
    title?: string;
    description?: string;
    isActive?: boolean;
}
