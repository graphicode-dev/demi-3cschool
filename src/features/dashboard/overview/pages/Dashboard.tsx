/**
 * Dashboard Page
 *
 * Main overview page displaying curriculum statistics, quick actions,
 * charts, and recent activity.
 */

import { useTranslation } from "react-i18next";
import {
    LayoutGrid,
    Layers,
    FileText,
    Users,
    TrendingUp,
    PenSquare,
    Plus,
    FolderOpen,
} from "lucide-react";
import {
    StatsCard,
    QuickActionCard,
    CurriculumGrowthChart,
    StudentDistributionChart,
    RecentActivityList,
} from "../components";
import {
    dashboardStats,
    curriculumGrowthData,
    studentDistributionData,
    recentActivities,
} from "../mockData";
import PageWrapper from "@/design-system/components/PageWrapper";

function DashboardPage() {
    const { t } = useTranslation();

    return (
        <PageWrapper
            pageHeaderProps={{
                title: t("overview:overview.title"),
                subtitle: t("overview:overview.description"),
            }}
        >
            {/* Stats Cards */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <StatsCard
                    icon={LayoutGrid}
                    iconBgColor="bg-brand-50 dark:bg-brand-500/10"
                    iconColor="text-brand-500"
                    value={dashboardStats.totalPrograms}
                    labelKey="overview:overview.stats.totalPrograms"
                    label="Total Programs"
                    trend={{ value: "+100%", isPositive: true }}
                    trendIcon={TrendingUp}
                />
                <StatsCard
                    icon={Layers}
                    iconBgColor="bg-success-50 dark:bg-success-500/10"
                    iconColor="text-success-500"
                    value={dashboardStats.totalLevels}
                    labelKey="overview:overview.stats.totalLevels"
                    label="Total Levels"
                    trend={{ value: "+12%", isPositive: true }}
                    trendIcon={TrendingUp}
                />
                <StatsCard
                    icon={FileText}
                    iconBgColor="bg-warning-50 dark:bg-warning-500/10"
                    iconColor="text-warning-500"
                    value={dashboardStats.totalLessons}
                    labelKey="overview:overview.stats.totalLessons"
                    label="Total Lessons"
                    trend={{ value: "+18%", isPositive: true }}
                    trendIcon={TrendingUp}
                />
                <StatsCard
                    icon={Users}
                    iconBgColor="bg-orange-50 dark:bg-orange-500/10"
                    iconColor="text-orange-500"
                    value={dashboardStats.activeStudents.toLocaleString()}
                    labelKey="overview:overview.stats.activeStudents"
                    label="Active Students"
                    trend={{ value: "+25%", isPositive: true }}
                    trendIcon={TrendingUp}
                />
            </div>

            {/* Quick Actions */}
            <div>
                <h2 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">
                    {t("overview:overview.quickActions.title", "Quick Actions")}
                </h2>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    <QuickActionCard
                        icon={PenSquare}
                        iconBgColor="bg-brand-50 dark:bg-brand-500/10"
                        iconColor="text-brand-500"
                        titleKey="overview:overview.quickActions.editCurriculum.title"
                        title="Edit Curriculum"
                        descriptionKey="overview:overview.quickActions.editCurriculum.description"
                        description="Manage programs, levels, and learning paths"
                        actionLabelKey="overview:overview.quickActions.editCurriculum.action"
                        actionLabel="Get Started"
                    />
                    <QuickActionCard
                        icon={Plus}
                        iconBgColor="bg-success-50 dark:bg-success-500/10"
                        iconColor="text-success-500"
                        titleKey="overview:overview.quickActions.addNewLesson.title"
                        title="Add New Lesson"
                        descriptionKey="overview:overview.quickActions.addNewLesson.description"
                        description="Create engaging content for students"
                        actionLabelKey="overview:overview.quickActions.addNewLesson.action"
                        actionLabel="Get Started"
                    />
                    <QuickActionCard
                        icon={FolderOpen}
                        iconBgColor="bg-warning-50 dark:bg-warning-500/10"
                        iconColor="text-warning-500"
                        titleKey="overview:overview.quickActions.contentLibrary.title"
                        title="Content Library"
                        descriptionKey="overview:overview.quickActions.contentLibrary.description"
                        description="Browse and manage all learning materials"
                        actionLabelKey="overview:overview.quickActions.contentLibrary.action"
                        actionLabel="Get Started"
                    />
                </div>
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                <CurriculumGrowthChart data={curriculumGrowthData} />
                <StudentDistributionChart data={studentDistributionData} />
            </div>

            {/* Recent Activity */}
            <RecentActivityList activities={recentActivities} />
        </PageWrapper>
    );
}

export default DashboardPage;
