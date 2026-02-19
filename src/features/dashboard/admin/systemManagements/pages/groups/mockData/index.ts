import type { Group, GroupBlock, GroupInstructor } from "../types";

// ============================================================================
// Mock Instructors
// ============================================================================

export const mockInstructors: GroupInstructor[] = [
    {
        id: 1,
        name: "Ahmed Hassan",
        email: "ahmed.hassan@3cschool.com",
        phone: "+201012345678",
        avatar: "https://i.pravatar.cc/150?u=ahmed",
    },
    {
        id: 2,
        name: "Sara Mohamed",
        email: "sara.mohamed@3cschool.com",
        phone: "+201098765432",
        avatar: "https://i.pravatar.cc/150?u=sara",
    },
    {
        id: 3,
        name: "Omar Ali",
        email: "omar.ali@3cschool.com",
        phone: "+201055512345",
        avatar: "https://i.pravatar.cc/150?u=omar",
    },
    {
        id: 4,
        name: "Nour Ibrahim",
        email: "nour.ibrahim@3cschool.com",
        phone: "+201033344556",
        avatar: "https://i.pravatar.cc/150?u=nour",
    },
    {
        id: 5,
        name: "Khaled Youssef",
        email: "khaled.youssef@3cschool.com",
        phone: "+201077788899",
        avatar: "https://i.pravatar.cc/150?u=khaled",
    },
];

// ============================================================================
// Mock Blocks
// ============================================================================

export const mockBlocks: GroupBlock[] = [
    { id: 1, name: "Block A", location: "Building 1 - Floor 2" },
    { id: 2, name: "Block B", location: "Building 1 - Floor 3" },
    { id: 3, name: "Block C", location: "Building 2 - Floor 1" },
    { id: 4, name: "Block D", location: "Building 2 - Floor 2" },
    { id: 5, name: "Block E", location: "Building 3 - Floor 1" },
    { id: 6, name: "Online Hub", location: "Virtual Campus" },
];

// ============================================================================
// Mock Groups
// ============================================================================

export const mockGroups: Group[] = [
    {
        id: 1,
        name: "Alpha Coders",
        level: "beginner",
        schedule: "Sun, Tue, Thu — 10:00 AM",
        instructorId: 1,
        instructor: mockInstructors[0],
        primaryTeacher: mockInstructors[0],
        students: [
            { id: 101, name: "Youssef Tarek", email: "youssef@student.com", avatar: "https://i.pravatar.cc/150?u=s101" },
            { id: 102, name: "Layla Adel", email: "layla@student.com", avatar: "https://i.pravatar.cc/150?u=s102" },
            { id: 103, name: "Mostafa Samir", email: "mostafa@student.com", avatar: "https://i.pravatar.cc/150?u=s103" },
            { id: 104, name: "Hana Khaled", email: "hana@student.com", avatar: "https://i.pravatar.cc/150?u=s104" },
            { id: 105, name: "Ziad Nabil", email: "ziad@student.com", avatar: "https://i.pravatar.cc/150?u=s105" },
        ],
        blocks: [mockBlocks[0], mockBlocks[1]],
        createdAt: "2025-01-15T10:00:00Z",
        updatedAt: "2025-02-10T14:30:00Z",
    },
    {
        id: 2,
        name: "Beta Builders",
        level: "intermediate",
        schedule: "Mon, Wed — 2:00 PM",
        instructorId: 2,
        instructor: mockInstructors[1],
        primaryTeacher: mockInstructors[1],
        students: [
            { id: 201, name: "Rana Fathy", email: "rana@student.com", avatar: "https://i.pravatar.cc/150?u=s201" },
            { id: 202, name: "Karim Essam", email: "karim@student.com", avatar: "https://i.pravatar.cc/150?u=s202" },
            { id: 203, name: "Dina Sherif", email: "dina@student.com", avatar: "https://i.pravatar.cc/150?u=s203" },
            { id: 204, name: "Amr Gamal", email: "amr@student.com", avatar: "https://i.pravatar.cc/150?u=s204" },
            { id: 205, name: "Nada Wael", email: "nada@student.com", avatar: "https://i.pravatar.cc/150?u=s205" },
            { id: 206, name: "Tamer Hossam", email: "tamer@student.com", avatar: "https://i.pravatar.cc/150?u=s206" },
            { id: 207, name: "Salma Ashraf", email: "salma@student.com", avatar: "https://i.pravatar.cc/150?u=s207" },
        ],
        blocks: [mockBlocks[2]],
        createdAt: "2025-01-20T09:00:00Z",
        updatedAt: "2025-02-12T11:00:00Z",
    },
    {
        id: 3,
        name: "Gamma Gurus",
        level: "advanced",
        schedule: "Sat, Mon, Wed — 4:00 PM",
        instructorId: 3,
        instructor: mockInstructors[2],
        primaryTeacher: mockInstructors[2],
        students: [
            { id: 301, name: "Ali Mahmoud", email: "ali@student.com", avatar: "https://i.pravatar.cc/150?u=s301" },
            { id: 302, name: "Mariam Reda", email: "mariam@student.com", avatar: "https://i.pravatar.cc/150?u=s302" },
            { id: 303, name: "Hassan Emad", email: "hassan@student.com", avatar: "https://i.pravatar.cc/150?u=s303" },
        ],
        blocks: [mockBlocks[3], mockBlocks[4], mockBlocks[5]],
        createdAt: "2025-02-01T08:00:00Z",
        updatedAt: "2025-02-15T16:00:00Z",
    },
    {
        id: 4,
        name: "Delta Devs",
        level: "beginner",
        schedule: "Tue, Thu — 11:00 AM",
        instructorId: 4,
        instructor: mockInstructors[3],
        primaryTeacher: mockInstructors[3],
        students: [
            { id: 401, name: "Fatma Sayed", email: "fatma@student.com", avatar: "https://i.pravatar.cc/150?u=s401" },
            { id: 402, name: "Mohamed Adel", email: "mohamed@student.com", avatar: "https://i.pravatar.cc/150?u=s402" },
            { id: 403, name: "Yasmin Tarek", email: "yasmin@student.com", avatar: "https://i.pravatar.cc/150?u=s403" },
            { id: 404, name: "Ayman Khaled", email: "ayman@student.com", avatar: "https://i.pravatar.cc/150?u=s404" },
        ],
        blocks: [],
        createdAt: "2025-02-05T10:00:00Z",
        updatedAt: "2025-02-18T09:00:00Z",
    },
    {
        id: 5,
        name: "Epsilon Experts",
        level: "intermediate",
        schedule: "Sun, Tue — 1:00 PM",
        instructorId: 5,
        instructor: mockInstructors[4],
        primaryTeacher: mockInstructors[4],
        students: [
            { id: 501, name: "Reem Ahmed", email: "reem@student.com", avatar: "https://i.pravatar.cc/150?u=s501" },
            { id: 502, name: "Sherif Nasser", email: "sherif@student.com", avatar: "https://i.pravatar.cc/150?u=s502" },
            { id: 503, name: "Lina Waleed", email: "lina@student.com", avatar: "https://i.pravatar.cc/150?u=s503" },
            { id: 504, name: "Bassem Fouad", email: "bassem@student.com", avatar: "https://i.pravatar.cc/150?u=s504" },
            { id: 505, name: "Noha Magdy", email: "noha@student.com", avatar: "https://i.pravatar.cc/150?u=s505" },
            { id: 506, name: "Tarek Saeed", email: "tarek@student.com", avatar: "https://i.pravatar.cc/150?u=s506" },
        ],
        blocks: [mockBlocks[0], mockBlocks[5]],
        createdAt: "2025-02-08T12:00:00Z",
        updatedAt: "2025-02-19T10:00:00Z",
    },
    {
        id: 6,
        name: "Zeta Wizards",
        level: "advanced",
        schedule: "Mon, Wed, Fri — 9:00 AM",
        instructorId: 1,
        instructor: mockInstructors[0],
        primaryTeacher: mockInstructors[0],
        students: [
            { id: 601, name: "Mona Hisham", email: "mona@student.com", avatar: "https://i.pravatar.cc/150?u=s601" },
            { id: 602, name: "Hazem Osama", email: "hazem@student.com", avatar: "https://i.pravatar.cc/150?u=s602" },
            { id: 603, name: "Dalia Sameh", email: "dalia@student.com", avatar: "https://i.pravatar.cc/150?u=s603" },
            { id: 604, name: "Wael Yasser", email: "wael@student.com", avatar: "https://i.pravatar.cc/150?u=s604" },
            { id: 605, name: "Heba Fawzy", email: "heba@student.com", avatar: "https://i.pravatar.cc/150?u=s605" },
        ],
        blocks: [mockBlocks[1], mockBlocks[3]],
        createdAt: "2025-02-10T07:00:00Z",
        updatedAt: "2025-02-19T15:00:00Z",
    },
];
