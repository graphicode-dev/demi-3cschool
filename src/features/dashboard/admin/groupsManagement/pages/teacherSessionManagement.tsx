/**
 * Teacher Session Management Page
 *
 * View and manage all sessions with the teacher.
 * Shows primary teacher info and sessions table with teacher assignments.
 */

import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate, useParams } from "react-router-dom";
import { Mail, Users, Calendar, UserPlus, RefreshCw } from "lucide-react";
import { ErrorState, LoadingState } from "@/design-system";
import PageWrapper from "@/design-system/components/PageWrapper";
import { useGroup, useSessionsByGroupQuery } from "../api";
import { groupsPaths } from "../navigation/paths";
import type { GroupSession } from "../types/sessions.types";

interface SessionRowProps {
    session: GroupSession;
    index: number;
    isSelected: boolean;
    onSelect: (id: number) => void;
    onChangeTeacher: (sessionId: number) => void;
}

function SessionRow({
    session,
    index,
    isSelected,
    onSelect,
    onChangeTeacher,
}: SessionRowProps) {
    const { t } = useTranslation("groupsManagement");

    const formatDate = (dateStr: string) => {
        const date = new Date(dateStr);
        return date.toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
        });
    };

    const formatTime = (timeStr: string) => {
        const [hours, minutes] = timeStr.split(":");
        const hour = parseInt(hours, 10);
        const ampm = hour >= 12 ? "PM" : "AM";
        const hour12 = hour % 12 || 12;
        return `${hour12}:${minutes} ${ampm}`;
    };

    return (
        <tr
            className={`border-b border-gray-100 dark:border-gray-700 ${
                isSelected
                    ? "bg-brand-50 dark:bg-brand-900/20"
                    : "hover:bg-gray-50 dark:hover:bg-gray-800"
            }`}
        >
            <td className="px-4 py-4">
                <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={() => onSelect(session.id)}
                    className="w-4 h-4 text-brand-500 border-gray-300 rounded focus:ring-brand-500"
                />
            </td>
            <td className="px-4 py-4 text-sm text-gray-500 dark:text-gray-400">
                {index + 1}
            </td>
            <td className="px-4 py-4">
                <span className="text-sm font-medium text-gray-900 dark:text-white">
                    {session.lesson?.title ||
                        t("sessions.noLesson", "No lesson assigned")}
                </span>
            </td>
            <td className="px-4 py-4">
                <div className="flex flex-col">
                    <span className="text-sm font-medium text-gray-900 dark:text-white">
                        {formatDate(session.sessionDate)}
                    </span>
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                        at {formatTime(session.startTime)}
                    </span>
                </div>
            </td>
            <td className="px-4 py-4">
                <span className="text-sm font-semibold text-gray-900 dark:text-white">
                    {session.teacher?.name ||
                        t("sessions.noTeacher", "No teacher")}
                </span>
            </td>
            <td className="px-4 py-4">
                <button
                    onClick={() => onChangeTeacher(session.id)}
                    className={`px-4 py-2 text-sm font-semibold rounded-lg transition-colors ${
                        isSelected
                            ? "bg-brand-500 text-white hover:bg-brand-600"
                            : "border border-gray-200 dark:border-gray-600 text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
                    }`}
                >
                    {t("sessions.changeTeacher", "Change Teacher")}
                </button>
            </td>
        </tr>
    );
}

function PrimaryTeacherCard({
    teacher,
    assignedDate,
    activeGroups,
    onReassign,
}: {
    teacher: { id?: string | number; name?: string; email?: string } | null;
    assignedDate?: string;
    activeGroups?: number;
    onReassign: () => void;
}) {
    const { t } = useTranslation("groupsManagement");

    if (!teacher?.id) {
        return (
            <div className="bg-white dark:bg-gray-800 border border-brand-100 dark:border-brand-900/30 rounded-2xl shadow-sm p-6">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
                    {t("teacherManagement.primaryTeacher", "Primary Teacher")}
                </h2>
                <div className="flex flex-col items-center justify-center py-8">
                    <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mb-4">
                        <UserPlus className="w-8 h-8 text-gray-400" />
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                        {t(
                            "teacherManagement.noTeacherYet",
                            "No Primary Teacher Assigned Yet"
                        )}
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400 text-center mb-6">
                        {t(
                            "teacherManagement.noTeacherDescription",
                            "Please assign a teacher to manage this session. This is required to start the class."
                        )}
                    </p>
                    <button
                        onClick={onReassign}
                        className="inline-flex items-center gap-2 px-6 py-3 bg-brand-500 text-white font-semibold rounded-xl hover:bg-brand-600 transition-colors shadow-lg shadow-brand-500/30"
                    >
                        <UserPlus className="w-5 h-5" />
                        {t("teacherManagement.assignTeacher", "Assign Teacher")}
                    </button>
                </div>
            </div>
        );
    }

    const initials =
        teacher.name
            ?.split(" ")
            .map((n) => n[0])
            .join("")
            .toUpperCase()
            .slice(0, 2) || "??";

    return (
        <div className="bg-white dark:bg-gray-800 border border-brand-100 dark:border-brand-900/30 rounded-2xl shadow-sm p-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
                {t("teacherManagement.primaryTeacher", "Primary Teacher")}
            </h2>
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-6">
                    <div className="w-20 h-20 bg-brand-500 rounded-full flex items-center justify-center">
                        <span className="text-2xl font-bold text-white">
                            {initials}
                        </span>
                    </div>
                    <div className="flex flex-col gap-2">
                        <h3 className="text-2xl font-semibold text-gray-900 dark:text-white">
                            {teacher.name}
                        </h3>
                        <div className="flex flex-col gap-2 text-gray-500 dark:text-gray-400">
                            {teacher.email && (
                                <div className="flex items-center gap-2">
                                    <Mail className="w-4 h-4" />
                                    <span className="text-sm">
                                        {teacher.email}
                                    </span>
                                </div>
                            )}
                            {activeGroups !== undefined && (
                                <div className="flex items-center gap-2">
                                    <Users className="w-4 h-4" />
                                    <span className="text-sm">
                                        {activeGroups}{" "}
                                        {t(
                                            "teacherManagement.activeGroups",
                                            "Active Groups"
                                        )}
                                    </span>
                                </div>
                            )}
                            {assignedDate && (
                                <div className="flex items-center gap-2">
                                    <Calendar className="w-4 h-4" />
                                    <span className="text-sm">
                                        {t(
                                            "teacherManagement.assignedOn",
                                            "Assigned on"
                                        )}{" "}
                                        <span className="text-gray-900 dark:text-white font-medium">
                                            {assignedDate}
                                        </span>
                                    </span>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
                <button
                    onClick={onReassign}
                    className="inline-flex items-center gap-2 px-6 py-3 bg-brand-500 text-white font-semibold rounded-xl hover:bg-brand-600 transition-all shadow-lg shadow-brand-500/30"
                >
                    <RefreshCw className="w-5 h-5" />
                    {t("teacherManagement.reassignTeacher", "Reassign Teacher")}
                </button>
            </div>
        </div>
    );
}

export default function TeacherSessionManagementPage() {
    const { t } = useTranslation("groupsManagement");
    const navigate = useNavigate();
    const {
        gradeId,
        levelId,
        id: groupId,
    } = useParams<{
        gradeId: string;
        levelId: string;
        id: string;
    }>();

    const [selectedSessions, setSelectedSessions] = useState<number[]>([]);

    const {
        data: groupData,
        isLoading: groupLoading,
        error: groupError,
        refetch: refetchGroup,
    } = useGroup(groupId);

    const {
        data: sessionsData,
        isLoading: sessionsLoading,
        error: sessionsError,
        refetch: refetchSessions,
    } = useSessionsByGroupQuery(Number(groupId) || 0);

    const sessions: GroupSession[] = (() => {
        if (!sessionsData) return [];
        const items =
            "items" in sessionsData ? sessionsData.items : sessionsData;
        return Array.isArray(items) ? items : [];
    })();

    const handleSelectSession = (sessionId: number) => {
        setSelectedSessions((prev) =>
            prev.includes(sessionId)
                ? prev.filter((id) => id !== sessionId)
                : [...prev, sessionId]
        );
    };

    const handleReassignPrimaryTeacher = () => {
        navigate(groupsPaths.reassignTeacher(gradeId!, levelId!, groupId!));
    };

    const handleChangeSessionTeacher = (sessionId: number) => {
        navigate(
            groupsPaths.changeSessionTeacher(
                gradeId!,
                levelId!,
                groupId!,
                String(sessionId)
            )
        );
    };

    const isLoading = groupLoading || sessionsLoading;
    const error = groupError || sessionsError;

    if (error) {
        return (
            <ErrorState
                message={
                    error.message ||
                    t("errors.fetchFailed", "Failed to load data")
                }
                onRetry={() => {
                    refetchGroup();
                    refetchSessions();
                }}
            />
        );
    }

    if (isLoading) {
        return <LoadingState />;
    }

    return (
        <PageWrapper
            pageHeaderProps={{
                title: t(
                    "teacherManagement.title",
                    "Teacher Session Management"
                ),
                subtitle: t(
                    "teacherManagement.subtitle",
                    "View and manage all sessions with the teacher."
                ),
                backButton: true,
            }}
        >
            <div className="space-y-8">
                <PrimaryTeacherCard
                    teacher={groupData?.primaryTeacher || null}
                    assignedDate="January 1, 2026"
                    activeGroups={3}
                    onReassign={handleReassignPrimaryTeacher}
                />

                <div className="space-y-4">
                    <div>
                        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
                            {t(
                                "teacherManagement.sessionsWithTeacher",
                                "Sessions with Teacher"
                            )}
                        </h2>
                        <p className="text-gray-500 dark:text-gray-400 mt-1">
                            {t(
                                "teacherManagement.sessionsDescription",
                                "Manage teacher assignments for individual sessions"
                            )}
                        </p>
                    </div>

                    <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-gray-50 dark:bg-gray-900/50 border-b border-gray-200 dark:border-gray-700">
                                    <tr>
                                        <th className="px-4 py-3 text-left">
                                            <input
                                                type="checkbox"
                                                className="w-4 h-4 text-brand-500 border-gray-300 rounded focus:ring-brand-500"
                                            />
                                        </th>
                                        <th className="px-4 py-3 text-left text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                            ID
                                        </th>
                                        <th className="px-4 py-3 text-left text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                            {t(
                                                "sessions.sessionName",
                                                "Session Name"
                                            )}
                                        </th>
                                        <th className="px-4 py-3 text-left text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                            {t(
                                                "sessions.dateTime",
                                                "Date & Time"
                                            )}
                                        </th>
                                        <th className="px-4 py-3 text-left text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                            {t(
                                                "sessions.currentTeacher",
                                                "Current Teacher"
                                            )}
                                        </th>
                                        <th className="px-4 py-3 text-left text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                            {t("sessions.action", "Action")}
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {sessions.length > 0 ? (
                                        sessions.map((session, index) => (
                                            <SessionRow
                                                key={session.id}
                                                session={session}
                                                index={index}
                                                isSelected={selectedSessions.includes(
                                                    session.id
                                                )}
                                                onSelect={handleSelectSession}
                                                onChangeTeacher={
                                                    handleChangeSessionTeacher
                                                }
                                            />
                                        ))
                                    ) : (
                                        <tr>
                                            <td
                                                colSpan={6}
                                                className="px-4 py-12 text-center"
                                            >
                                                <p className="text-gray-500 dark:text-gray-400">
                                                    {t(
                                                        "sessions.noSessions",
                                                        "No sessions found"
                                                    )}
                                                </p>
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </PageWrapper>
    );
}
