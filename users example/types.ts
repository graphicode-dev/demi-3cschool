
export type UserLevel = 'manager' | 'leader' | 'admin' | 'agent' | 'user';

export type UserRole = 
  | 'manager' 
  | 'cx_leader' | 'hr_leader' | 'ops_leader' | 'coord_leader' | 'comm_leader' | 'academic_manager'
  | 'block_admin'
  | 'cx_agent' | 'hr_agent' | 'ops_agent' | 'community_manager' | 'team_leader' | 'coordinator'
  | 'student' | 'instructor';

export type Audience = 'Public' | 'Group';
export type PostCategory = 'General' | 'Project Help' | 'Homework' | 'Coding Tip' | 'Resource';
export type PostStatus = 'Open' | 'Solved' | 'Announcement' | 'pending' | 'approved' | 'rejected' | 'hold';

export interface UserActivity {
  id: string;
  type: 'attendance' | 'assignment' | 'points' | 'role_change' | 'login' | 'system';
  description: string;
  timestamp: string;
  metadata?: any;
}

export interface User {
  id: string;
  name: string;
  avatar: string;
  level: UserLevel;
  role: UserRole;
  blockId?: string; 
  groupId?: string;
  points?: number;
  gradeLevel?: number;
  bio?: string;
  email: string;
  history: UserActivity[];
  kpis?: { name: string; score: number }[];
  permissions?: string[];
  phone?: string;
  joinedAt?: string;
}

export interface BlockGroup {
  id: string;
  name: string;
  blockId: string;
  instructorId: string;
  studentIds: string[];
  schedule: string;
  level: string;
}

export interface Block {
  id: string;
  name: string; 
  adminId?: string;
  capacity: number; 
  location: string;
  status: 'Active' | 'Under Maintenance' | 'On Boarding';
  priority: 'Urgent' | 'Moderate Priority' | 'Low Priority' | 'Operational';
  sessionBuffer: number;
}

export interface Comment {
  id: string;
  author: User;
  content: string;
  createdAt: string;
  likes: number;
  isSolution?: boolean;
}

// Added feeling and gif properties to the Post interface
export interface Post {
  id: string;
  author: User;
  content: string;
  image?: string;
  video?: string;
  gif?: string;
  feeling?: string;
  likes: number;
  comments: Comment[];
  isSaved: boolean;
  isPinned: boolean;
  createdAt: string;
  blockId?: string; 
  channelId?: string; 
  audience: Audience;
  status: PostStatus; 
  category?: PostCategory;
  poll?: any;
  taggedUsers?: User[];
  isOfficial?: boolean;
  rejectionReason?: string;
}

export interface PostReport {
  id: string;
  postId: string;
  reporter: User;
  reason: string;
  comment?: string;
  timestamp: string;
}

// Added missing Channel interface
export interface Channel {
  id: string;
  name: string;
  owner: User;
  description: string;
  followers: number;
  banner: string;
  thumbnail?: string;
  isFollowing: boolean;
}

// Added missing MentorApplication interface
export interface MentorApplication {
  specialization: string;
  motivation: string;
  experience: string;
  availability: string;
}
