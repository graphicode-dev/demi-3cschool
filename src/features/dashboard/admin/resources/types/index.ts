/**
 * Resources Feature - Domain Types
 *
 * Types for the Resources domain including:
 * - ResourceFolder entity
 * - Resource entity
 * - Create/Update payloads
 * - Query parameters
 */

// ============================================================================
// Entity Types
// ============================================================================

/**
 * Resource type enum
 */
export type ResourceType = "video" | "file" | "image" | "audio";

/**
 * Grade reference
 */
export interface GradeRef {
    id: number;
    name: string;
    code?: string;
}

/**
 * Programs Curriculum reference
 */
export interface ProgramCurriculumRef {
    id: number;
    name: string;
    caption: string;
}

/**
 * Resource Folder entity
 */
export interface ResourceFolder {
    id: number;
    name: string;
    description?: string;
    isActive: boolean;
    resourcesCount: number;
    grade: GradeRef;
    programsCurriculum: ProgramCurriculumRef;
    createdAt: string;
    updatedAt: string;
}

/**
 * Resource entity
 */
export interface Resource {
    id: number;
    title: string;
    description: string;
    type: ResourceType;
    fileUrl: string;
    fileName: string;
    fileSize: number;
    folderId: number;
    folder?: ResourceFolder;
    sortOrder?: number;
    isActive?: boolean;
    uploadedAt: string;
    createdAt: string;
    updatedAt: string;
}

// ============================================================================
// Query Parameters
// ============================================================================

/**
 * List query parameters for folders
 */
export interface FoldersListParams {
    gradeId?: number;
    programId?: number;
    page?: number;
}

/**
 * List query parameters for resources
 */
export interface ResourcesListParams {
    folderId: string | number;
    type?: ResourceType | "all";
    page?: number;
    search?: string;
}

// ============================================================================
// Payload Types
// ============================================================================

/**
 * Create folder payload
 */
export interface FolderCreatePayload {
    name: string;
    gradeId: number;
    programCurriculumId: number;
    description?: string;
    isActive: number;
}

/**
 * Update folder payload
 */
export interface FolderUpdatePayload {
    name?: string;
    gradeId?: number;
    programCurriculumId?: number;
    description?: string;
    isActive?: number;
}

/**
 * Create resource payload
 */
export interface ResourceCreatePayload {
    title: string;
    description: string;
    type: ResourceType;
    folderId: number;
    sortOrder: number;
    isActive: number;
    file: File;
}

/**
 * Update resource payload
 */
export interface ResourceUpdatePayload {
    title?: string;
    description?: string;
    type?: ResourceType;
    folderId?: number;
    sortOrder?: number;
    isActive?: number;
    file?: File;
}

/**
 * Move resource payload
 */
export interface MoveResourcePayload {
    resourceId: number;
    targetFolderId: number;
}
