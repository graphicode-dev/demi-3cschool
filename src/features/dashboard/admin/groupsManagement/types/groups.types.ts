/**
 * Groups Management Feature - Domain Types
 *
 * Types for the Groups domain including:
 * - Group entity
 * - List/Detail response types
 * - Create/Update payloads
 * - Query parameters
 * - Metadata types
 * - Recommendation types
 */

// ============================================================================
// Entity Types
// ============================================================================

/**
 * Group type enum
 */
export type GroupType = "regular" | "semi_private" | "private";

/**
 * Location type enum
 */
export type LocationType = "online" | "offline" | "hybrid";

/**
 * Day of week enum
 */
export type DayOfWeek =
    | "sunday"
    | "monday"
    | "tuesday"
    | "wednesday"
    | "thursday"
    | "friday"
    | "saturday";

/**
 * Course reference in group
 */
export interface GroupCourseRef {
    id: string;
    title: string;
}

/**
 * Level reference in group
 */
export interface GroupLevelRef {
    id: string;
    title: string;
}

/**
 * Group schedule entity
 */
export interface GroupSchedule {
    id: string;
    groupId: string;
    dayOfWeek: DayOfWeek;
    startTime: string;
    endTime: string;
    createdAt: string;
    updatedAt: string;
}

/**
 * Age rule for group
 */
export interface GroupAgeRule {
    minAge: number;
    maxAge: number;
}

/**
 * Group entity
 */
export interface Group {
    id: string;
    courseId: string;
    levelId: string;
    name: string;
    maxCapacity: number;
    locationType: LocationType | null;
    groupType: GroupType;
    isActive: boolean | null;
    course: GroupCourseRef;
    level: GroupLevelRef;
    schedules: GroupSchedule[];
    ageRule: GroupAgeRule;
    createdAt: string;
    updatedAt: string;
}

// ============================================================================
// Metadata Types
// ============================================================================

/**
 * Filter field type
 */
export type GroupFilterFieldType =
    | "text"
    | "number"
    | "select"
    | "boolean"
    | "date";

/**
 * Filter definition for groups metadata
 */
export interface GroupFilterDefinition {
    column: string;
    label: string;
    type: GroupFilterFieldType;
    options?: string[];
}

/**
 * Operator definitions by field type
 */
export interface GroupOperators {
    text: string[];
    number: string[];
    date: string[];
    select: string[];
    boolean: string[];
}

/**
 * Groups metadata response data
 */
export interface GroupsMetadata {
    filters: GroupFilterDefinition[];
    operators: GroupOperators;
    searchableColumns: string[];
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
 * List response wrapper (non-paginated)
 */
export interface ListResponse<T> {
    success: boolean;
    message: string;
    data: T[];
}

// ============================================================================
// Query Parameters
// ============================================================================

/**
 * List query parameters for groups
 */
export interface GroupsListParams {
    groupType: GroupType;
    page?: number;
}

/**
 * List query parameters for groups by level
 */
export interface GroupsByLevelParams {
    levelId: string;
    groupType?: GroupType;
    page?: number;
}

// ============================================================================
// Payload Types
// ============================================================================

/**
 * Schedule payload for create/update
 */
export interface GroupSchedulePayload {
    day_of_week: DayOfWeek;
    startTime: string;
    endTime: string;
}

/**
 * Create group payload
 */
export interface GroupCreatePayload {
    course_id: string;
    level_id: string;
    name: string;
    maxCapacity: number;
    groupType: GroupType;
    min_age: number;
    max_age: number;
    groupSchedules: GroupSchedulePayload[];
}

/**
 * Update group payload
 */
export interface GroupUpdatePayload {
    course_id?: string;
    level_id?: string;
    name?: string;
    maxCapacity?: number;
    groupType?: GroupType;
    min_age?: number;
    max_age?: number;
    groupSchedules?: GroupSchedulePayload[];
}

// ============================================================================
// Recommendation Types
// ============================================================================

/**
 * Recommendation request payload
 */
export interface GroupRecommendPayload {
    course_id: string;
    level_id: string;
    group_type: GroupType;
    capacity: number;
    limit?: number;
}

/**
 * Feature scores for recommendation
 */
export interface RecommendationFeatureScores {
    courseMatch: number;
    levelMatch: number;
    locationSimilarity: number;
    groupTypeSimilarity: number;
    capacitySimilarity: number;
}

/**
 * Single recommendation item
 */
export interface GroupRecommendation {
    group: Group;
    similarityScore: number;
    explanationOfMatch: string[];
    featureScores: RecommendationFeatureScores;
}

/**
 * Recommendation weights
 */
export interface RecommendationWeights {
    course: number;
    level: number;
    location: number;
    groupType: number;
    capacity: number;
}

/**
 * Recommendations response data
 */
export interface GroupRecommendationsData {
    recommendations: GroupRecommendation[];
    weights: RecommendationWeights;
    totalFound: number;
}
