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
} from "lucide-react";
import type {
    Lesson,
    LessonTabType,
    LessonMaterial,
    LessonAssignment,
    LessonQuizItem,
} from "../../types";
import { RatingModal } from "./RatingModal";

interface LessonContentProps {
    lesson: Lesson;
    activeTab: LessonTabType;
}

// Mock data for demonstration
const MOCK_MATERIALS: LessonMaterial[] = [
    { id: 1, name: "Lesson Slides", type: "PDF", size: "2.5 MB", url: "#" },
    {
        id: 2,
        name: "Variables Cheat Sheet",
        type: "IMAGE",
        size: "2.5 MB",
        url: "#",
    },
];

const MOCK_ASSIGNMENTS: LessonAssignment[] = [
    {
        id: 1,
        title: "Create Your First Variable",
        description: "Open the code editor and create a variable named 'score'",
        status: "pending",
    },
    {
        id: 2,
        title: "Data Types Practice",
        description: "Fill in the blanks in the provided file",
        status: "submitted",
        submittedAt: "2024-01-15",
    },
];

const MOCK_QUIZZES: LessonQuizItem[] = [
    {
        id: 1,
        title: "Variables Challenge",
        questionsCount: 5,
        duration: 10,
        status: "completed",
        score: 5,
        maxScore: 5,
    },
    {
        id: 2,
        title: "Variables Challenge",
        questionsCount: 5,
        duration: 10,
        status: "new",
    },
];

export function LessonContent({ lesson, activeTab }: LessonContentProps) {
    const { t } = useTranslation("selfStudy");
    const [showRatingModal, setShowRatingModal] = useState(false);

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

                {/* Progress */}
                <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-xl">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                            {t("lesson.about.yourProgress")}
                        </span>
                        <span className="text-sm font-bold text-brand-500">
                            75% {t("lesson.about.complete")}
                        </span>
                    </div>
                    <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                        <div
                            className="h-full bg-brand-500 rounded-full transition-all"
                            style={{ width: "75%" }}
                        />
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
        if (MOCK_MATERIALS.length === 0) {
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
                {MOCK_MATERIALS.map((material) => (
                    <div
                        key={material.id}
                        className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700"
                    >
                        <div className="flex items-center gap-4">
                            {/* Icon */}
                            <div className="size-12 rounded-xl bg-brand-100 dark:bg-brand-500/20 flex items-center justify-center">
                                {material.type === "PDF" ? (
                                    <FileText className="size-6 text-brand-500" />
                                ) : (
                                    <Image className="size-6 text-brand-500" />
                                )}
                            </div>

                            {/* Info */}
                            <div>
                                <h4 className="font-semibold text-gray-900 dark:text-white">
                                    {material.name}
                                </h4>
                                <p className="text-xs text-gray-500 dark:text-gray-400">
                                    {material.type} • {material.size}
                                </p>
                            </div>
                        </div>

                        {/* Download Button */}
                        <button className="p-2 text-gray-400 hover:text-brand-500 transition-colors">
                            <Download className="size-5" />
                        </button>
                    </div>
                ))}
            </div>
        );
    }

    // Lesson Quiz Tab
    if (activeTab === "lessonQuiz") {
        if (MOCK_QUIZZES.length === 0) {
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
                {MOCK_QUIZZES.map((quiz) => (
                    <div
                        key={quiz.id}
                        className={`flex items-center justify-between p-4 rounded-xl border ${
                            quiz.status === "completed"
                                ? "bg-success-50 dark:bg-success-500/10 border-success-200 dark:border-success-500/20"
                                : "bg-warning-50 dark:bg-warning-500/10 border-warning-200 dark:border-warning-500/20"
                        }`}
                    >
                        <div className="flex items-center gap-4">
                            {/* Icon */}
                            <div
                                className={`size-10 rounded-full flex items-center justify-center ${
                                    quiz.status === "completed"
                                        ? "bg-success-100 dark:bg-success-500/20"
                                        : "bg-warning-100 dark:bg-warning-500/20"
                                }`}
                            >
                                {quiz.status === "completed" ? (
                                    <CheckCircle className="size-5 text-success-500" />
                                ) : (
                                    <FileText className="size-5 text-warning-500" />
                                )}
                            </div>

                            {/* Info */}
                            <div>
                                <div className="flex items-center gap-2">
                                    <h4 className="font-semibold text-gray-900 dark:text-white">
                                        {quiz.title}
                                    </h4>
                                    <span
                                        className={`px-2 py-0.5 text-xs font-semibold rounded-full ${
                                            quiz.status === "completed"
                                                ? "bg-success-100 dark:bg-success-500/20 text-success-600 dark:text-success-400"
                                                : "bg-warning-100 dark:bg-warning-500/20 text-warning-600 dark:text-warning-500"
                                        }`}
                                    >
                                        {quiz.status === "completed"
                                            ? t("lesson.quiz.completed")
                                            : t("lesson.quiz.new")}
                                    </span>
                                </div>
                                <div className="flex items-center gap-3 text-xs text-gray-500 dark:text-gray-400 mt-1">
                                    <span>
                                        {quiz.questionsCount}{" "}
                                        {t("lesson.quiz.questionsLabel")}
                                    </span>
                                    <span>•</span>
                                    <span>{quiz.duration} mins</span>
                                    {quiz.status === "completed" &&
                                        quiz.score !== undefined && (
                                            <>
                                                <span>•</span>
                                                <span className="text-success-600 dark:text-success-400 font-semibold">
                                                    {t("lesson.quiz.score")}:{" "}
                                                    {quiz.score}/{quiz.maxScore}
                                                </span>
                                            </>
                                        )}
                                </div>
                            </div>
                        </div>

                        {/* Action Button */}
                        <button
                            className={`flex items-center gap-2 px-4 py-2 rounded-xl font-semibold text-sm transition-colors ${
                                quiz.status === "completed"
                                    ? "bg-success-500 hover:bg-success-600 text-white"
                                    : "bg-warning-500 hover:bg-warning-600 text-white"
                            }`}
                        >
                            {quiz.status === "completed" ? (
                                <>
                                    <Eye className="size-4" />
                                    {t("lesson.quiz.viewResult")}
                                </>
                            ) : (
                                t("lesson.quiz.startQuiz")
                            )}
                        </button>
                    </div>
                ))}
            </div>
        );
    }

    // Assignments Tab
    if (activeTab === "assignments") {
        if (MOCK_ASSIGNMENTS.length === 0) {
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
                {MOCK_ASSIGNMENTS.map((assignment) => (
                    <div
                        key={assignment.id}
                        className="flex items-center justify-between p-4 bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700"
                    >
                        <div className="flex items-center gap-4">
                            {/* Icon */}
                            <div
                                className={`size-10 rounded-full flex items-center justify-center ${
                                    assignment.status === "submitted"
                                        ? "bg-success-100 dark:bg-success-500/20"
                                        : "bg-brand-100 dark:bg-brand-500/20"
                                }`}
                            >
                                {assignment.status === "submitted" ? (
                                    <CheckCircle className="size-5 text-success-500" />
                                ) : (
                                    <FileText className="size-5 text-brand-500" />
                                )}
                            </div>

                            {/* Info */}
                            <div>
                                <h4 className="font-semibold text-gray-900 dark:text-white">
                                    {assignment.title}
                                </h4>
                                <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                                    {assignment.description}
                                </p>
                                {assignment.status === "submitted" && (
                                    <span className="inline-flex items-center gap-1 text-xs text-success-600 dark:text-success-400 mt-1">
                                        <CheckCircle className="size-3" />
                                        {t("lesson.assignments.submitted")}
                                    </span>
                                )}
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex items-center gap-2">
                            <button className="flex items-center gap-2 px-4 py-2 rounded-xl border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 font-semibold text-sm hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                                <Eye className="size-4" />
                                {t("lesson.assignments.view")}
                            </button>
                            {assignment.status === "pending" && (
                                <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-brand-500 hover:bg-brand-600 text-white font-semibold text-sm transition-colors">
                                    <Send className="size-4" />
                                    {t("lesson.assignments.submit")}
                                </button>
                            )}
                        </div>
                    </div>
                ))}
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
