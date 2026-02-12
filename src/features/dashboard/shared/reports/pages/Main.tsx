import { useState, useMemo, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Eye } from "lucide-react";
import {
    PageWrapper,
    DynamicTable,
    useServerTableSearch,
} from "@/design-system";
import type { TableColumn, TableData } from "@/shared/types";
import { useReportsList } from "../api";
import type { Report, ReportStatus } from "../types";

const MOCK_REPORTS: Report[] = [
    {
        id: "1",
        studentId: "S001",
        studentName: "Ahmed Mohamed",
        level: { id: "1", title: "Level 3" },
        track: { id: "1", title: "Web Development" },
        reportType: "mid_report",
        status: "draft",
        instructor: { id: "1", name: "Ms. Emily Chen" },
        updatedAt: "2026-01-15",
    },
    {
        id: "2",
        studentId: "S002",
        studentName: "Ahmed Mohamed",
        level: { id: "1", title: "Level 3" },
        track: { id: "1", title: "Web Development" },
        reportType: "final_report",
        status: "ready",
        instructor: { id: "1", name: "Ms. Emily Chen" },
        updatedAt: "2026-01-15",
    },
    {
        id: "3",
        studentId: "S003",
        studentName: "Ahmed Mohamed",
        level: { id: "1", title: "Level 3" },
        track: { id: "1", title: "Web Development" },
        reportType: "mid_report",
        status: "sent",
        instructor: { id: "1", name: "Ms. Emily Chen" },
        updatedAt: "2026-01-15",
    },
];

const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
    });
};

function ReportsPage() {
    const { t } = useTranslation("account");
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();

    const currentPage = Number(searchParams.get("page")) || 1;

    const { searchQuery, setSearchQuery, debouncedSearchQuery } =
        useServerTableSearch({
            delayMs: 400,
        });
    const getStatusLabel = (status: ReportStatus) => {
        return t(`reports.status.${status}`, status);
    };

    const getReportTypeLabel = (type: string) => {
        return t(`reports.reportType.${type}`, type);
    };

    const transformReportToTableData = (report: Report): TableData => ({
        id: report.id,
        avatar: "",
        columns: {
            id: report.id,
            student: report.studentName,
            level: report.level.title,
            track: report.track.title,
            reportType: getReportTypeLabel(report.reportType),
            status: getStatusLabel(report.status),
            statusRaw: report.status,
            instructor: report.instructor.name,
            updated: formatDate(report.updatedAt),
        },
    });

    const { data, isLoading, isError } = useReportsList({
        page: currentPage,
        search: debouncedSearchQuery || undefined,
    });

    const reports = data?.items || MOCK_REPORTS;

    const stats = useMemo(() => {
        const total = reports.length;
        const draft = reports.filter((r) => r.status === "draft").length;
        const ready = reports.filter((r) => r.status === "ready").length;
        const sent = reports.filter((r) => r.status === "sent").length;
        return { total, draft, ready, sent };
    }, [reports]);

    const tableData: TableData[] = useMemo(
        () => reports.map(transformReportToTableData),
        [reports, transformReportToTableData]
    );

    const handleViewReport = useCallback(
        (reportId: string) => {
            navigate(`reports/view/${reportId}`);
        },
        [navigate]
    );

    const columns: TableColumn[] = useMemo(
        () => [
            {
                id: "id",
                header: t("reports.table.id", "ID"),
                accessorKey: "id",
                sortable: true,
            },
            {
                id: "student",
                header: t("reports.table.student", "Student"),
                accessorKey: "student",
                sortable: true,
            },
            {
                id: "level",
                header: t("reports.table.level", "Level"),
                accessorKey: "level",
                sortable: true,
            },
            {
                id: "track",
                header: t("reports.table.track", "Track"),
                accessorKey: "track",
                sortable: true,
            },
            {
                id: "reportType",
                header: t("reports.table.reportType", "Report Type"),
                accessorKey: "reportType",
                sortable: true,
            },
            {
                id: "status",
                header: t("reports.table.status", "Status"),
                accessorKey: "status",
                sortable: true,
            },
            {
                id: "instructor",
                header: t("reports.table.instructor", "Instructor"),
                accessorKey: "instructor",
                sortable: true,
            },
            {
                id: "updated",
                header: t("reports.table.updated", "Updated"),
                accessorKey: "updated",
                sortable: true,
            },
            {
                id: "action",
                header: t("reports.table.action", "Action"),
                accessorKey: "action",
                sortable: false,
                cell: ({ row }) => (
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            handleViewReport(row.id);
                        }}
                        className="inline-flex items-center gap-1.5 text-sm font-medium text-brand-500 hover:text-brand-600 transition-colors"
                    >
                        <Eye className="w-4 h-4" />
                        {t("reports.actions.view", "View")}
                    </button>
                ),
            },
        ],
        [t, handleViewReport]
    );

    return (
        <PageWrapper
            pageHeaderProps={{
                title: t("reports.title", "Student Reports"),
                subtitle: t(
                    "reports.subtitle",
                    "Review and manage student reports before sending to parents"
                ),
            }}
        >
            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4">
                    <div className="flex items-center gap-3">
                        <div className="w-1 h-12 bg-purple-500 rounded-full" />
                        <div>
                            <p className="text-2xl font-bold text-gray-900 dark:text-white">
                                {stats.total}
                            </p>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                {t(
                                    "reports.stats.totalReports",
                                    "Total Reports"
                                )}
                            </p>
                        </div>
                    </div>
                </div>
                <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4">
                    <div className="flex items-center gap-3">
                        <div className="w-1 h-12 bg-orange-500 rounded-full" />
                        <div>
                            <p className="text-2xl font-bold text-gray-900 dark:text-white">
                                {stats.draft}
                            </p>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                {t("reports.stats.draft", "Draft")}
                            </p>
                        </div>
                    </div>
                </div>
                <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4">
                    <div className="flex items-center gap-3">
                        <div className="w-1 h-12 bg-cyan-500 rounded-full" />
                        <div>
                            <p className="text-2xl font-bold text-gray-900 dark:text-white">
                                {stats.ready}
                            </p>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                {t("reports.stats.ready", "Ready")}
                            </p>
                        </div>
                    </div>
                </div>
                <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4">
                    <div className="flex items-center gap-3">
                        <div className="w-1 h-12 bg-green-500 rounded-full" />
                        <div>
                            <p className="text-2xl font-bold text-gray-900 dark:text-white">
                                {stats.sent}
                            </p>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                {t("reports.stats.sent", "Sent")}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Reports Table */}
            <DynamicTable
                title={t("reports.listTitle", "Reports")}
                data={tableData}
                columns={columns}
                initialView="grid"
                hideHeader={true}
                searchQuery={searchQuery}
                onSearchChange={setSearchQuery}
                // State
                isLoading={isLoading}
                isError={isError}
                errorMessage={t(
                    "reports.errors.loadFailed",
                    "Failed to load reports"
                )}
            />
        </PageWrapper>
    );
}

export default ReportsPage;
