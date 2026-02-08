/**
 * Profile Page
 *
 * Student profile page with tabs for different sections.
 * Uses the design-system Tabs component.
 */

import { lazy, Suspense } from "react";
import { useTranslation } from "react-i18next";
import { useSearchParams } from "react-router-dom";
import {
    Edit,
    Users,
    FileText,
    User,
    GraduationCap,
    History,
    ClipboardCheck,
    BookOpen,
    Receipt,
    CreditCard,
} from "lucide-react";
import { Tabs } from "@/design-system";
import type { ProfileTabType } from "../types/profile.types";
import {
    mockStudentProfile,
    mockAcademicDetails,
    mockGroupHistory,
    mockAttendanceStats,
    mockAttendanceRecords,
    mockAssignments,
    mockInvoices,
    mockInstallments,
} from "../mockData/profile.mock";
import { PageWrapper } from "@/design-system";
import { authStore } from "@/auth";

const PersonalDetailsTab = lazy(
    () => import("../components/PersonalDetailsTab")
);
const AcademicDetailsTab = lazy(
    () => import("../components/AcademicDetailsTab")
);
const GroupHistoryTab = lazy(() => import("../components/GroupHistoryTab"));
const AttendanceTab = lazy(() => import("../components/AttendanceTab"));
const AssignmentsTab = lazy(() => import("../components/AssignmentsTab"));
const InvoicesTab = lazy(() => import("../components/InvoicesTab"));
const InstallmentsTab = lazy(() => import("../components/InstallmentsTab"));

function TabLoader() {
    return (
        <div className="flex items-center justify-center h-64">
            <div className="w-8 h-8 border-2 border-brand-500 border-t-transparent rounded-full animate-spin" />
        </div>
    );
}

function ProfilePage() {
    const { t } = useTranslation();
    const { user } = authStore();
    const isAdmin = user?.role?.name === "admin";
    const [searchParams, setSearchParams] = useSearchParams();
    const activeTab = (searchParams.get("tab") as ProfileTabType) || "personal";

    const tabs: {
        key: ProfileTabType;
        labelKey: string;
        fallback: string;
        icon: React.ReactNode;
        show: boolean;
    }[] = [
        {
            key: "personal",
            labelKey: "account:profile.tabs.personal",
            fallback: "Personal Details",
            icon: <User className="w-4 h-4" />,
            show: true,
        },
        {
            key: "academic",
            labelKey: "account:profile.tabs.academic",
            fallback: "Academic Details",
            icon: <GraduationCap className="w-4 h-4" />,
            show: true,
        },
        {
            key: "groups",
            labelKey: "account:profile.tabs.groups",
            fallback: "Group History",
            icon: <History className="w-4 h-4" />,
            show: true,
        },
        {
            key: "attendance",
            labelKey: "account:profile.tabs.attendance",
            fallback: "Attendance",
            icon: <ClipboardCheck className="w-4 h-4" />,
            show: true,
        },
        {
            key: "assignments",
            labelKey: "account:profile.tabs.assignments",
            fallback: "Assignments",
            icon: <BookOpen className="w-4 h-4" />,
            show: true,
        },
        {
            key: "invoices",
            labelKey: "account:profile.tabs.invoices",
            fallback: "Invoices",
            icon: <Receipt className="w-4 h-4" />,
            show: isAdmin,
        },
        {
            key: "installments",
            labelKey: "account:profile.tabs.installments",
            fallback: "Installments",
            icon: <CreditCard className="w-4 h-4" />,
            show: isAdmin,
        },
    ];

    const handleTabChange = (value: string) => {
        setSearchParams({ tab: value });
    };

    const profile = mockStudentProfile;

    return (
        <PageWrapper>
            {/* Profile Header Card */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
                {/* Profile Info */}
                <div className="flex items-center gap-5">
                    {/* Avatar */}
                    <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-brand-100 dark:border-brand-900 shrink-0">
                        {profile.avatar ? (
                            <img
                                src={profile.avatar}
                                alt={profile.fullName}
                                className="w-full h-full object-cover"
                            />
                        ) : (
                            <div className="w-full h-full bg-brand-100 dark:bg-brand-900 flex items-center justify-center">
                                <User className="w-10 h-10 text-brand-500" />
                            </div>
                        )}
                    </div>

                    {/* Name & Details */}
                    <div>
                        <div className="flex items-center gap-3 mb-1">
                            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                                {profile.fullName}
                            </h1>
                            <span
                                className={`px-3 py-1 rounded-full text-xs font-medium ${
                                    profile.status === "active"
                                        ? "bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400"
                                        : "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400"
                                }`}
                            >
                                {t(
                                    `account:profile.status.${profile.status}`,
                                    profile.status
                                )}
                            </span>
                        </div>
                        <p className="text-gray-500 dark:text-gray-400">
                            {profile.age}{" "}
                            {t("account:profile.yearsOld", "years old")} •{" "}
                            {profile.learningType}
                        </p>
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center gap-3">
                    <button className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                        <Edit className="w-4 h-4" />
                        {t("account:profile.editProfile", "Edit Profile")}
                    </button>
                    {isAdmin && (
                        <>
                            <button className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                                <Users className="w-4 h-4" />
                                {t(
                                    "account:profile.assignToGroup",
                                    "Assign to group"
                                )}
                            </button>
                            <button className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-white bg-brand-500 hover:bg-brand-600 rounded-lg transition-colors">
                                <FileText className="w-4 h-4" />
                                {t(
                                    "account:profile.createInvoice",
                                    "Create Invoice"
                                )}
                            </button>
                        </>
                    )}
                </div>
            </div>

            {/* Tabs Section */}
            <Tabs
                value={activeTab}
                onChange={handleTabChange}
                variant="underline"
                className="mt-15"
            >
                <div className="bg-white dark:bg-gray-800 rounded-t-2xl border border-gray-200 dark:border-gray-700 px-6 pt-4 shadow-sm">
                    <Tabs.List>
                        {tabs
                            .filter((tab) => tab.show)
                            .map((tab) => (
                                <Tabs.Item
                                    key={tab.key}
                                    value={tab.key}
                                    label={t(tab.labelKey, tab.fallback)}
                                    icon={tab.icon}
                                />
                            ))}
                    </Tabs.List>
                </div>

                <Tabs.Content>
                    <Tabs.Panel value="personal">
                        <Suspense fallback={<TabLoader />}>
                            <PersonalDetailsTab profile={profile} />
                        </Suspense>
                    </Tabs.Panel>
                    <Tabs.Panel value="academic">
                        <Suspense fallback={<TabLoader />}>
                            <AcademicDetailsTab
                                academicDetails={mockAcademicDetails}
                            />
                        </Suspense>
                    </Tabs.Panel>
                    <Tabs.Panel value="groups">
                        <Suspense fallback={<TabLoader />}>
                            <GroupHistoryTab groupHistory={mockGroupHistory} />
                        </Suspense>
                    </Tabs.Panel>
                    <Tabs.Panel value="attendance">
                        <Suspense fallback={<TabLoader />}>
                            <AttendanceTab
                                stats={mockAttendanceStats}
                                records={mockAttendanceRecords}
                            />
                        </Suspense>
                    </Tabs.Panel>
                    <Tabs.Panel value="assignments">
                        <Suspense fallback={<TabLoader />}>
                            <AssignmentsTab assignments={mockAssignments} />
                        </Suspense>
                    </Tabs.Panel>
                    {isAdmin && (
                        <>
                            <Tabs.Panel value="invoices">
                                <Suspense fallback={<TabLoader />}>
                                    <InvoicesTab invoices={mockInvoices} />
                                </Suspense>
                            </Tabs.Panel>
                            <Tabs.Panel value="installments">
                                <Suspense fallback={<TabLoader />}>
                                    <InstallmentsTab
                                        installments={mockInstallments}
                                    />
                                </Suspense>
                            </Tabs.Panel>
                        </>
                    )}
                </Tabs.Content>
            </Tabs>
        </PageWrapper>
    );
}

export default ProfilePage;
