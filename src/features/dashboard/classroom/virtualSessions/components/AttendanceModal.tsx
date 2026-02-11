import { useState, useMemo } from "react";
import { useTranslation } from "react-i18next";
import {
    X,
    Check,
    Clock,
    XCircle,
    AlertCircle,
    User,
    ChevronDown,
} from "lucide-react";
import {
    useStudentAttendanceQuery,
    useUpdateStudentAttendanceMutation,
} from "@/features/dashboard/admin/groupsManagement/api";
import type {
    AttendanceStatus,
    StudentAttendanceRecord,
} from "@/features/dashboard/admin/groupsManagement/types";

interface AttendanceModalProps {
    isOpen: boolean;
    onClose: () => void;
    sessionId: number | string;
    sessionTopic: string;
}

const statusConfig: Record<
    AttendanceStatus,
    { icon: typeof Check; bgColor: string; textColor: string; label: string }
> = {
    present: {
        icon: Check,
        bgColor: "bg-success-100 dark:bg-success-500/20",
        textColor: "text-success-600 dark:text-success-400",
        label: "present",
    },
    absent: {
        icon: XCircle,
        bgColor: "bg-error-100 dark:bg-error-500/20",
        textColor: "text-error-600 dark:text-error-400",
        label: "absent",
    },
    late: {
        icon: Clock,
        bgColor: "bg-warning-100 dark:bg-warning-500/20",
        textColor: "text-warning-600 dark:text-warning-400",
        label: "late",
    },
    cancelled: {
        icon: AlertCircle,
        bgColor: "bg-gray-100 dark:bg-gray-700",
        textColor: "text-gray-600 dark:text-gray-400",
        label: "cancelled",
    },
};

const ATTENDANCE_STATUSES: AttendanceStatus[] = ["present", "absent", "late"];

export function AttendanceModal({
    isOpen,
    onClose,
    sessionId,
    sessionTopic,
}: AttendanceModalProps) {
    const { t } = useTranslation("virtualSessions");
    const [openDropdownId, setOpenDropdownId] = useState<number | null>(null);

    // Fetch student attendance data from API
    const { data: students = [], isLoading } = useStudentAttendanceQuery(
        sessionId,
        { enabled: isOpen && !!sessionId }
    );

    // Mutation for updating student attendance
    const updateStudentAttendance = useUpdateStudentAttendanceMutation();

    // Calculate counts - must be before early return
    const counts = useMemo(() => {
        const result = { present: 0, absent: 0, late: 0 };
        students.forEach((s) => {
            if (s.status in result) {
                result[s.status as keyof typeof result]++;
            }
        });
        return result;
    }, [students]);

    const handleStatusChange = async (
        student: StudentAttendanceRecord,
        newStatus: AttendanceStatus
    ) => {
        await updateStudentAttendance.mutateAsync({
            sessionId,
            data: {
                attendances: [
                    {
                        student_id: student.student.id,
                        status: newStatus,
                        note: student.note,
                    },
                ],
            },
        });
        setOpenDropdownId(null);
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/50 backdrop-blur-sm"
                onClick={onClose}
            />

            {/* Modal */}
            <div className="relative bg-white dark:bg-gray-900 rounded-2xl shadow-xl max-w-lg w-full mx-4 max-h-[80vh] flex flex-col animate-in fade-in zoom-in duration-200">
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
                    <div>
                        <h2 className="text-lg font-bold text-gray-900 dark:text-white">
                            {t("attendance.title")}
                        </h2>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                            {sessionTopic}
                        </p>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                    >
                        <X className="size-5 text-gray-500" />
                    </button>
                </div>

                {/* Summary Stats */}
                <div className="flex gap-3 p-4 border-b border-gray-200 dark:border-gray-700">
                    <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-success-100 dark:bg-success-500/20">
                        <Check className="size-4 text-success-600 dark:text-success-400" />
                        <span className="text-sm font-medium text-success-600 dark:text-success-400">
                            {counts.present}
                        </span>
                    </div>
                    <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-warning-100 dark:bg-warning-500/20">
                        <Clock className="size-4 text-warning-600 dark:text-warning-400" />
                        <span className="text-sm font-medium text-warning-600 dark:text-warning-400">
                            {counts.late}
                        </span>
                    </div>
                    <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-error-100 dark:bg-error-500/20">
                        <XCircle className="size-4 text-error-600 dark:text-error-400" />
                        <span className="text-sm font-medium text-error-600 dark:text-error-400">
                            {counts.absent}
                        </span>
                    </div>
                </div>

                {/* Student List */}
                <div className="flex-1 overflow-y-auto p-4">
                    <div className="flex flex-col gap-3">
                        {isLoading ? (
                            <div className="flex justify-center py-8">
                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-500" />
                            </div>
                        ) : (
                            students.map((student) => {
                                const config =
                                    statusConfig[student.status] ||
                                    statusConfig.present;
                                const StatusIcon = config.icon;

                                return (
                                    <div
                                        key={student.id}
                                        className="flex items-center justify-between p-3 rounded-xl bg-gray-50 dark:bg-gray-800"
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className="size-10 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center">
                                                <User className="size-5 text-gray-400" />
                                            </div>
                                            <span className="font-medium text-gray-900 dark:text-white">
                                                {student.student.name}
                                            </span>
                                        </div>
                                        {/* Status Dropdown */}
                                        <div className="relative">
                                            <button
                                                onClick={() =>
                                                    setOpenDropdownId(
                                                        openDropdownId ===
                                                            student.id
                                                            ? null
                                                            : student.id
                                                    )
                                                }
                                                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full ${config.bgColor} hover:opacity-80 transition-opacity cursor-pointer`}
                                            >
                                                <StatusIcon
                                                    className={`size-4 ${config.textColor}`}
                                                />
                                                <span
                                                    className={`text-xs font-medium ${config.textColor}`}
                                                >
                                                    {t(
                                                        `attendance.status.${config.label}`
                                                    )}
                                                </span>
                                                <ChevronDown
                                                    className={`size-3 ${config.textColor} transition-transform ${
                                                        openDropdownId ===
                                                        student.id
                                                            ? "rotate-180"
                                                            : ""
                                                    }`}
                                                />
                                            </button>

                                            {/* Dropdown Menu */}
                                            {openDropdownId === student.id && (
                                                <div className="absolute end-0 top-full mt-1 z-10 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 py-1 min-w-[140px]">
                                                    {ATTENDANCE_STATUSES.map(
                                                        (status) => {
                                                            const statusCfg =
                                                                statusConfig[
                                                                    status
                                                                ];
                                                            const StatusOptionIcon =
                                                                statusCfg.icon;
                                                            const isSelected =
                                                                student.status ===
                                                                status;

                                                            return (
                                                                <button
                                                                    key={status}
                                                                    onClick={() =>
                                                                        handleStatusChange(
                                                                            student,
                                                                            status
                                                                        )
                                                                    }
                                                                    className={`w-full flex items-center gap-2 px-3 py-2 text-start hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors ${
                                                                        isSelected
                                                                            ? "bg-gray-50 dark:bg-gray-700/50"
                                                                            : ""
                                                                    }`}
                                                                >
                                                                    <StatusOptionIcon
                                                                        className={`size-4 ${statusCfg.textColor}`}
                                                                    />
                                                                    <span
                                                                        className={`text-sm ${
                                                                            isSelected
                                                                                ? "font-medium"
                                                                                : ""
                                                                        } text-gray-700 dark:text-gray-300`}
                                                                    >
                                                                        {t(
                                                                            `attendance.status.${statusCfg.label}`
                                                                        )}
                                                                    </span>
                                                                    {isSelected && (
                                                                        <Check className="size-4 text-brand-500 ms-auto" />
                                                                    )}
                                                                </button>
                                                            );
                                                        }
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                );
                            })
                        )}
                    </div>
                </div>

                {/* Footer */}
                <div className="p-4 border-t border-gray-200 dark:border-gray-700">
                    <button
                        onClick={onClose}
                        className="w-full py-2.5 px-4 rounded-xl bg-brand-500 hover:bg-brand-600 text-white font-semibold transition-colors"
                    >
                        {t("attendance.close")}
                    </button>
                </div>
            </div>
        </div>
    );
}

export default AttendanceModal;
