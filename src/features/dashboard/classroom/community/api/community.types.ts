/**
 * Community Feature - API Types
 *
 * Types matching the backend API responses for community feature.
 * These types are used by API functions, queries, and mutations.
 */

// ============================================================================
// Enums
// ============================================================================

export type UserRole = "student" | "teacher" | "admin";
export type Audience = "public" | "group";
export type PostCategory =
    | "general"
    | "project_help"
    | "homework"
    | "coding_tip"
    | "resource";
export type PostStatus = "open" | "solved" | "announcement";
export type ChannelAccessType = "general" | "restricted";
export type ChannelGradeRange =
    | "grade_1_3"
    | "grade_4_6"
    | "grade_7_9"
    | "grade_10_12"
    | "all";
export type ReportStatus = "pending" | "reviewed" | "resolved" | "dismissed";

// ============================================================================
// Entity Types
// ============================================================================

/**
 * User reference in community context
 */
export interface CommunityUserRef {
    id: number;
    name: string;
    avatar: string | null;
    role?: UserRole;
}

/**
 * Channel entity from API
 */
export interface Channel {
    id: number;
    name: string;
    description: string;
    owner: CommunityUserRef;
    admins: CommunityUserRef[];
    followers_count: number;
    banner: string | null;
    thumbnail: string | null;
    is_following: boolean;
    is_admin: boolean;
    access_type: ChannelAccessType;
    grade_range: ChannelGradeRange;
    is_active: boolean;
    created_at: string;
}

/**
 * Channel reference in post
 */
export interface ChannelRef {
    id: number;
    name: string;
}

/**
 * Poll option entity
 */
export interface PollOption {
    id: number;
    text: string;
    votes: number;
}

/**
 * Poll entity
 */
export interface Poll {
    question: string;
    options: PollOption[];
    total_votes: number;
}

/**
 * Comment entity from API
 */
export interface Comment {
    id: number;
    author: CommunityUserRef;
    content: string;
    created_at: string;
    likes: number;
    is_liked: boolean;
    is_solution: boolean;
    replies?: Comment[];
}

/**
 * Post entity from API
 */
export interface Post {
    id: number;
    author: CommunityUserRef;
    content: string;
    image: string | null;
    video: string | null;
    gif: string | null;
    likes: number;
    comments_count: number;
    is_saved: boolean;
    is_liked: boolean;
    is_pinned: boolean;
    is_official: boolean;
    created_at: string;
    channel: ChannelRef | null;
    audience: Audience;
    feeling: string | null;
    tagged_users: CommunityUserRef[];
    poll: Poll | null;
    report_count: number;
    category: PostCategory;
    status: PostStatus;
}

/**
 * Post with comments (detail view)
 */
export interface PostDetail extends Post {
    comments: Comment[];
}

/**
 * Report entity from API
 */
export interface Report {
    id: number;
    post_id: number;
    reporter: CommunityUserRef;
    reason: string;
    description: string | null;
    status: ReportStatus;
    created_at: string;
}

// ============================================================================
// Request Payload Types
// ============================================================================

/**
 * Create channel payload
 */
export interface ChannelCreatePayload {
    name: string;
    description: string;
    banner?: string;
    thumbnail?: string;
    access_type: ChannelAccessType;
    grade_range: ChannelGradeRange;
    admin_ids?: number[];
}

/**
 * Update channel payload
 */
export interface ChannelUpdatePayload {
    name?: string;
    description?: string;
    banner?: string;
    thumbnail?: string;
    access_type?: ChannelAccessType;
    grade_range?: ChannelGradeRange;
    admin_ids?: number[];
}

/**
 * Create post payload
 */
export interface PostCreatePayload {
    content: string;
    channel_id?: number;
    image?: string;
    video?: string;
    gif?: string;
    audience?: Audience;
    category?: PostCategory;
    status?: PostStatus;
    feeling?: string;
    is_pinned?: boolean;
    is_official?: boolean;
    tagged_user_ids?: number[];
    poll?: {
        question: string;
        options: string[];
    };
}

/**
 * Update post payload
 */
export interface PostUpdatePayload {
    content?: string;
    image?: string;
    video?: string;
    gif?: string;
    audience?: Audience;
    category?: PostCategory;
    status?: PostStatus;
    feeling?: string;
    is_pinned?: boolean;
    is_official?: boolean;
    tagged_user_ids?: number[];
}

/**
 * Create comment payload
 */
export interface CommentCreatePayload {
    content: string;
    parent_id?: number | null;
}

/**
 * Update comment payload
 */
export interface CommentUpdatePayload {
    content: string;
}

/**
 * React payload (for posts and comments)
 */
export interface ReactPayload {
    emoji: string;
}

/**
 * Report post payload
 */
export interface ReportCreatePayload {
    reason: string;
    description?: string;
}

/**
 * Review report payload
 */
export interface ReportReviewPayload {
    status: "reviewed" | "resolved" | "dismissed";
}

/**
 * Vote on poll payload
 */
export interface PollVotePayload {
    option_id: number;
}

/**
 * Add admin payload
 */
export interface AddAdminPayload {
    user_id: number;
}

// ============================================================================
// Query Params Types
// ============================================================================

/**
 * Channels list params
 */
export interface ChannelsListParams {
    search?: string;
    access_type?: ChannelAccessType;
    grade_range?: ChannelGradeRange;
    per_page?: number;
    page?: number;
}

/**
 * Posts list params
 */
export interface PostsListParams {
    channel_id?: number;
    author_id?: number;
    category?: PostCategory;
    status?: PostStatus;
    search?: string;
    per_page?: number;
    page?: number;
}

/**
 * Reports list params
 */
export interface ReportsListParams {
    status?: ReportStatus;
    post_id?: number;
    per_page?: number;
    page?: number;
}

// ============================================================================
// Response Types
// ============================================================================

/**
 * Pagination meta from API
 */
export interface PaginationMeta {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
}

/**
 * Paginated response wrapper
 */
export interface PaginatedResponse<T> {
    data: T[];
    meta: PaginationMeta;
}

/**
 * React response
 */
export interface ReactResponse {
    action: "added" | "removed" | "changed";
    emoji: string;
}
