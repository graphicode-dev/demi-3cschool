import { useState } from "react";
import { useTranslation } from "react-i18next";
import {
    Clock,
    PlayCircle,
    FileText,
    Image,
    Download,
    CheckCircle,
    Eye,
    Send,
    Star,
    Loader2,
} from "lucide-react";
import type { Lesson, LessonTabType } from "../../types";
import { RatingModal } from "./RatingModal";
import { AssignmentSubmitModal } from "./AssignmentSubmitModal";
import {
    useLessonMaterialsByLesson,
    useLessonAssignmentsByLesson,
    useLessonQuizzesByLesson,
} from "@/features/dashboard/admin/learning/pages/lessons/api";
import type { LessonAssignment } from "@/features/dashboard/admin/learning/pages/lessons/types/lesson-assignments.types";

interface LessonContentProps {
    lesson: Lesson;
    activeTab: LessonTabType;
}

export function LessonContent({ lesson, activeTab }: LessonContentProps) {
    const { t } = useTranslation("selfStudy");
    const [showRatingModal, setShowRatingModal] = useState(false);
    const [showSubmitModal, setShowSubmitModal] = useState(false);
    const [selectedAssignment, setSelectedAssignment] =
        useState<LessonAssignment | null>(null);
    const [submittedAssignments, setSubmittedAssignments] = useState<
        Set<string>
    >(new Set());

    // Fetch materials only when materials tab is active
    const { data: materialsData, isLoading: isLoadingMaterials } =
        useLessonMaterialsByLesson(String(lesson.id), undefined, {
            enabled: activeTab === "materials",
        });

    // Fetch assignments only when assignments tab is active
    const { data: assignmentsData, isLoading: isLoadingAssignments } =
        useLessonAssignmentsByLesson(String(lesson.id), undefined, {
            enabled: activeTab === "assignments",
        });

    // Fetch quizzes only when lessonQuiz tab is active
    const { data: quizzesData, isLoading: isLoadingQuizzes } =
        useLessonQuizzesByLesson(String(lesson.id), undefined, {
            enabled: activeTab === "lessonQuiz",
        });

    const materials = materialsData?.items ?? [];
    const assignments = assignmentsData?.items ?? [];
    const quizzes = quizzesData?.items ?? [];

    // About Tab
    if (activeTab === "about") {
        return (
            <div className="flex flex-col gap-4">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                    {lesson.title}
                </h2>
                <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
                    {lesson.description}
                </p>

                {/* Duration & Video Info */}
                <div className="flex items-center gap-4 mt-2">
                    <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                        <Clock className="size-4" />
                        <span>15 mins</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-brand-500">
                        <PlayCircle className="size-4" />
                        <span>{t("lesson.about.videoLesson")}</span>
                    </div>
                </div>
            </div>
        );
    }

    // Review Tab
    if (activeTab === "review") {
        return (
            <div className="flex flex-col items-center py-6">
                {/* Stars Display */}
                <div className="flex gap-1 mb-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                            key={star}
                            className={`size-8 ${
                                star <= 4
                                    ? "text-warning-400 fill-warning-400"
                                    : "text-warning-400 fill-warning-400"
                            }`}
                        />
                    ))}
                </div>

                {/* Rating Score */}
                <p className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                    4.8 / 5
                </p>

                {/* Description */}
                <p className="text-sm text-gray-500 dark:text-gray-400 text-center mb-6">
                    {t("lesson.review.helpUsImprove")}
                </p>

                {/* Rate Button */}
                <button
                    onClick={() => setShowRatingModal(true)}
                    className="px-6 py-2.5 border-2 border-brand-500 text-brand-500 font-semibold rounded-xl hover:bg-brand-50 dark:hover:bg-brand-500/10 transition-colors"
                >
                    {t("lesson.review.rateThisLesson")}
                </button>

                {/* Rating Modal */}
                <RatingModal
                    isOpen={showRatingModal}
                    onClose={() => setShowRatingModal(false)}
                    onSubmit={(rating: number, feedback: string) => {
                        console.log("Rating:", rating, "Feedback:", feedback);
                        setShowRatingModal(false);
                    }}
                />
            </div>
        );
    }

    // Materials Tab
    if (activeTab === "materials") {
        if (isLoadingMaterials) {
            return (
                <div className="flex items-center justify-center py-8">
                    <Loader2 className="size-6 animate-spin text-brand-500" />
                </div>
            );
        }

        if (materials.length === 0) {
            return (
                <div className="flex flex-col items-center justify-center py-8">
                    <p className="text-sm text-gray-400 dark:text-gray-500">
                        {t("lesson.noMaterials")}
                    </p>
                </div>
            );
        }

        return (
            <div className="flex flex-col gap-3">
                {materials.map((material) => (
                    <div
                        key={material.id}
                        className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700"
                    >
                        <div className="flex items-center gap-4">
                            {/* Icon */}
                            <div className="size-12 rounded-xl bg-brand-100 dark:bg-brand-500/20 flex items-center justify-center">
                                {material.file?.mimeType?.includes("pdf") ? (
                                    <FileText className="size-6 text-brand-500" />
                                ) : (
                                    <Image className="size-6 text-brand-500" />
                                )}
                            </div>

                            {/* Info */}
                            <div>
                                <h4 className="font-semibold text-gray-900 dark:text-white">
                                    {material.title}
                                </h4>
                                <p className="text-xs text-gray-500 dark:text-gray-400">
                                    {material.file?.humanReadableSize}
                                </p>
                            </div>
                        </div>

                        {/* Download Button */}
                        <a
                            href={material.file?.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-2 text-gray-400 hover:text-brand-500 transition-colors"
                        >
                            <Download className="size-5" />
                        </a>
                    </div>
                ))}
            </div>
        );
    }

    // Lesson Quiz Tab
    if (activeTab === "lessonQuiz") {
        if (isLoadingQuizzes) {
            return (
                <div className="flex items-center justify-center py-8">
                    <Loader2 className="size-6 animate-spin text-brand-500" />
                </div>
            );
        }

        if (quizzes.length === 0) {
            return (
                <div className="flex flex-col items-center justify-center py-8">
                    <p className="text-sm text-gray-400 dark:text-gray-500">
                        {t("lesson.noLessonQuiz")}
                    </p>
                </div>
            );
        }

        return (
            <div className="flex flex-col gap-3">
                {quizzes.map((quiz) => (
                    <div
                        key={quiz.id}
                        className="flex items-center justify-between p-4 rounded-xl border bg-warning-50 dark:bg-warning-500/10 border-warning-200 dark:border-warning-500/20"
                    >
                        <div className="flex items-center gap-4">
                            {/* Icon */}
                            <div className="size-10 rounded-full flex items-center justify-center bg-warning-100 dark:bg-warning-500/20">
                                <FileText className="size-5 text-warning-500" />
                            </div>

                            {/* Info */}
                            <div>
                                <div className="flex items-center gap-2">
                                    <h4 className="font-semibold text-gray-900 dark:text-white">
                                        {t("lesson.quiz.title")}
                                    </h4>
                                    <span className="px-2 py-0.5 text-xs font-semibold rounded-full bg-warning-100 dark:bg-warning-500/20 text-warning-600 dark:text-warning-500">
                                        {t("lesson.quiz.new")}
                                    </span>
                                </div>
                                <div className="flex items-center gap-3 text-xs text-gray-500 dark:text-gray-400 mt-1">
                                    <span>
                                        {quiz.timeLimit}{" "}
                                        {t("lesson.quiz.minutes")}
                                    </span>
                                    <span>•</span>
                                    <span>
                                        {t("lesson.quiz.passingScore")}:{" "}
                                        {quiz.passingScore}%
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Action Button */}
                        <button className="flex items-center gap-2 px-4 py-2 rounded-xl font-semibold text-sm transition-colors bg-warning-500 hover:bg-warning-600 text-white">
                            {t("lesson.quiz.startQuiz")}
                        </button>
                    </div>
                ))}
            </div>
        );
    }

    // Assignments Tab
    if (activeTab === "assignments") {
        if (isLoadingAssignments) {
            return (
                <div className="flex items-center justify-center py-8">
                    <Loader2 className="size-6 animate-spin text-brand-500" />
                </div>
            );
        }

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
                                    {t(
                                        "lesson.assignments.completed",
                                        "Completed"
                                    )}
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

    // Editor Tab
    if (activeTab === "editor") {
        return (
            <div className="flex flex-col items-center justify-center py-8">
                <p className="text-sm text-gray-400 dark:text-gray-500">
                    {t("lesson.editor.comingSoon")}
                </p>
            </div>
        );
    }

    return null;
}

export default LessonContent;
