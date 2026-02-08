import { LoadingState } from "@/design-system";
import { LessonAssignment } from "@/features/dashboard/admin/learning/pages/lessons/types/lesson-assignments.types";
import { TFunction } from "i18next";
import { CheckCircle, Eye, FileText, Send } from "lucide-react";
import { useState } from "react";
import AssignmentSubmitModal from "../AssignmentSubmitModal";
import { Lesson } from "../../../types";

export function AssignmentsTab({
    lesson,
    assignments,
    isLoadingAssignments,
    t,
}: {
    lesson: Lesson;
    assignments: LessonAssignment[];
    isLoadingAssignments: boolean;
    t: TFunction<"selfStudy", undefined>;
}) {
    const [selectedAssignment, setSelectedAssignment] =
        useState<LessonAssignment | null>(null);
    const [submittedAssignments, setSubmittedAssignments] = useState<
        Set<string>
    >(new Set());
    const [showSubmitModal, setShowSubmitModal] = useState(false);

    if (isLoadingAssignments) return <LoadingState />;

    if (assignments.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-8">
                <p className="text-sm text-gray-400 dark:text-gray-500">
                    {t("lesson.noAssignments")}
                </p>
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-3">
            {assignments.map((assignment) => (
                <div
                    key={assignment.id}
                    className="flex items-center justify-between p-4 bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700"
                >
                    <div className="flex items-center gap-4">
                        {/* Icon */}
                        <div className="size-10 rounded-full flex items-center justify-center bg-brand-100 dark:bg-brand-500/20">
                            <FileText className="size-5 text-brand-500" />
                        </div>

                        {/* Info */}
                        <div>
                            <h4 className="font-semibold text-gray-900 dark:text-white">
                                {assignment.title}
                            </h4>
                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                                {assignment.file?.humanReadableSize}
                            </p>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center gap-2">
                        <a
                            href={assignment.file?.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 px-4 py-2 rounded-xl border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 font-semibold text-sm hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                        >
                            <Eye className="size-4" />
                            {t("lesson.assignments.view")}
                        </a>
                        {submittedAssignments.has(assignment.id) ? (
                            <button
                                type="button"
                                disabled
                                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-success-500 text-white font-semibold text-sm cursor-default"
                            >
                                <CheckCircle className="size-4" />
                                {t("lesson.assignments.completed", "Completed")}
                            </button>
                        ) : (
                            <button
                                type="button"
                                onClick={() => {
                                    setSelectedAssignment(assignment);
                                    setShowSubmitModal(true);
                                }}
                                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-brand-500 hover:bg-brand-600 text-white font-semibold text-sm transition-colors"
                            >
                                <Send className="size-4" />
                                {t("lesson.assignments.submit")}
                            </button>
                        )}
                    </div>
                </div>
            ))}

            {/* Assignment Submit Modal */}
            {selectedAssignment && (
                <AssignmentSubmitModal
                    isOpen={showSubmitModal}
                    onClose={() => {
                        setShowSubmitModal(false);
                        setSelectedAssignment(null);
                    }}
                    assignment={selectedAssignment}
                    lessonId={String(lesson.id)}
                    onSuccess={() => {
                        setSubmittedAssignments((prev) => {
                            const next = new Set(prev);
                            next.add(selectedAssignment.id);
                            return next;
                        });
                    }}
                />
            )}
        </div>
    );
}
