/**
 * Student Attendance Table Component
 *
 * Displays student attendance records with checkboxes, student info,
 * status badges, dates, teachers, and actions.
 */

import React, { useState, useRef, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { DynamicTable } from "@/design-system/components/table";
import { TableAvatar } from "@/design-system/components/table/TableAvatar";
import type { TableColumn, TableData } from "@/shared/types/table.types";
import type {
    StudentAttendance,
    AttendanceStatus,
} from "../types/attendance.types";
import ActionsDropdown, {
    DropdownAction,
} from "@/design-system/components/ActionsDropdown";
import { Check, Edit, Eye, X } from "lucide-react";

interface StudentAttendanceTableProps {
    students: StudentAttendance[];
    loading?: boolean;
    onSelectionChange?: (selectedIds: string[]) => void;
    onStatusUpdate?: (studentId: string, status: AttendanceStatus) => void;
    onViewProfile?: (studentId: string) => void;
    className?: string;
}

// Status badge component
const StatusBadge: React.FC<{ status: AttendanceStatus }> = ({ status }) => {
    const getStatusConfig = (status: AttendanceStatus) => {
        switch (status) {
            case "present":
                return {
                    label: "Present",
                    className:
                        "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400",
                };
            case "absent":
                return {
                    label: "Absent",
                    className:
                        "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400",
                };
            case "late":
                return {
                    label: "Late",
                    className:
                        "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400",
                };
            case "excused":
                return {
                    label: "Excused",
                    className:
                        "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400",
                };
            default:
                return {
                    label: "Unknown",
                    className:
                        "bg-gray-100 text-gray-800 dark:bg-gray-800/20 dark:text-gray-400",
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

export const StudentAttendanceTable: React.FC<StudentAttendanceTableProps> = ({
    students,
    loading = false,
    onSelectionChange,
    onStatusUpdate,
    onViewProfile,
    className = "",
}) => {
    const { t } = useTranslation();

    const handleAction = (action: string, itemId: string) => {
        alert(`${action} clicked for item: ${itemId}`);
    };

    const studentActions: DropdownAction[] = [
        {
            id: "edit",
            label: "Edit Attendance",
            onClick: (id) => handleAction("Edit Attendance", id),
            icon: <Edit size={16} />,
        },
        {
            id: "profile",
            label: "View Profile",
            onClick: (id) => handleAction("View Profile", id),
            icon: <Eye size={16} />,
        },
        {
            id: "present",
            label: "Mark Present",
            onClick: (id) => handleAction("Mark Present", id),
            icon: <Check size={16} />,
            className:
                "text-green-700 dark:text-green-300 hover:bg-green-50 dark:hover:bg-green-900/20",
        },
        {
            id: "absent",
            label: "Mark Absent",
            onClick: (id) => handleAction("Mark Absent", id),
            icon: <X size={16} />,
            className:
                "text-red-700 dark:text-red-300 hover:bg-red-50 dark:hover:bg-red-900/20",
        },
    ];

    // Convert student data to table format
    const tableData: TableData[] = students.map((student) => ({
        id: student.id,
        avatar: student.studentAvatar,
        selected: student.selected || false,
        columns: {
            student: student.studentName,
            status: student.status,
            attendanceDate: student.attendanceDate,
            attendanceTime: student.attendanceTime,
            primaryTeacher: student.primaryTeacher.name,
        },
    }));

    // Define table columns
    const columns: TableColumn[] = [
        {
            id: "student",
            header: t("attendance.student", "Student"),
            accessorKey: "student",
            sortable: true,
            cell: ({ row }: { row: any }) => (
                <div className="flex items-center space-x-3">
                    <TableAvatar
                        src={row.avatar}
                        initials={row.columns.student.charAt(0).toUpperCase()}
                        size="sm"
                    />
                    <span className="font-medium text-gray-900 dark:text-white">
                        {row.columns.student}
                    </span>
                </div>
            ),
        },
        {
            id: "status",
            header: t("attendance.attendanceStatus", "Attendance Status"),
            accessorKey: "status",
            sortable: true,
            cell: ({ row }: { row: any }) => (
                <StatusBadge status={row.columns.status as AttendanceStatus} />
            ),
        },
        {
            id: "attendanceDate",
            header: t("attendance.attendanceDate", "Attendance Date"),
            accessorKey: "attendanceDate",
            sortable: true,
            cell: ({ row }: { row: any }) => (
                <div className="text-sm text-gray-900 dark:text-white">
                    <div>{row.columns.attendanceDate}</div>
                    <div className="text-gray-500 dark:text-gray-400">
                        {row.columns.attendanceTime}
                    </div>
                </div>
            ),
        },
        {
            id: "primaryTeacher",
            header: t("attendance.primaryTeacher", "Primary Teacher"),
            accessorKey: "primaryTeacher",
            sortable: true,
            cell: ({ row }: { row: any }) => (
                <span className="text-sm text-gray-900 dark:text-white">
                    {row.columns.primaryTeacher}
                </span>
            ),
        },
        {
            id: "actions",
            header: "Actions",
            accessorKey: "actions",
            sortable: false,
            cell: ({ row }: { row: any }) => (
                <div className="relative">
                    <ActionsDropdown itemId={row.id} actions={studentActions} />
                </div>
            ),
        },
    ];

    return (
        <div className={className}>
            <DynamicTable
                data={tableData}
                columns={columns}
                hideToolbar
                hideHeader
                noPadding
                onRowClick={(rowId) => {
                    // Handle row click if needed
                    console.log("Row clicked:", rowId);
                }}
            />
        </div>
    );
};

export default StudentAttendanceTable;
