/**
 * Attendance Audit Log Page
 *
 * Displays all attendance modifications for accountability and compliance.
 */

import React, { useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { ArrowRight } from "lucide-react";
import PageWrapper from "@/design-system/components/PageWrapper";
import { DynamicTable } from "@/design-system/components/table";
import type { TableColumn, TableData } from "@/shared/types/table.types";

// Helper to format date for display
const formatDateForDisplay = (dateString: string): string => {
    try {
        const date = new Date(dateString);
        return date.toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
        });
    } catch {
        return dateString;
    }
};

// Helper to format time for display
const formatTimeForDisplay = (dateString: string): string => {
    try {
        const date = new Date(dateString);
        return date.toLocaleTimeString("en-US", {
            hour: "numeric",
            minute: "2-digit",
            hour12: true,
        });
    } catch {
        return "";
    }
};

// Type badge component
const TypeBadge: React.FC<{ type: string }> = ({ type }) => {
    const getTypeConfig = (type: string) => {
        switch (type) {
            case "student":
                return {
                    label: "Student",
                    className: "bg-green-100 text-green-700",
                };
            case "instructor":
                return {
                    label: "Instructor",
                    className: "bg-blue-100 text-blue-700",
                };
            default:
                return {
                    label: type,
                    className: "bg-gray-100 text-gray-700",
                };
        }
    };

    const config = getTypeConfig(type);

    return (
        <span
            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.className}`}
        >
            {config.label}
        </span>
    );
};

// Status badge component
const StatusBadge: React.FC<{ status: string }> = ({ status }) => {
    const getStatusConfig = (status: string) => {
        switch (status) {
            case "present":
                return {
                    label: "Present",
                    className: "bg-green-100 text-green-700",
                };
            case "absent":
                return {
                    label: "Absent",
                    className: "bg-red-100 text-red-700",
                };
            default:
                return {
                    label: status,
                    className: "bg-gray-100 text-gray-700",
                };
        }
    };

    const config = getStatusConfig(status);

    return (
        <span
            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.className}`}
        >
            {config.label}
        </span>
    );
};

// Mock audit log data - in real app, this would come from an API
const mockAuditData = [
    {
        id: "1",
        dateTime: "2026-01-28T02:35:00",
        session: "1- Control Flow: If Statements",
        type: "student",
        name: "Sarah Jenkins",
        fromStatus: "present",
        toStatus: "absent",
        modifiedBy: "Jennifer Anderson",
        modifiedByRole: "Operations Manager",
    },
    {
        id: "2",
        dateTime: "2024-10-24T09:00:00",
        session: "2- Control Flow: If Statements",
        type: "student",
        name: "Sarah Jenkins",
        fromStatus: "present",
        toStatus: "absent",
        modifiedBy: "Jennifer Anderson",
        modifiedByRole: "Operations Manager",
    },
    {
        id: "3",
        dateTime: "2024-10-24T09:00:00",
        session: "3- Control Flow: If Statements",
        type: "instructor",
        name: "Dr. Sarah Jenkins",
        fromStatus: "present",
        toStatus: "absent",
        modifiedBy: "Jennifer Anderson",
        modifiedByRole: "Operations Manager",
    },
];

export const AttendanceAuditLogPage = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();

    // Convert audit data to table format
    const tableData: TableData[] = useMemo(() => {
        return mockAuditData.map((record) => ({
            id: record.id,
            columns: {
                dateTime: record.dateTime,
                session: record.session,
                type: record.type,
                name: record.name,
                fromStatus: record.fromStatus,
                toStatus: record.toStatus,
                modifiedBy: record.modifiedBy,
                modifiedByRole: record.modifiedByRole,
            },
        }));
    }, []);

    // Table columns matching Figma design
    const columns: TableColumn[] = [
        {
            id: "dateTime",
            header: t("attendance.dateTime", "Date & Time"),
            accessorKey: "dateTime",
            sortable: true,
            cell: ({ row }: { row: TableData }) => (
                <div className="text-sm">
                    <div className="text-gray-900 dark:text-white font-medium">
                        {formatDateForDisplay(row.columns.dateTime as string)}
                    </div>
                    <div className="text-gray-500 dark:text-gray-400">
                        {formatTimeForDisplay(row.columns.dateTime as string)}
                    </div>
                </div>
            ),
        },
        {
            id: "session",
            header: t("attendance.session", "Session"),
            accessorKey: "session",
            sortable: true,
            cell: ({ row }: { row: TableData }) => (
                <span className="text-sm text-gray-900 dark:text-white">
                    {row.columns.session}
                </span>
            ),
        },
        {
            id: "type",
            header: t("attendance.type", "Type"),
            accessorKey: "type",
            sortable: true,
            cell: ({ row }: { row: TableData }) => (
                <TypeBadge type={row.columns.type as string} />
            ),
        },
        {
            id: "name",
            header: t("attendance.name", "Name"),
            accessorKey: "name",
            sortable: true,
            cell: ({ row }: { row: TableData }) => (
                <span className="text-sm text-gray-900 dark:text-white">
                    {row.columns.name}
                </span>
            ),
        },
        {
            id: "statusChange",
            header: t("attendance.statusChange", "Status Change"),
            accessorKey: "statusChange",
            sortable: false,
            cell: ({ row }: { row: TableData }) => (
                <div className="flex items-center gap-2">
                    <StatusBadge status={row.columns.fromStatus as string} />
                    <ArrowRight className="w-4 h-4 text-gray-400" />
                    <StatusBadge status={row.columns.toStatus as string} />
                </div>
            ),
        },
        {
            id: "modifiedBy",
            header: t("attendance.modifiedBy", "Modified By"),
            accessorKey: "modifiedBy",
            sortable: true,
            cell: ({ row }: { row: TableData }) => (
                <div className="text-sm">
                    <div className="text-gray-900 dark:text-white">
                        {row.columns.modifiedBy}
                    </div>
                    <div className="text-gray-500 dark:text-gray-400">
                        {row.columns.modifiedByRole}
                    </div>
                </div>
            ),
        },
    ];

    return (
        <PageWrapper
            pageHeaderProps={{
                title: t("attendance.auditLogTitle", "Attendance Audit Log"),
                subtitle: t(
                    "attendance.auditLogSubtitle",
                    "Review all attendance modifications for accountability and compliance."
                ),
                backButton: true,
            }}
        >
            <div className="space-y-6">
                <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden">
                    <DynamicTable
                        data={tableData}
                        columns={columns}
                        noPadding
                        disableRowClick
                    />
                </div>
            </div>
        </PageWrapper>
    );
};

export default AttendanceAuditLogPage;
