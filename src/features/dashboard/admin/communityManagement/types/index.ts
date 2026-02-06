export type UserRole = "student" | "instructor" | "manager";
export type Audience = "Public" | "Group";
export type PostCategory =
    | "General"
    | "Project Help"
    | "Homework"
    | "Coding Tip"
    | "Resource";
export type PostStatus = "Open" | "Solved" | "Announcement";

export interface CommunityUser {
    id: string;
    name: string;
    avatar: string;
    role: UserRole;
    points?: number;
    gradeLevel?: number;
}

export interface Reaction {
    emoji: string;
    label: string;
}

export interface PollOption {
    id: string;
    text: string;
    votes: number;
}

export interface Poll {
    question: string;
    options: PollOption[];
    totalVotes: number;
}

export interface Comment {
    id: string;
    author: CommunityUser;
    content: string;
    createdAt: string;
    likes: number;
    reactions?: Record<string, number>;
    replies?: Comment[];
    isSolution?: boolean;
}

export interface Channel {
    id: string;
    name: string;
    description: string;
    owner: CommunityUser;
    admins: CommunityUser[];
    followers: number;
    banner: string;
    thumbnail?: string;
    isFollowing: boolean;
    accessType: "General" | "Restricted";
    gradeRange?:
        | "Grade 1-3"
        | "Grade 4-6"
        | "Grade 7-9"
        | "Grade 10-12"
        | "All";
}

export interface Post {
    id: string;
    author: CommunityUser;
    content: string;
    image?: string;
    video?: string;
    gif?: string;
    likes: number;
    comments: Comment[];
    commentsCount: number;
    isSaved: boolean;
    isPinned: boolean;
    isOfficial?: boolean;
    createdAt: string;
    channelId?: string;
    audience: Audience;
    feeling?: string;
    taggedUsers?: CommunityUser[];
    poll?: Poll;
    reportCount?: number;
    category?: PostCategory;
    status?: PostStatus;
}

export interface PostReport {
    id: string;
    postId: string;
    reporter: CommunityUser;
    reason: string;
    timestamp: string;
}

export type ManagementTab =
    | "feed"
    | "moderate"
    | "channels"
    | "announcement"
    | "reports"
    | "post";
