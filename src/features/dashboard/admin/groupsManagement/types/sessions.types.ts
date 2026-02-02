/**
 * Group Sessions Management Feature - Domain Types
 */

import { LocationType } from "./groups.types";

// ============================================================================
// Entity Types
// ============================================================================

/**
 * Session status enum
 */
export type SessionStatus = "PLANNED" | "POSTPONED" | "COMPLETED" | "CANCELLED";

/**
 * Session entity
 */
export interface GroupSession {
    id: number;
    sessionDate: string; // YYYY-MM-DD format
    startTime: string; // HH:mm:ss format
    endTime: string; // HH:mm:ss format
    status: SessionStatus | null;
    reason: string | null;
    isManual: boolean;
    lesson: {
        id: number;
        title: string;
    };
    group: {
        id: number;
        name: string;
    };
    teacher?: {
        id: number;
        name: string;
        email?: string;
    };
    createdAt: string;
    updatedAt: string;
}

// ============================================================================
// Metadata Types
// ============================================================================

/**
 * Filter field type
 */
export type SessionFilterFieldType =
    | "text"
    | "number"
    | "select"
    | "boolean"
    | "date";

/**
 * Filter definition for sessions metadata
 */
export interface SessionFilterDefinition {
    column: string;
    label: string;
    type: SessionFilterFieldType;
    options?: string[];
}

/**
 * Operator definitions by field type
 */
export interface SessionOperators {
    text: string[];
    number: string[];
    date: string[];
    select: string[];
    boolean: string[];
}

/**
 * Sessions metadata response data
 */
export interface SessionsMetadata {
    filters: SessionFilterDefinition[];
    operators: SessionOperators;
    searchableColumns: string[];
}

// ============================================================================
// Query Parameters
// ============================================================================

/**
 * List query parameters for sessions
 */
export interface SessionsListParams {
    // Filter parameters
    id?: number;
    name?: string;
    course_id?: number;
    level_id?: number;
    group_id?: number;
    location_type?: "online" | "offline";
    is_active?: boolean;
    max_capacity?: number;
    created_at?: string;

    // Search parameters
    search?: string;

    // Pagination parameters
    page?: number;
    limit?: number;

    // Sort parameters
    sort_by?: string;
    sort_order?: "asc" | "desc";
}

// ============================================================================
// Payload Types
// ============================================================================

/**
 * Create session payload
 */
export interface GroupSessionCreatePayload {
    group_id: number;
    lesson_id: number;
    session_date: string; // YYYY-MM-DD format
    start_time: string; // HH:mm format
    end_time: string; // HH:mm format
    location_type: LocationType;
    offline_location?: string; // Required when location_type is "offline"
}

/**
 * Reschedule session payload
 */
export interface GroupSessionReschedulePayload {
    session_date: string; // YYYY-MM-DD format
    start_time: string; // HH:mm format
    end_time: string; // HH:mm format
    reason?: string;
}

// ============================================================================
// Response DTOs
// ============================================================================

/**
 * Create session response
 */
export interface GroupSessionCreateResponse {
    id: number;
    sessionDate: string;
    startTime: string;
    endTime: string;
    status: SessionStatus | null;
    reason: string | null;
    isManual: boolean;
    lesson: {
        id: number;
        title: string;
    };
    group: {
        id: number;
        name: string;
    };
    teacher?: {
        id: number;
        name: string;
        email?: string;
    };
    createdAt: string;
    updatedAt: string;
}

/**
 * Reschedule session response
 */
export interface GroupSessionRescheduleResponse {
    id: number;
    sessionDate: string;
    startTime: string;
    endTime: string;
    status: SessionStatus;
    reason: string | null;
    isManual: boolean;
    lesson: {
        id: number;
        title: string;
    };
    group: {
        id: number;
        name: string;
    };
    teacher?: {
        id: number;
        name: string;
        email?: string;
    };
    createdAt: string;
    updatedAt: string;
}
