/**
 * Lessons Feature - Domain Types
 *
 * Types for the Lessons domain including:
 * - Lesson entity
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
 * Level reference in lesson
 */
export interface LessonLevelRef {
    id: string;
    title: string;
}

/**
 * Course reference in grouped response
 */
export interface LessonCourseRef {
    id: string;
    title: string;
}

/**
 * Course reference type (can be null)
 */
export type LessonLevelRefOrNull = LessonLevelRef | null;

/**
 * Lesson entity
 */
export interface Lesson {
    id: string;
    level: LessonLevelRef;
    title: string;
    description: string;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
}

/**
 * Grouped lessons by course
 */
export interface LessonGroup {
    level: LessonLevelRefOrNull;
    lessons: Lesson[];
}

// ============================================================================
// Metadata Types
// ============================================================================

/**
 * Filter definition for lessons metadata
 */
export interface LessonFilterDefinition {
    column: string;
    label: string;
    type: "text" | "select" | "number" | "boolean" | "date";
    operators: string[];
    searchable: boolean;
}

/**
 * Operator definitions
 */
export interface LessonOperators {
    [key: string]: string;
}

/**
 * Field type definition
 */
export interface LessonFieldType {
    label: string;
    component: string;
    validation: string;
}

/**
 * Field types map
 */
export interface LessonFieldTypes {
    [key: string]: LessonFieldType;
}

/**
 * Lessons metadata response data
 */
export interface LessonsMetadata {
    filters: LessonFilterDefinition[];
    operators: LessonOperators;
    fieldTypes: LessonFieldTypes;
}

// ============================================================================
// Query Parameters
// ============================================================================

/**
 * List query parameters for lessons
 */
export interface LessonsListParams {
    page?: number;
    type?: "group";
    programs_curriculum?: ProgramsCurriculum;
}

/**
 * List by level ID parameters
 */
export interface LessonsByLevelParams {
    levelId: string;
    page?: number;
    type?: "group";
    programs_curriculum?: ProgramsCurriculum;
}

// ============================================================================
// Payload Types
// ============================================================================

/**
 * Create lesson payload
 */
export interface LessonCreatePayload {
    levelId: string;
    title: string;
    description: string;
    isActive: boolean;
}

/**
 * Update lesson payload
 */
export interface LessonUpdatePayload {
    levelId?: string;
    title?: string;
    description?: string;
    isActive?: boolean;
}
