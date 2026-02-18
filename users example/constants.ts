
import { Post, User, Block, BlockGroup, Channel } from './types';

// Helper to generate IDs
const generateId = () => Math.random().toString(36).substring(2, 9);

export const CURRENT_USER: User = {
  id: 'u1',
  name: 'Academy Manager',
  email: 'manager@academy.com',
  avatar: 'https://i.pravatar.cc/150?u=manager',
  level: 'manager',
  role: 'manager',
  points: 5000,
  bio: 'Head of Operations and System Architecture.',
  history: [],
  permissions: ['admin_access', 'edit_users', 'delete_users', 'view_dashboard', 'manage_blocks', 'create_post', 'moderate_content'],
  joinedAt: '2025-01-01',
  kpis: [
    { name: 'System Stability', score: 98 },
    { name: 'Operational Excellence', score: 94 },
    { name: 'Unit Coordination', score: 91 },
    { name: 'Staff Retention', score: 96 }
  ]
};

export const AVAILABLE_PERMISSIONS = [
  { id: 'view_dashboard', label: 'Access Dashboard', category: 'System', description: 'Allows viewing of global metrics and system status.' },
  { id: 'manage_blocks', label: 'Manage Blocks', category: 'Infrastructure', description: 'Can create, edit, or decommission hub blocks.' },
  { id: 'manage_groups', label: 'Manage Groups', category: 'Infrastructure', description: 'Full control over student cohorts and assignments.' },
  { id: 'edit_users', label: 'Modify Personnel', category: 'Personnel', description: 'Change user details, roles, and status.' },
  { id: 'delete_users', label: 'Terminate Users', category: 'Personnel', description: 'Archiving and deleting user digital identities.' },
  { id: 'manage_roles', label: 'Schema Control', category: 'Personnel', description: 'Modify the 5-level hierarchy and role permissions.' },
  { id: 'create_post', label: 'Publish Content', category: 'Community', description: 'Post to the public feed or specific channels.' },
  { id: 'moderate_content', label: 'Moderate Feed', category: 'Community', description: 'Approve, reject, or delete community posts.' },
  { id: 'manage_finances', label: 'Audit Finances', category: 'Admin', description: 'Access to financial logs and billing infrastructure.' },
  { id: 'view_exams', label: 'Exam Access', category: 'Academy', description: 'View and grade final student exams.' },
];

export const BLOCKS: Block[] = [
  { 
    id: 'bl1', 
    name: 'Block Alpha', 
    adminId: 'a1', 
    capacity: 100, 
    location: 'Central Cairo Hub', 
    status: 'Active', 
    priority: 'Urgent',
    sessionBuffer: 15 
  },
  { 
    id: 'bl2', 
    name: 'Block Beta', 
    adminId: 'a2', 
    capacity: 150, 
    location: 'West Sheikh Zayed', 
    status: 'Active', 
    priority: 'Moderate Priority',
    sessionBuffer: 15 
  }
];

// Generate 20 instructors
const INSTRUCTORS: User[] = Array.from({ length: 20 }).map((_, i) => ({
  id: `i${i + 1}`,
  name: `Prof. ${['Smith', 'Jones', 'Taylor', 'Brown', 'Wilson', 'Evans', 'Thomas', 'Roberts', 'Walker', 'Snape', 'Dumbledore', 'McGonagall', 'Lupin', 'Moody', 'Flitwick', 'Sprout', 'Slughorn', 'Trelawney', 'Hagrid', 'Sinistra'][i]}`,
  level: 'agent',
  role: 'instructor',
  blockId: i % 2 === 0 ? 'bl1' : 'bl2',
  avatar: `https://i.pravatar.cc/150?u=instructor${i}`,
  email: `instructor${i + 1}@academy.com`,
  history: [],
  permissions: ['view_dashboard', 'create_post', 'view_exams'],
  kpis: [{ name: 'Engagement', score: 85 + (i % 15) }]
}));

// Generate 100 students (50 per block roughly)
const STUDENTS: User[] = Array.from({ length: 150 }).map((_, i) => ({
  id: `s${i + 1}`,
  name: `Student ${i + 1}`,
  level: 'user',
  role: 'student',
  blockId: i < 75 ? 'bl1' : 'bl2',
  avatar: `https://i.pravatar.cc/150?u=student${i}`,
  points: Math.floor(Math.random() * 2000),
  gradeLevel: Math.floor(Math.random() * 12) + 1,
  email: `student${i + 1}@academy.com`,
  history: [],
  permissions: ['create_post'],
  kpis: [{ name: 'Logic', score: 70 + (i % 30) }]
}));

export const MOCK_USERS: User[] = [
  { id: 'a1', name: 'Dr. Sarah Smith', level: 'admin', role: 'block_admin', blockId: 'bl1', avatar: 'https://i.pravatar.cc/150?u=sarah', email: 'sarah.admin@academy.com', history: [], phone: '+201000000001', permissions: ['view_dashboard', 'manage_blocks', 'create_post'], kpis: [{ name: 'Unit Growth', score: 88 }, { name: 'Budget Adherence', score: 95 }] },
  { id: 'a2', name: 'Dr. James Ford', level: 'admin', role: 'block_admin', blockId: 'bl2', avatar: 'https://i.pravatar.cc/150?u=james', email: 'james.admin@academy.com', history: [], phone: '+201000000011', permissions: ['view_dashboard', 'manage_blocks'], kpis: [] },
  ...INSTRUCTORS,
  ...STUDENTS
];

export const MOCK_GROUPS: BlockGroup[] = [
  { id: 'g1', name: 'Python Wizards A', blockId: 'bl1', instructorId: 'i1', studentIds: STUDENTS.filter(s => s.blockId === 'bl1').slice(0, 25).map(s => s.id), schedule: 'Mon/Wed 4pm-6pm', level: 'Intermediate' },
  { id: 'g2', name: 'Web Dev Elite B', blockId: 'bl1', instructorId: 'i2', studentIds: STUDENTS.filter(s => s.blockId === 'bl1').slice(25, 50).map(s => s.id), schedule: 'Tue/Thu 5pm-7pm', level: 'Advanced' },
  { id: 'g3', name: 'AI Pioneers C', blockId: 'bl1', instructorId: 'i3', studentIds: STUDENTS.filter(s => s.blockId === 'bl1').slice(50, 75).map(s => s.id), schedule: 'Fri 10am-2pm', level: 'Intermediate' },
  { id: 'g4', name: 'Game Design Alpha', blockId: 'bl2', instructorId: 'i4', studentIds: STUDENTS.filter(s => s.blockId === 'bl2').slice(0, 25).map(s => s.id), schedule: 'Mon/Wed 1pm-3pm', level: 'Beginner' },
  { id: 'g5', name: 'Cloud Architects', blockId: 'bl2', instructorId: 'i5', studentIds: STUDENTS.filter(s => s.blockId === 'bl2').slice(25, 50).map(s => s.id), schedule: 'Sat/Sun 9am-12pm', level: 'Advanced' }
];

export const MOCK_POSTS: Post[] = [];
export const MOCK_CHANNELS: Channel[] = [];
