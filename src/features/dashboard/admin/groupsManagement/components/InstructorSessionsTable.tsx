/**
 * Instructor Sessions Table Component
 *
 * Displays sessions with the instructor in a table format using DynamicTable
 */

import React from "react";
import { useTranslation } from "react-i18next";
import { DynamicTable } from "@/design-system/components/table";
import type { TableColumn, TableData } from "@/shared/types/table.types";
import type { InstructorSession } from "../types/instructor.types";
import ActionsDropdown, {
    DropdownAction,
} from "@/design-system/components/ActionsDropdown";
import { UserCog } from "lucide-react";

interface InstructorSessionsTableProps {
    sessions: InstructorSession[];
    loading?: boolean;
    className?: string;
    onChangeTeacher?: (sessionId: number) => void;
}

// Group badge component
const GroupBadge: React.FC<{ group: string }> = ({ group }) => {
    return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400">
            {group}
        </span>
    );
};

export const InstructorSessionsTable: React.FC<
    InstructorSessionsTableProps
> = ({ sessions, loading = false, className = "", onChangeTeacher }) => {
    const { t } = useTranslation();

    // Convert session data to table format
    const tableData: TableData[] = sessions.map((session) => ({
        id: session.id,
        selected: false,
        columns: {
            sessionName: session.sessionName,
            dateTime: `${session.date} - ${session.time}`,
            group: session.group,
            currentTeacher: session.currentTeacher,
        },
        original: { originalSessionId: session.originalSessionId },
    }));

    // Define table columns
    const columns: TableColumn[] = [
        {
            id: "sessionName",
            header: t("instructor.sessionName", "Session Name"),
            accessorKey: "sessionName",
            sortable: true,
            cell: ({ row }: { row: any }) => (
                <span className="font-medium text-gray-900 dark:text-white">
                    {row.columns.sessionName}
                </span>
            ),
        },
        {
            id: "dateTime",
            header: t("instructor.dateTime", "Date & Time"),
            accessorKey: "dateTime",
            sortable: true,
            cell: ({ row }: { row: any }) => (
                <span className="text-sm text-gray-900 dark:text-white">
                    {row.columns.dateTime}
                </span>
            ),
        },
        {
            id: "group",
            header: t("instructor.group", "Group"),
            accessorKey: "group",
            sortable: true,
            cell: ({ row }: { row: any }) => (
                <GroupBadge group={row.columns.group} />
            ),
        },
        {
            id: "currentTeacher",
            header: t("instructor.currentTeacher", "Current Teacher"),
            accessorKey: "currentTeacher",
            sortable: true,
            cell: ({ row }: { row: any }) => (
                <span className="text-sm text-gray-900 dark:text-white">
                    {row.columns.currentTeacher}
                </span>
            ),
        },
        {
            id: "actions",
            header: t("instructor.actions", "Actions"),
            accessorKey: "actions",
            sortable: false,
            cell: ({ row }: { row: any }) => {
                const sessionId =
                    Number(row?.original?.originalSessionId ?? row?.id) || 0;

                const actions: DropdownAction[] = [
                    {
                        id: "change-teacher",
                        label: t("instructor.changeTeacher", "Change Teacher"),
                        icon: <UserCog className="w-4 h-4" />,
                        onClick: () => onChangeTeacher?.(sessionId),
                    },
                ];

                return (
                    <div className="relative">
                        <ActionsDropdown
                            itemId={String(sessionId)}
                            actions={actions}
                        />
                    </div>
                );
            },
        },
    ];

    if (loading) {
        return (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                    <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-48 animate-pulse"></div>
                </div>
                <div className="divide-y divide-gray-200 dark:divide-gray-700">
                    {[...Array(3)].map((_, index) => (
                        <div key={index} className="px-6 py-4 animate-pulse">
                            <div className="grid grid-cols-5 gap-4">
                                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
                                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
                                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
                                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
                                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-6"></div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className={`   overflow-hidden ${className}`}>
            <h2 className="text-xl font-semibold py-4 text-gray-900 dark:text-white">
                Sessions with Teacher
            </h2>

            {sessions.length > 0 ? (
                <DynamicTable
                    data={tableData}
                    columns={columns}
                    hideToolbar
                    hideHeader
                    noPadding
                    onRowClick={(rowId) => {
                        // Handle row click if needed
                        console.log("Session row clicked:", rowId);
                    }}
                />
            ) : (
                <div className="px-6 py-12 text-center">
                    <div className="text-gray-500 dark:text-gray-400">
                        <svg
                            className="mx-auto h-12 w-12 text-gray-400"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                            />
                        </svg>
                        <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">
                            No sessions found
                        </h3>
                        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                            There are no sessions scheduled with this teacher.
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
};

export default InstructorSessionsTable;
