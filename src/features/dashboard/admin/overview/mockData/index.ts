export const dashboardStats = {
    totalPrograms: 2,
    totalLevels: 28,
    totalLessons: 156,
    activeStudents: 1847,
};

export const curriculumGrowthData = [
    { month: "Jan", monthKey: "overview:overview.months.jan", value: 50 },
    { month: "Feb", monthKey: "overview:overview.months.feb", value: 80 },
    { month: "Mar", monthKey: "overview:overview.months.mar", value: 150 },
    { month: "Apr", monthKey: "overview:overview.months.apr", value: 280 },
    { month: "May", monthKey: "overview:overview.months.may", value: 420 },
    { month: "Jun", monthKey: "overview:overview.months.jun", value: 520 },
];

export const studentDistributionData = [
    {
        category: "Standard",
        categoryKey: "overview:overview.charts.studentDistribution.standard",
        value: 450,
    },
    {
        category: "Professional",
        categoryKey:
            "overview:overview.charts.studentDistribution.professional",
        value: 180,
    },
];

export const recentActivities = [
    {
        id: "1",
        type: "lesson" as const,
        titleKey:
            "overview:overview.recentActivity.items.lessonPublished.title",
        title: "Lesson Published",
        descriptionKey:
            "overview:overview.recentActivity.items.lessonPublished.description",
        description: "Python Fundamentals - Variables and Data Types",
        timeKey: "overview:overview.recentActivity.items.lessonPublished.time",
        time: "2 hours ago",
        authorKey:
            "overview:overview.recentActivity.items.lessonPublished.author",
        author: "by Sarah Ahmed",
    },
    {
        id: "2",
        type: "level" as const,
        titleKey: "overview:overview.recentActivity.items.levelUpdated.title",
        title: "Level Updated",
        descriptionKey:
            "overview:overview.recentActivity.items.levelUpdated.description",
        description: "Machine Learning for Kids - Level 1",
        timeKey: "overview:overview.recentActivity.items.levelUpdated.time",
        time: "5 hours ago",
        authorKey: "overview:overview.recentActivity.items.levelUpdated.author",
        author: "by Ahmed Khalil",
    },
    {
        id: "3",
        type: "content" as const,
        titleKey: "overview:overview.recentActivity.items.contentAdded.title",
        title: "Content Added",
        descriptionKey:
            "overview:overview.recentActivity.items.contentAdded.description",
        description: "New video: Introduction to HTML",
        timeKey: "overview:overview.recentActivity.items.contentAdded.time",
        time: "1 day ago",
        authorKey: "overview:overview.recentActivity.items.contentAdded.author",
        author: "by Mohamed Hassan",
    },
    {
        id: "4",
        type: "track" as const,
        titleKey: "overview:overview.recentActivity.items.trackCreated.title",
        title: "Track Created",
        descriptionKey:
            "overview:overview.recentActivity.items.trackCreated.description",
        description: "Mobile App Development Track",
        timeKey: "overview:overview.recentActivity.items.trackCreated.time",
        time: "2 days ago",
        authorKey: "overview:overview.recentActivity.items.trackCreated.author",
        author: "by Fatima Ali",
    },
];
