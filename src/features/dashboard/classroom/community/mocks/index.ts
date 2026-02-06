import type { Post, CommunityUser, Channel, Audience } from "../types";

export const CURRENT_USER: CommunityUser = {
    id: "u1",
    name: "Student User",
    avatar: "https://picsum.photos/seed/user1/100/100",
    role: "student",
    points: 1250,
    gradeLevel: 4,
};

// TODO: Replace MOCK_USERS with real users fetched from API endpoint
// For tagging to work, user IDs must be valid numeric IDs from the backend
export const MOCK_USERS: CommunityUser[] = [
    {
        id: "1",
        name: "Alex Thompson",
        avatar: "https://picsum.photos/seed/inst1/100/100",
        role: "instructor",
    },
    {
        id: "2",
        name: "Sarah Miller",
        avatar: "https://picsum.photos/seed/inst2/100/100",
        role: "instructor",
    },
    {
        id: "3",
        name: "Manager Dave",
        avatar: "https://picsum.photos/seed/mgr1/100/100",
        role: "manager",
    },
    {
        id: "4",
        name: "Master Coder Leo",
        avatar: "https://picsum.photos/seed/kid1/100/100",
        role: "student",
        gradeLevel: 10,
    },
    {
        id: "5",
        name: "Newbie Nina",
        avatar: "https://picsum.photos/seed/kid2/100/100",
        role: "student",
        gradeLevel: 1,
    },
];

export const MOCK_CHANNELS: Channel[] = [
    {
        id: "c1",
        name: "Python Wizards",
        description: "Master Python through fun challenges and projects!",
        owner: MOCK_USERS[0],
        admins: [MOCK_USERS[0], MOCK_USERS[2]],
        followers: 1240,
        banner: "https://picsum.photos/seed/banner1/600/200",
        thumbnail: "https://picsum.photos/seed/thumb1/200/200",
        isFollowing: true,
        accessType: "General",
        gradeRange: "Grade 4-6",
    },
    {
        id: "c2",
        name: "Web Design Lab",
        description: "Sharing the coolest UI/UX tips for budding designers.",
        owner: MOCK_USERS[1],
        admins: [MOCK_USERS[1]],
        followers: 850,
        banner: "https://picsum.photos/seed/banner2/600/200",
        thumbnail: "https://picsum.photos/seed/thumb2/200/200",
        isFollowing: false,
        accessType: "Restricted",
        gradeRange: "Grade 7-9",
    },
    {
        id: "c3",
        name: "Academy News",
        description: "Official announcements and community events.",
        owner: MOCK_USERS[2],
        admins: [MOCK_USERS[2]],
        followers: 5400,
        banner: "https://picsum.photos/seed/banner3/600/200",
        thumbnail: "https://picsum.photos/seed/thumb3/200/200",
        isFollowing: true,
        accessType: "General",
        gradeRange: "All",
    },
];

export const MOCK_POSTS: Post[] = [
    {
        id: "h1",
        author: MOCK_USERS[4],
        content:
            "I am struggling with loops in my Python game. Can someone explain for-loops vs while-loops? I am in Grade 1.",
        category: "Project Help",
        status: "Open",
        likes: 2,
        audience: "Public" as Audience,
        commentsCount: 1,
        comments: [
            {
                id: "hc1",
                author: MOCK_USERS[3],
                content:
                    'Hey Nina! Think of a for-loop as a list of instructions for each toy in a box. A while-loop is "keep doing this until the box is empty". Does that help?',
                createdAt: "10m ago",
                likes: 15,
                isSolution: true,
            },
        ],
        isSaved: false,
        isPinned: false,
        createdAt: "1 hour ago",
    },
    {
        id: "p1",
        author: MOCK_USERS[3],
        content:
            "Just finished my first React app! Check out the UI. What do you guys think? 🚀",
        image: "https://picsum.photos/seed/post1/800/400",
        likes: 45,
        audience: "Public" as Audience,
        category: "General",
        commentsCount: 0,
        comments: [],
        isSaved: false,
        isPinned: false,
        createdAt: "5 hours ago",
    },
    {
        id: "h2",
        author: MOCK_USERS[3],
        content:
            'TOP TIP: Use "console.table()" to see your arrays much better! Saves so much time during debugging.',
        category: "Coding Tip",
        status: "Solved",
        likes: 89,
        audience: "Public" as Audience,
        commentsCount: 0,
        comments: [],
        isSaved: true,
        isPinned: false,
        createdAt: "1 day ago",
    },
];
