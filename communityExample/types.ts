
export type UserRole = 'student' | 'instructor' | 'manager';
export type Audience = 'Public' | 'Group';
export type PostCategory = 'General' | 'Project Help' | 'Homework' | 'Coding Tip' | 'Resource';
export type PostStatus = 'Open' | 'Solved' | 'Announcement';

export interface User {
  id: string;
  name: string;
  avatar: string;
  role: UserRole;
  points?: number;
  gradeLevel?: number; // Used to identify "Old Kids" (Mentors)
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
  author: User;
  content: string;
  createdAt: string;
  likes: number;
  reactions?: Record<string, number>; // emoji -> count
  replies?: Comment[];
  isSolution?: boolean; // Identify the best answer in Hub
}

export interface Channel {
  id: string;
  name: string;
  description: string;
  owner: User;
  admins: User[];
  followers: number;
  banner: string;
  thumbnail?: string; // Small square logo
  isFollowing: boolean;
  accessType: 'General' | 'Restricted';
  gradeRange?: 'Grade 1-3' | 'Grade 4-6' | 'Grade 7-9' | 'Grade 10-12' | 'All';
}

export interface Post {
  id: string;
  author: User;
  content: string;
  image?: string;
  video?: string;
  gif?: string;
  likes: number;
  comments: Comment[];
  isSaved: boolean;
  isPinned: boolean;
  isOfficial?: boolean;
  createdAt: string;
  channelId?: string;
  audience: Audience;
  feeling?: string; // Add feeling support
  taggedUsers?: User[];
  poll?: Poll;
  reportCount?: number;
  category?: PostCategory; // Knowledge Hub category
  status?: PostStatus; // For Hub requests
}

export interface PostReport {
  id: string;
  postId: string;
  reporter: User;
  reason: string;
  timestamp: string;
}
