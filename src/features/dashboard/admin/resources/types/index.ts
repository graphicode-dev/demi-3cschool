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
    id: string;
    name: string;
}

/**
 * Term reference
 */
export interface TermRef {
    id: string;
    name: string;
}

/**
 * Resource Folder entity
 */
export interface ResourceFolder {
    id: string;
    name: string;
    description?: string;
    grade: GradeRef;
    term: TermRef;
    resourceCount: number;
    createdAt: string;
    updatedAt: string;
}

/**
 * Resource entity
 */
export interface Resource {
    id: string;
    title: string;
    description: string;
    type: ResourceType;
    fileUrl: string;
    fileName: string;
    fileSize: number;
    folderId: string;
    folder?: ResourceFolder;
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
    gradeId?: string;
    termId?: string;
    page?: number;
}

/**
 * List query parameters for resources
 */
export interface ResourcesListParams {
    folderId: string;
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
    gradeId: string;
    termId: string;
    description?: string;
}

/**
 * Update folder payload
 */
export interface FolderUpdatePayload {
    name?: string;
    gradeId?: string;
    termId?: string;
    description?: string;
}

/**
 * Create resource payload
 */
export interface ResourceCreatePayload {
    title: string;
    description: string;
    type: ResourceType;
    folderId: string;
    file: File;
}

/**
 * Update resource payload
 */
export interface ResourceUpdatePayload {
    title?: string;
    description?: string;
    type?: ResourceType;
    file?: File;
}

/**
 * Move resource payload
 */
export interface MoveResourcePayload {
    resourceId: string;
    targetFolderId: string;
}
