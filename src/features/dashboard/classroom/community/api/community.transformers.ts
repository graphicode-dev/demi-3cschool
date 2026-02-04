/**
 * Community Feature - Data Transformers
 *
 * Functions to transform API response types to UI types.
 * This bridges the gap between snake_case API responses and
 * camelCase UI types used in components.
 */

import type {
    Channel as ApiChannel,
    Post as ApiPost,
    PostDetail as ApiPostDetail,
    Comment as ApiComment,
    CommunityUserRef as ApiUserRef,
    Poll as ApiPoll,
    PollOption as ApiPollOption,
} from "./community.types";

import type {
    Channel as UiChannel,
    Post as UiPost,
    Comment as UiComment,
    CommunityUser as UiUser,
    Poll as UiPoll,
    PollOption as UiPollOption,
    Audience as UiAudience,
    PostCategory as UiPostCategory,
    PostStatus as UiPostStatus,
    UserRole as UiUserRole,
} from "../types";

// ============================================================================
// User Transformers
// ============================================================================

/**
 * Transform API user reference to UI user
 */
export function transformUser(apiUser: ApiUserRef | null | undefined): UiUser {
    if (!apiUser) {
        return { id: "0", name: "Unknown", avatar: "", role: "student" };
    }

    const roleMap: Record<string, UiUserRole> = {
        student: "student",
        teacher: "instructor",
        admin: "manager",
    };

    return {
        id: String(apiUser.id),
        name: apiUser.name || "Unknown",
        avatar: apiUser.avatar || "https://picsum.photos/seed/default/100/100",
        role: roleMap[apiUser.role || "student"] || "student",
    };
}

// ============================================================================
// Channel Transformers
// ============================================================================

/**
 * Transform API channel to UI channel
 */
export function transformChannel(apiChannel: ApiChannel): UiChannel {
    const gradeRangeMap: Record<string, UiChannel["gradeRange"]> = {
        grade_1_3: "Grade 1-3",
        grade_4_6: "Grade 4-6",
        grade_7_9: "Grade 7-9",
        grade_10_12: "Grade 10-12",
        all: "All",
    };

    const accessTypeMap: Record<string, UiChannel["accessType"]> = {
        general: "General",
        restricted: "Restricted",
    };

    return {
        id: String(apiChannel.id),
        name: apiChannel.name || "",
        description: apiChannel.description || "",
        owner: apiChannel.owner
            ? transformUser(apiChannel.owner)
            : { id: "0", name: "Unknown", avatar: "", role: "student" },
        admins: apiChannel.admins?.map(transformUser) || [],
        followers: apiChannel.followers_count || 0,
        banner:
            apiChannel.banner || "https://picsum.photos/seed/banner/600/200",
        thumbnail: apiChannel.thumbnail || undefined,
        isFollowing: apiChannel.is_following ?? false,
        accessType: accessTypeMap[apiChannel.access_type] || "General",
        gradeRange: gradeRangeMap[apiChannel.grade_range] || "All",
    };
}

/**
 * Transform array of API channels to UI channels
 */
export function transformChannels(apiChannels: ApiChannel[]): UiChannel[] {
    return apiChannels.map(transformChannel);
}

// ============================================================================
// Poll Transformers
// ============================================================================

/**
 * Transform API poll option to UI poll option
 */
export function transformPollOption(apiOption: ApiPollOption): UiPollOption {
    return {
        id: String(apiOption.id),
        text: apiOption.text,
        votes: apiOption.votes,
    };
}

/**
 * Transform API poll to UI poll
 */
export function transformPoll(apiPoll: ApiPoll): UiPoll {
    return {
        question: apiPoll.question,
        options: apiPoll.options.map(transformPollOption),
        totalVotes: apiPoll.total_votes,
    };
}

// ============================================================================
// Comment Transformers
// ============================================================================

/**
 * Transform API comment to UI comment
 */
export function transformComment(apiComment: ApiComment): UiComment {
    return {
        id: String(apiComment.id),
        author: apiComment.author
            ? transformUser(apiComment.author)
            : { id: "0", name: "Unknown", avatar: "", role: "student" },
        content: apiComment.content || "",
        createdAt: apiComment.created_at || "",
        likes: apiComment.likes || 0,
        isSolution: apiComment.is_solution ?? false,
        replies: apiComment.replies?.map(transformComment) || [],
    };
}

/**
 * Transform array of API comments to UI comments
 */
export function transformComments(apiComments: ApiComment[]): UiComment[] {
    return apiComments.map(transformComment);
}

// ============================================================================
// Post Transformers
// ============================================================================

/**
 * Transform API audience to UI audience
 */
function transformAudience(apiAudience: string): UiAudience {
    const audienceMap: Record<string, UiAudience> = {
        public: "Public",
        group: "Group",
    };
    return audienceMap[apiAudience] || "Public";
}

/**
 * Transform API category to UI category
 */
function transformCategory(apiCategory: string): UiPostCategory {
    const categoryMap: Record<string, UiPostCategory> = {
        general: "General",
        project_help: "Project Help",
        homework: "Homework",
        coding_tip: "Coding Tip",
        resource: "Resource",
    };
    return categoryMap[apiCategory] || "General";
}

/**
 * Transform API status to UI status
 */
function transformStatus(apiStatus: string): UiPostStatus {
    const statusMap: Record<string, UiPostStatus> = {
        open: "Open",
        solved: "Solved",
        announcement: "Announcement",
    };
    return statusMap[apiStatus] || "Open";
}

/**
 * Transform API post to UI post
 */
export function transformPost(apiPost: ApiPost): UiPost {
    return {
        id: String(apiPost.id),
        author: transformUser(apiPost.author),
        content: apiPost.content || "",
        image: apiPost.image || undefined,
        video: apiPost.video || undefined,
        gif: apiPost.gif || undefined,
        likes: apiPost.likes || 0,
        comments: [],
        isSaved: apiPost.is_saved ?? false,
        isPinned: apiPost.is_pinned ?? false,
        isOfficial: apiPost.is_official ?? false,
        createdAt: apiPost.created_at || "",
        channelId: apiPost.channel ? String(apiPost.channel.id) : undefined,
        audience: transformAudience(apiPost.audience || "public"),
        feeling: apiPost.feeling || undefined,
        taggedUsers: apiPost.tagged_users?.map(transformUser) || [],
        poll: apiPost.poll ? transformPoll(apiPost.poll) : undefined,
        reportCount: apiPost.report_count || 0,
        category: transformCategory(apiPost.category || "general"),
        status: transformStatus(apiPost.status || "open"),
    };
}

/**
 * Transform API post detail (with comments) to UI post
 */
export function transformPostDetail(apiPost: ApiPostDetail): UiPost {
    const post = transformPost(apiPost);
    return {
        ...post,
        comments: transformComments(apiPost.comments),
    };
}

/**
 * Transform array of API posts to UI posts
 */
export function transformPosts(apiPosts: ApiPost[]): UiPost[] {
    return apiPosts.map(transformPost);
}

// ============================================================================
// Reverse Transformers (UI to API)
// ============================================================================

/**
 * Transform UI audience to API audience
 */
export function toApiAudience(uiAudience: UiAudience): "public" | "group" {
    const audienceMap: Record<UiAudience, "public" | "group"> = {
        Public: "public",
        Group: "group",
    };
    return audienceMap[uiAudience] || "public";
}

/**
 * Transform UI category to API category
 */
export function toApiCategory(
    uiCategory: UiPostCategory
): "general" | "project_help" | "homework" | "coding_tip" | "resource" {
    const categoryMap: Record<
        UiPostCategory,
        "general" | "project_help" | "homework" | "coding_tip" | "resource"
    > = {
        General: "general",
        "Project Help": "project_help",
        Homework: "homework",
        "Coding Tip": "coding_tip",
        Resource: "resource",
    };
    return categoryMap[uiCategory] || "general";
}

/**
 * Transform UI status to API status
 */
export function toApiStatus(
    uiStatus: UiPostStatus
): "open" | "solved" | "announcement" {
    const statusMap: Record<UiPostStatus, "open" | "solved" | "announcement"> =
        {
            Open: "open",
            Solved: "solved",
            Announcement: "announcement",
        };
    return statusMap[uiStatus] || "open";
}

/**
 * Transform UI grade range to API grade range
 */
export function toApiGradeRange(
    uiGradeRange: UiChannel["gradeRange"]
): "grade_1_3" | "grade_4_6" | "grade_7_9" | "grade_10_12" | "all" {
    const gradeRangeMap: Record<
        NonNullable<UiChannel["gradeRange"]>,
        "grade_1_3" | "grade_4_6" | "grade_7_9" | "grade_10_12" | "all"
    > = {
        "Grade 1-3": "grade_1_3",
        "Grade 4-6": "grade_4_6",
        "Grade 7-9": "grade_7_9",
        "Grade 10-12": "grade_10_12",
        All: "all",
    };
    return gradeRangeMap[uiGradeRange || "All"] || "all";
}

/**
 * Transform UI access type to API access type
 */
export function toApiAccessType(
    uiAccessType: UiChannel["accessType"]
): "general" | "restricted" {
    const accessTypeMap: Record<
        UiChannel["accessType"],
        "general" | "restricted"
    > = {
        General: "general",
        Restricted: "restricted",
    };
    return accessTypeMap[uiAccessType] || "general";
}
