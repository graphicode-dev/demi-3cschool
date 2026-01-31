import { useState } from "react";
import { useTranslation } from "react-i18next";
import {
    StatCard,
    DonutChart,
    HorizontalBarChart,
    LineChart,
    TrackCard,
} from "../components";
import PageWrapper from "@/design-system/components/PageWrapper";

const TotalGroupsIcon = () => (
    <svg
        className="w-6 h-6"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
    >
        <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
        />
    </svg>
);

const ActiveGroupsIcon = () => (
    <svg
        className="w-6 h-6"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
    >
        <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
        />
    </svg>
);

const StudentsIcon = () => (
    <svg
        className="w-6 h-6"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
    >
        <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"
        />
    </svg>
);

const CompletedIcon = () => (
    <svg
        className="w-6 h-6"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
    >
        <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M5 13l4 4L19 7"
        />
    </svg>
);

const SearchIcon = () => (
    <svg
        className="w-4 h-4"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
    >
        <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
        />
    </svg>
);

const ChevronDownIcon = () => (
    <svg
        className="w-4 h-4"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
    >
        <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M19 9l-7 7-7-7"
        />
    </svg>
);

const MOCK_STANDARD_STATUS_DATA = [
    { label: "Active", value: 3, color: "#ef4444" },
    { label: "Inactive", value: 2, color: "#fbbf24" },
    { label: "Completed", value: 1, color: "#22c55e" },
];

const MOCK_PROFESSIONAL_STATUS_DATA = [
    { label: "Active", value: 4, color: "#ef4444" },
    { label: "Inactive", value: 1, color: "#fbbf24" },
    { label: "Completed", value: 2, color: "#22c55e" },
];

const MOCK_STANDARD_STUDENTS_PER_TRACK = [
    { label: "Web Development", value: 45, maxValue: 50, color: "#22d3ee" },
    {
        label: "Mobile App Development",
        value: 38,
        maxValue: 50,
        color: "#22d3ee",
    },
    { label: "Game Development", value: 32, maxValue: 50, color: "#22d3ee" },
    { label: "AI & ML Training", value: 28, maxValue: 50, color: "#22d3ee" },
    { label: "Cyber Security", value: 22, maxValue: 50, color: "#22d3ee" },
];

const MOCK_PROFESSIONAL_STUDENTS_PER_TRACK = [
    { label: "Web Development", value: 52, maxValue: 60, color: "#22d3ee" },
    {
        label: "Mobile App Development",
        value: 44,
        maxValue: 60,
        color: "#22d3ee",
    },
    { label: "Game Development", value: 36, maxValue: 60, color: "#22d3ee" },
    {
        label: "AI & Machine Learning",
        value: 30,
        maxValue: 60,
        color: "#22d3ee",
    },
    { label: "Cyber Security", value: 25, maxValue: 60, color: "#22d3ee" },
];

const MOCK_GROWTH_DATA = [
    { label: "Jan", value: 20 },
    { label: "Feb", value: 35 },
    { label: "Mar", value: 45 },
    { label: "Apr", value: 40 },
    { label: "May", value: 55 },
    { label: "Jun", value: 65 },
    { label: "Jul", value: 60 },
    { label: "Aug", value: 75 },
    { label: "Sep", value: 85 },
    { label: "Oct", value: 80 },
    { label: "Nov", value: 90 },
    { label: "Dec", value: 95 },
];

const MOCK_STANDARD_TRACKS = [
    { title: "Web Development", groups: 5, students: 45, avgProgress: 72 },
    {
        title: "Mobile App Development",
        groups: 4,
        students: 38,
        avgProgress: 68,
    },
    { title: "Game Development", groups: 3, students: 32, avgProgress: 55 },
    {
        title: "AI & Machine Learning",
        groups: 2,
        students: 28,
        avgProgress: 45,
    },
    { title: "Cyber Security", groups: 2, students: 22, avgProgress: 60 },
];

const MOCK_PROFESSIONAL_TRACKS = [
    { title: "Web Development", groups: 6, students: 52, avgProgress: 78 },
    {
        title: "Mobile App Development",
        groups: 5,
        students: 44,
        avgProgress: 72,
    },
    { title: "Game Development", groups: 4, students: 36, avgProgress: 65 },
    {
        title: "AI & Machine Learning",
        groups: 3,
        students: 30,
        avgProgress: 58,
    },
    { title: "Cyber Security", groups: 2, students: 25, avgProgress: 55 },
];

function GroupsAnalyticsPage() {
    const { t } = useTranslation("groupsAnalytics");
    const [activeTab, setActiveTab] = useState<"standard" | "professional">(
        "standard"
    );

    const stats = {
        totalGroups: 6,
        activeGroups: 3,
        totalStudents: 90,
        completed: 4,
    };

    return (
        <PageWrapper
            pageHeaderProps={{
                title: t("groupsAnalytics.title", "Groups Management"),
                subtitle: t(
                    "groupsAnalytics.subtitle",
                    "Manage group analytics, Attendance and Performance tracking program"
                ),
                actions: (
                    <button className="inline-flex items-center gap-2 px-4 py-2.5 bg-brand-500 text-white text-sm font-medium rounded-lg hover:bg-brand-600 transition-colors">
                        <svg
                            className="w-4 h-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M12 4v16m8-8H4"
                            />
                        </svg>
                        {t(
                            "groupsAnalytics.actions.createNew",
                            "Create New Group"
                        )}
                    </button>
                ),
            }}
        >
            <div className="flex flex-col gap-4">
                <div className="flex items-center justify-between">
                    <div className="flex gap-2">
                        <button
                            onClick={() => setActiveTab("standard")}
                            className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                                activeTab === "standard"
                                    ? "bg-brand-500 text-white"
                                    : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700"
                            }`}
                        >
                            {t(
                                "groupsAnalytics.tabs.standard",
                                "Standard Learning"
                            )}
                        </button>
                        <button
                            onClick={() => setActiveTab("professional")}
                            className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                                activeTab === "professional"
                                    ? "bg-brand-500 text-white"
                                    : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700"
                            }`}
                        >
                            {t(
                                "groupsAnalytics.tabs.professional",
                                "Professional Learning"
                            )}
                        </button>
                    </div>
                </div>

                <div className="flex items-center justify-between gap-4">
                    <div className="relative flex-1 max-w-md">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                            <SearchIcon />
                        </div>
                        <input
                            type="text"
                            placeholder={t(
                                "groupsAnalytics.search.placeholder",
                                "Search groups by name, track, or level..."
                            )}
                            className="w-full pl-10 pr-4 py-2 text-sm bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-gray-700 dark:text-gray-300 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent"
                        />
                    </div>

                    <div className="flex gap-2">
                        <div className="relative">
                            <select className="appearance-none px-3 py-2 pr-8 text-sm bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-gray-700 dark:text-gray-300">
                                <option>
                                    {t(
                                        "groupsAnalytics.filters.allTracks",
                                        "All Tracks"
                                    )}
                                </option>
                            </select>
                            <div className="absolute inset-y-0 right-0 pr-2 flex items-center pointer-events-none text-gray-400">
                                <ChevronDownIcon />
                            </div>
                        </div>
                        <div className="relative">
                            <select className="appearance-none px-3 py-2 pr-8 text-sm bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-gray-700 dark:text-gray-300">
                                <option>
                                    {t(
                                        "groupsAnalytics.filters.allLevels",
                                        "All Levels"
                                    )}
                                </option>
                            </select>
                            <div className="absolute inset-y-0 right-0 pr-2 flex items-center pointer-events-none text-gray-400">
                                <ChevronDownIcon />
                            </div>
                        </div>
                        <div className="relative">
                            <select className="appearance-none px-3 py-2 pr-8 text-sm bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-gray-700 dark:text-gray-300">
                                <option>
                                    {t(
                                        "groupsAnalytics.filters.allStatus",
                                        "All Status"
                                    )}
                                </option>
                            </select>
                            <div className="absolute inset-y-0 right-0 pr-2 flex items-center pointer-events-none text-gray-400">
                                <ChevronDownIcon />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <StatCard
                    title={t(
                        "groupsAnalytics.stats.totalGroups",
                        "Total Groups"
                    )}
                    value={stats.totalGroups}
                    icon={<TotalGroupsIcon />}
                    variant="primary"
                />
                <StatCard
                    title={t(
                        "groupsAnalytics.stats.activeGroups",
                        "Active Groups"
                    )}
                    value={stats.activeGroups}
                    icon={<ActiveGroupsIcon />}
                    variant="success"
                />
                <StatCard
                    title={t(
                        "groupsAnalytics.stats.totalStudents",
                        "Total Students"
                    )}
                    value={stats.totalStudents}
                    icon={<StudentsIcon />}
                    variant="primary"
                />
                <StatCard
                    title={t(
                        "groupsAnalytics.stats.completedGroups",
                        "Completed"
                    )}
                    value={stats.completed}
                    icon={<CompletedIcon />}
                    variant="warning"
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                        {t(
                            "groupsAnalytics.charts.groupStatus",
                            "Group Status Distribution"
                        )}
                    </h3>
                    <DonutChart
                        data={
                            activeTab === "standard"
                                ? MOCK_STANDARD_STATUS_DATA
                                : MOCK_PROFESSIONAL_STATUS_DATA
                        }
                        centerValue={6}
                    />
                </div>

                <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                        {t(
                            "groupsAnalytics.charts.studentsPerTrack",
                            "Students per Track"
                        )}
                    </h3>
                    <HorizontalBarChart
                        data={
                            activeTab === "standard"
                                ? MOCK_STANDARD_STUDENTS_PER_TRACK
                                : MOCK_PROFESSIONAL_STUDENTS_PER_TRACK
                        }
                        valueFormatter={(v) => `${v} students`}
                    />
                </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                    {t(
                        "groupsAnalytics.charts.studentGrowth",
                        "Student Growth Over Time"
                    )}
                </h3>
                <LineChart data={MOCK_GROWTH_DATA} height={250} />
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                    {t(
                        "groupsAnalytics.trackOverview.title",
                        "Track Overview - Professional Learning"
                    )}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {(activeTab === "standard"
                        ? MOCK_STANDARD_TRACKS
                        : MOCK_PROFESSIONAL_TRACKS
                    ).map((track, index) => (
                        <TrackCard
                            key={index}
                            title={track.title}
                            groups={track.groups}
                            students={track.students}
                            avgProgress={track.avgProgress}
                        />
                    ))}
                </div>
            </div>
        </PageWrapper>
    );
}

export default GroupsAnalyticsPage;
