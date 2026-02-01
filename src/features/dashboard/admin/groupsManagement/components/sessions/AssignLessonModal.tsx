/**
 * AssignLessonModal Component
 *
 * Modal for selecting a curriculum lesson to assign to a session.
 */

import { useState } from "react";
import { useTranslation } from "react-i18next";
import { X, Info, Calendar, Clock } from "lucide-react";

interface LessonOption {
    id: string;
    order: number;
    title: string;
    description?: string;
    isAssigned: boolean;
    assignedToSession?: number;
}

interface AssignLessonModalProps {
    isOpen: boolean;
    onClose: () => void;
    onAssign: (lessonId: string) => void;
    sessionNumber: number;
    groupName: string;
    date: string;
    startTime: string;
    endTime: string;
    lessons: LessonOption[];
    isPending?: boolean;
}

export function AssignLessonModal({
    isOpen,
    onClose,
    onAssign,
    sessionNumber,
    groupName,
    date,
    startTime,
    endTime,
    lessons,
    isPending = false,
}: AssignLessonModalProps) {
    const { t } = useTranslation("groupsManagement");
    const [selectedLessonId, setSelectedLessonId] = useState<string | null>(
        null
    );

    const formatTime = (time: string) => {
        const [hours, minutes] = time.split(":");
        return `${hours}:${minutes}`;
    };

    const handleAssign = () => {
        if (selectedLessonId) {
            onAssign(selectedLessonId);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            {/* Backdrop */}
            <div className="absolute inset-0 bg-black/50" onClick={onClose} />

            {/* Modal */}
            <div className="relative bg-white dark:bg-gray-800 rounded-2xl shadow-xl w-full max-w-2xl mx-4 max-h-[90vh] flex flex-col overflow-hidden">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700 shrink-0">
                    <div>
                        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                            {t(
                                "sessions.assignLessonToSession",
                                "Assign Lesson to Session"
                            )}
                        </h2>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                            {t(
                                "sessions.selectCurriculumLesson",
                                "Select a curriculum lesson to be taught in this session."
                            )}
                        </p>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded-lg transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Session Info */}
                <div className="px-6 py-4 bg-gray-50 dark:bg-gray-700/30 border-b border-gray-200 dark:border-gray-700 shrink-0">
                    <div className="flex items-center gap-3 flex-wrap">
                        <span className="px-3 py-1 bg-brand-100 text-brand-700 dark:bg-brand-900/30 dark:text-brand-400 text-sm font-medium rounded-full">
                            Session {String(sessionNumber).padStart(2, "0")}
                        </span>
                        <span className="px-3 py-1 bg-cyan-100 text-cyan-700 dark:bg-cyan-900/30 dark:text-cyan-400 text-sm font-medium rounded-full">
                            {groupName}
                        </span>
                        <div className="flex items-center gap-1.5 text-sm text-gray-500 dark:text-gray-400">
                            <Calendar className="w-4 h-4" />
                            <span>{date}</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-sm text-gray-500 dark:text-gray-400">
                            <Clock className="w-4 h-4" />
                            <span>
                                {formatTime(startTime)} – {formatTime(endTime)}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Lessons List */}
                <div className="flex-1 overflow-y-auto p-6">
                    <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-4">
                        {t(
                            "sessions.selectCurriculumLessonTitle",
                            "Select Curriculum Lesson"
                        )}
                    </h3>
                    <div className="space-y-3">
                        {lessons.map((lesson) => (
                            <label
                                key={lesson.id}
                                className={`flex items-start gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all ${
                                    selectedLessonId === lesson.id
                                        ? "border-brand-500 bg-brand-50 dark:bg-brand-900/20"
                                        : lesson.isAssigned
                                          ? "border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-700/30 opacity-60"
                                          : "border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600"
                                }`}
                            >
                                <input
                                    type="radio"
                                    name="lesson"
                                    value={lesson.id}
                                    checked={selectedLessonId === lesson.id}
                                    onChange={() =>
                                        !lesson.isAssigned &&
                                        setSelectedLessonId(lesson.id)
                                    }
                                    disabled={lesson.isAssigned}
                                    className="mt-1 w-4 h-4 text-brand-500 border-gray-300 focus:ring-brand-500"
                                />
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-3">
                                        <div
                                            className={`w-8 h-8 flex items-center justify-center rounded-lg text-sm font-semibold ${
                                                selectedLessonId === lesson.id
                                                    ? "bg-brand-500 text-white"
                                                    : "bg-brand-100 text-brand-700 dark:bg-brand-900/30 dark:text-brand-400"
                                            }`}
                                        >
                                            L{lesson.order}
                                        </div>
                                        <h4 className="font-medium text-gray-900 dark:text-white">
                                            {lesson.title}
                                        </h4>
                                    </div>
                                    {lesson.description && (
                                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 ml-11">
                                            {lesson.description}
                                        </p>
                                    )}
                                    {lesson.isAssigned && (
                                        <p className="text-sm text-amber-600 dark:text-amber-400 mt-1 ml-11">
                                            {t(
                                                "sessions.alreadyAssignedTo",
                                                "This lesson is already assigned to Session {{session}}.",
                                                {
                                                    session:
                                                        lesson.assignedToSession,
                                                }
                                            )}
                                        </p>
                                    )}
                                </div>
                            </label>
                        ))}
                    </div>
                </div>

                {/* Footer */}
                <div className="p-6 border-t border-gray-200 dark:border-gray-700 shrink-0">
                    {/* Info Notice */}
                    <div className="flex items-start gap-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg mb-4">
                        <Info className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" />
                        <p className="text-sm text-blue-700 dark:text-blue-300">
                            {t(
                                "sessions.assignNotice",
                                "Once assigned, this lesson will appear in the session schedule."
                            )}
                        </p>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center justify-end gap-3">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2.5 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg text-sm font-medium transition-colors"
                        >
                            {t("common.cancel", "Cancel")}
                        </button>
                        <button
                            onClick={handleAssign}
                            disabled={!selectedLessonId || isPending}
                            className="px-4 py-2.5 bg-brand-500 hover:bg-brand-600 disabled:bg-brand-300 disabled:cursor-not-allowed text-white rounded-lg text-sm font-medium transition-colors"
                        >
                            {isPending
                                ? t("common.assigning", "Assigning...")
                                : t(
                                      "sessions.assignLessonBtn",
                                      "Assign Lesson"
                                  )}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default AssignLessonModal;
