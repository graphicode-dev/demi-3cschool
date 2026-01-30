/**
 * Learning Resources Feature - Types
 *
 * Domain types for the learning resources feature.
 */

/**
 * Resource type enum
 */
export type ResourceType = "video" | "file" | "image" | "audio";

/**
 * Resource filter type (includes "all")
 */
export type ResourceFilter = "all" | ResourceType;

/**
 * Resource item
 */
export interface Resource {
    id: string;
    title: string;
    type: ResourceType;
    size?: string;
    duration?: string;
    url: string;
    thumbnailUrl?: string;
    sessionId: string;
    createdAt: string;
    updatedAt: string;
}

/**
 * Session with resources
 */
export interface Session {
    id: string;
    title: string;
    order: number;
    resourceCount: number;
    resources: Resource[];
    createdAt: string;
    updatedAt: string;
}

/**
 * Resources page state
 */
export interface ResourcesPageState {
    sessions: Session[];
    isLoading: boolean;
    error: string | null;
}

/**
 * Session resources page state
 */
export interface SessionResourcesPageState {
    session: Session | null;
    activeFilter: ResourceFilter;
    isLoading: boolean;
    error: string | null;
}
