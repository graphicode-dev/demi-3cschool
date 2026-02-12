/**
 * Sessions Page
 *
 * Displays a two-panel layout for managing group sessions:
 * - Left panel: Available Lessons (Curriculum)
 * - Right panel: Scheduled Sessions (Group Calendar)
 */

import { useState, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";
import { Search, Info, Plus } from "lucide-react";
import {
    PageWrapper,
    LoadingState,
    ErrorState,
    ConfirmDialog,
    useToast,
} from "@/design-system";
import { useSessionsListQuery } from "../api/sessions/sessions.queries";
import { useGroup } from "../api";
import { useLessonsByLevel } from "@/features/dashboard/admin/learning/pages/lessons/api";
import {
    LessonListItem,
    SessionCard,
    RescheduleSessionModal,
    AssignLessonModal,
    ScheduleSessionModal,
} from "../components/sessions";
import type { GroupSession } from "../types/sessions.types";
import {
    useRescheduleSessionMutation,
    useCreateSessionMutation,
    useDeleteSession,
    useRecreateZoomMeeting,
} from "../api/sessions/sessions.mutations";
import { useMutationHandler } from "@/shared/api";

interface SessionWithStatus extends Omit<GroupSession, "status"> {
    sessionNumber: number;
    status: "assigned" | "not_assigned" | "action_required";
}

function SessionsPage() {
    const { t } = useTranslation("groupsManagement");
    const {
        gradeId,
        levelId,
        id: groupId,
    } = useParams<{
        gradeId: string;
        levelId: string;
        id: string;
    }>();

    const { execute } = useMutationHandler();
    const { addToast } = useToast();

    // State
    const [searchQuery, setSearchQuery] = useState("");
    const [rescheduleModal, setRescheduleModal] = useState<{
        isOpen: boolean;
        session: SessionWithStatus | null;
    }>({ isOpen: false, session: null });
    const [assignModal, setAssignModal] = useState<{
        isOpen: boolean;
        session: SessionWithStatus | null;
    }>({ isOpen: false, session: null });
    const [addSessionModal, setAddSessionModal] = useState(false);
    const [scheduleModal, setScheduleModal] = useState<{
        isOpen: boolean;
        lessonId: string | null;
        lessonTitle: string;
        lessonOrder: number;
    }>({ isOpen: false, lessonId: null, lessonTitle: "", lessonOrder: 0 });
    const [deleteSessionDialog, setDeleteSessionDialog] = useState<{
        isOpen: boolean;
        sessionId: number | null;
    }>({ isOpen: false, sessionId: null });

    // Queries
    const {
        data: group,
        isLoading: groupLoading,
        error: groupError,
    } = useGroup(groupId);

    const {
        data: sessionsData,
        isLoading: sessionsLoading,
        refetch: refetchSessions,
    } = useSessionsListQuery(
        parseInt(groupId!, 10),
        {},
        {
            enabled: !!groupId,
        }
    );

    const { data: lessonsData, isLoading: lessonsLoading } = useLessonsByLevel(
        { levelId: levelId || "" },
        { enabled: !!levelId }
    );

    // Mutations
    const { mutateAsync: rescheduleSession, isPending: isRescheduling } =
        useRescheduleSessionMutation();
    const { mutateAsync: createSession, isPending: isCreating } =
        useCreateSessionMutation();
    const { mutateAsync: deleteSessionAsync, isPending: isDeleting } =
        useDeleteSession();
    const { mutateAsync: recreateZoomMeeting, isPending: isRecreatingMeeting } =
        useRecreateZoomMeeting();

    // Process sessions data
    const sessions: SessionWithStatus[] = useMemo(() => {
        if (!sessionsData) return [];
        const items =
            "items" in sessionsData ? sessionsData.items : sessionsData;
        const sessionsArray = Array.isArray(items) ? items : [];
        return sessionsArray.map((session, index) => ({
            ...session,
            sessionNumber: index + 1,
            status: session.lesson?.id ? "assigned" : "not_assigned",
        }));
    }, [sessionsData]);

    // Process lessons data
    const lessons = useMemo(() => {
        if (!lessonsData) return [];
        const items = "items" in lessonsData ? lessonsData.items : lessonsData;
        return Array.isArray(items) ? items : [];
    }, [lessonsData]);

    // Filter lessons by search
    const filteredLessons = useMemo(() => {
        if (!searchQuery.trim()) return lessons;
        const query = searchQuery.toLowerCase();
        return lessons.filter((lesson) =>
            lesson.title.toLowerCase().includes(query)
        );
    }, [lessons, searchQuery]);

    // Check if a lesson is assigned to any session
    const getLessonAssignmentInfo = (lessonId: number | string) => {
        const assignedSession = sessions.find(
            (s) => s.lesson?.id === Number(lessonId)
        );
        return {
            isAssigned: !!assignedSession,
            sessionNumber: assignedSession?.sessionNumber,
        };
    };

    // Handlers
    const handleReschedule = (session: SessionWithStatus) => {
        setRescheduleModal({ isOpen: true, session });
    };

    const handleRescheduleSubmit = async (data: {
        date: string;
        startTime: string;
        endTime: string;
        reason: string;
    }) => {
        if (!rescheduleModal.session) return;

        execute(
            () =>
                rescheduleSession({
                    id: rescheduleModal.session!.id,
                    payload: {
                        session_date: data.date,
                        start_time: data.startTime,
                        end_time: data.endTime,
                        reason: data.reason,
                    },
                }),
            {
                successMessage: t(
                    "sessions.rescheduleSuccess",
                    "Session rescheduled successfully"
                ),
                onSuccess: () => {
                    setRescheduleModal({ isOpen: false, session: null });
                    refetchSessions();
                },
            }
        );
    };

    const handleAssignLesson = (session: SessionWithStatus) => {
        setAssignModal({ isOpen: true, session });
    };

    const handleAssignSubmit = async (lessonId: string) => {
        if (!assignModal.session || !groupId) return;

        execute(
            () =>
                createSession({
                    group_id: parseInt(groupId, 10),
                    lesson_id: parseInt(lessonId, 10),
                    session_date: assignModal.session!.sessionDate,
                    start_time: assignModal.session!.startTime.slice(0, 5),
                    end_time: assignModal.session!.endTime.slice(0, 5),
                    location_type: "offline",
                }),
            {
                successMessage: t(
                    "sessions.assignSuccess",
                    "Lesson assigned successfully"
                ),
                onSuccess: () => {
                    setAssignModal({ isOpen: false, session: null });
                    refetchSessions();
                },
            }
        );
    };

    const handleDeleteSession = (sessionId: number) => {
        setDeleteSessionDialog({ isOpen: true, sessionId });
    };

    const confirmDeleteSession = async () => {
        if (!deleteSessionDialog.sessionId) return;
        await execute(
            () => deleteSessionAsync(String(deleteSessionDialog.sessionId)),
            {
                successMessage: t(
                    "sessions.deleteSuccess",
                    "Session deleted successfully"
                ),
                onSuccess: () => refetchSessions(),
            }
        );
        setDeleteSessionDialog({ isOpen: false, sessionId: null });
    };

    // Handle recreate Zoom meeting for a session
    const handleRecreateMeeting = async (sessionId: number) => {
        execute(() => recreateZoomMeeting(sessionId), {
            successMessage: t(
                "sessions.recreateMeetingSuccess",
                "Zoom meeting recreated successfully"
            ),
            onSuccess: () => refetchSessions(),
        });
    };

    // Handle Add Session button click - opens lesson selection modal
    const handleAddSession = () => {
        setAddSessionModal(true);
    };

    // Handle lesson selection from Add Session flow
    const handleLessonSelect = (lessonId: string) => {
        const lesson = lessons.find((l) => String(l.id) === lessonId);
        if (!lesson) return;

        const lessonIndex = lessons.findIndex((l) => String(l.id) === lessonId);
        setAddSessionModal(false);
        setScheduleModal({
            isOpen: true,
            lessonId,
            lessonTitle: lesson.title,
            lessonOrder: lessonIndex + 1,
        });
    };

    // Handle schedule session submit
    const handleScheduleSubmit = async (data: {
        date: string;
        startTime: string;
        endTime: string;
        locationType: "online" | "offline";
        offlineLocation?: string;
    }) => {
        if (!scheduleModal.lessonId || !groupId) return;

        execute(
            () =>
                createSession({
                    group_id: parseInt(groupId, 10),
                    lesson_id: parseInt(scheduleModal.lessonId!, 10),
                    session_date: data.date,
                    start_time: data.startTime,
                    end_time: data.endTime,
                    location_type: data.locationType,
                    ...(data.offlineLocation && {
                        offline_location: data.offlineLocation,
                    }),
                }),
            {
                successMessage: t(
                    "sessions.createSuccess",
                    "Session created successfully"
                ),
                onSuccess: () => {
                    setScheduleModal({
                        isOpen: false,
                        lessonId: null,
                        lessonTitle: "",
                        lessonOrder: 0,
                    });
                    refetchSessions();
                },
            }
        );
    };

    // Loading and error states
    const isLoading = groupLoading || sessionsLoading || lessonsLoading;

    if (isLoading) {
        return <LoadingState message={t("common.loading", "Loading...")} />;
    }

    if (groupError) {
        return (
            <ErrorState
                message={t("errors.fetchFailed", "Failed to load data")}
                onRetry={() => window.location.reload()}
            />
        );
    }

    return (
        <PageWrapper
            pageHeaderProps={{
                title: t("sessions.title", "Sessions"),
                subtitle: t(
                    "sessions.subtitle",
                    "Assign curriculum lessons to group sessions and manage session timing."
                ),
                backButton: true,
                actions: (
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-3">
                            <span className="text-sm text-gray-500 dark:text-gray-400">
                                {t(
                                    "sessions.sessionsCount",
                                    "{{count}} Sessions",
                                    {
                                        count: sessions.length,
                                    }
                                )}
                            </span>
                            <button
                                type="button"
                                onClick={handleAddSession}
                                className="flex items-center gap-2 px-4 py-2 bg-brand-500 hover:bg-brand-600 text-white rounded-lg text-sm font-medium transition-colors"
                            >
                                <Plus className="w-4 h-4" />
                                {t("sessions.addSession", "Add Session")}
                            </button>
                        </div>
                    </div>
                ),
            }}
        >
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* Left Panel - Available Lessons */}
                <div className="lg:col-span-4">
                    <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6">
                        <div className="mb-4">
                            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                                {t(
                                    "sessions.availableLessons",
                                    "Available Lessons (Curriculum)"
                                )}
                            </h2>
                            <div className="flex items-center gap-1.5 mt-1">
                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                    {t(
                                        "sessions.lessonsDescription",
                                        "These lessons are predefined and shared across all groups."
                                    )}
                                </p>
                                <Info className="w-4 h-4 text-gray-400" />
                            </div>
                        </div>

                        {/* Search */}
                        <div className="relative mb-4">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder={t(
                                    "sessions.searchLessons",
                                    "Search lessons..."
                                )}
                                className="w-full pl-10 pr-4 py-2.5 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg text-sm text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-brand-500 focus:border-transparent"
                            />
                        </div>

                        {/* Lessons List */}
                        <div className="space-y-2 max-h-[600px] overflow-y-auto">
                            {filteredLessons.length === 0 ? (
                                <p className="text-center text-gray-500 dark:text-gray-400 py-8">
                                    {t(
                                        "sessions.noLessonsFound",
                                        "No lessons found"
                                    )}
                                </p>
                            ) : (
                                filteredLessons.map((lesson, index) => {
                                    const assignmentInfo =
                                        getLessonAssignmentInfo(lesson.id);
                                    return (
                                        <LessonListItem
                                            key={lesson.id}
                                            order={index + 1}
                                            title={lesson.title}
                                            isAssigned={
                                                assignmentInfo.isAssigned
                                            }
                                        />
                                    );
                                })
                            )}
                        </div>
                    </div>
                </div>

                {/* Right Panel - Scheduled Sessions */}
                <div className="lg:col-span-8">
                    <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6">
                        {/* Sessions List */}
                        <div className="space-y-4">
                            {sessions.length === 0 ? (
                                <div className="text-center py-12">
                                    <p className="text-gray-500 dark:text-gray-400">
                                        {t(
                                            "sessions.noSessions",
                                            "No sessions scheduled yet"
                                        )}
                                    </p>
                                    <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">
                                        {t(
                                            "sessions.noSessionsHint",
                                            "Sessions will appear here once the group schedule is set up."
                                        )}
                                    </p>
                                </div>
                            ) : (
                                sessions.map((session) => (
                                    <SessionCard
                                        key={session.id}
                                        sessionNumber={session.sessionNumber}
                                        lessonTitle={session.lesson?.title}
                                        date={session.sessionDate}
                                        startTime={session.startTime}
                                        endTime={session.endTime}
                                        status={session.status}
                                        locationType={session.locationType}
                                        isRecreatingMeeting={
                                            isRecreatingMeeting
                                        }
                                        onReschedule={() =>
                                            handleReschedule(session)
                                        }
                                        onDelete={() =>
                                            handleDeleteSession(session.id)
                                        }
                                        onAssignLesson={() =>
                                            handleAssignLesson(session)
                                        }
                                        onRecreateMeeting={() =>
                                            handleRecreateMeeting(session.id)
                                        }
                                    />
                                ))
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Reschedule Modal */}
            {rescheduleModal.session && (
                <RescheduleSessionModal
                    isOpen={rescheduleModal.isOpen}
                    onClose={() =>
                        setRescheduleModal({ isOpen: false, session: null })
                    }
                    onSave={handleRescheduleSubmit}
                    lessonTitle={rescheduleModal.session.lesson?.title || ""}
                    lessonOrder={rescheduleModal.session.sessionNumber}
                    currentDate={rescheduleModal.session.sessionDate}
                    currentStartTime={rescheduleModal.session.startTime}
                    currentEndTime={rescheduleModal.session.endTime}
                    isPending={isRescheduling}
                />
            )}

            {/* Assign Lesson Modal */}
            {assignModal.session && (
                <AssignLessonModal
                    isOpen={assignModal.isOpen}
                    onClose={() =>
                        setAssignModal({ isOpen: false, session: null })
                    }
                    onAssign={handleAssignSubmit}
                    sessionNumber={assignModal.session.sessionNumber}
                    groupName={group?.name || ""}
                    date={assignModal.session.sessionDate}
                    startTime={assignModal.session.startTime}
                    endTime={assignModal.session.endTime}
                    lessons={lessons.map((lesson, index) => {
                        const assignmentInfo = getLessonAssignmentInfo(
                            lesson.id
                        );
                        return {
                            id: String(lesson.id),
                            order: index + 1,
                            title: lesson.title,
                            description: lesson.description,
                            isAssigned: assignmentInfo.isAssigned,
                            assignedToSession: assignmentInfo.sessionNumber,
                        };
                    })}
                    isPending={isCreating}
                />
            )}

            {/* Add Session - Lesson Selection Modal */}
            <AssignLessonModal
                isOpen={addSessionModal}
                onClose={() => setAddSessionModal(false)}
                onAssign={handleLessonSelect}
                sessionNumber={sessions.length + 1}
                groupName={group?.name || ""}
                date=""
                startTime=""
                endTime=""
                lessons={lessons.map((lesson, index) => {
                    const assignmentInfo = getLessonAssignmentInfo(lesson.id);
                    return {
                        id: String(lesson.id),
                        order: index + 1,
                        title: lesson.title,
                        description: lesson.description,
                        isAssigned: assignmentInfo.isAssigned,
                        assignedToSession: assignmentInfo.sessionNumber,
                    };
                })}
                isPending={false}
            />

            {/* Schedule Session Modal */}
            <ScheduleSessionModal
                isOpen={scheduleModal.isOpen}
                onClose={() =>
                    setScheduleModal({
                        isOpen: false,
                        lessonId: null,
                        lessonTitle: "",
                        lessonOrder: 0,
                    })
                }
                onSave={handleScheduleSubmit}
                lessonTitle={scheduleModal.lessonTitle}
                lessonOrder={scheduleModal.lessonOrder}
                isPending={isCreating}
            />

            {/* Delete Session Confirmation Dialog */}
            <ConfirmDialog
                isOpen={deleteSessionDialog.isOpen}
                onClose={() =>
                    setDeleteSessionDialog({ isOpen: false, sessionId: null })
                }
                variant="danger"
                title={t("sessions.deleteDialog.title", "Delete Session")}
                message={t(
                    "sessions.deleteDialog.message",
                    "Are you sure you want to delete this session? This action cannot be undone."
                )}
                confirmText={t("common.delete", "Delete")}
                cancelText={t("common.cancel", "Cancel")}
                onConfirm={confirmDeleteSession}
                loading={isDeleting}
            />
        </PageWrapper>
    );
}

export default SessionsPage;
