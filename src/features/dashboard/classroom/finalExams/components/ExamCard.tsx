import { useTranslation } from "react-i18next";
import {
    Clock,
    List,
    Calendar,
    CheckCircle,
    AlertCircle,
    Lock,
    ArrowRight,
    BarChart3,
    XCircle,
} from "lucide-react";
import type { FinalExam } from "../types";

interface ExamCardProps {
    exam: FinalExam;
    onStartExam?: (examId: number) => void;
    onViewResults?: (examId: number) => void;
}

export function ExamCard({ exam, onStartExam, onViewResults }: ExamCardProps) {
    const { t } = useTranslation("finalExams");

    const isCompleted = exam.status === "completed";
    const isAvailable = exam.status === "available";
    const isLocked = exam.status === "locked";

    return (
        <div
            className={`
                bg-white dark:bg-gray-900 rounded-2xl shadow-theme-sm p-6 w-full
                border-t-4
                ${isCompleted ? "border-success-500" : ""}
                ${isAvailable ? "border-brand-500" : ""}
                ${isLocked ? "border-gray-400 opacity-50" : ""}
            `}
        >
            {/* Icon */}
            <div className="flex justify-center mb-4">
                <div
                    className={`
                        flex items-center justify-center size-16 rounded-full
                        ${isCompleted ? "bg-success-100 dark:bg-success-500/20" : ""}
                        ${isAvailable ? "bg-brand-100 dark:bg-brand-500/20" : ""}
                        ${isLocked ? "bg-gray-200 dark:bg-gray-700" : ""}
                    `}
                >
                    {isCompleted && (
                        <CheckCircle className="size-8 text-success-500" />
                    )}
                    {isAvailable && (
                        <ArrowRight className="size-8 text-brand-500" />
                    )}
                    {isLocked && <Lock className="size-8 text-gray-400" />}
                </div>
            </div>

            {/* Title */}
            <h3 className="text-lg font-bold text-gray-900 dark:text-white text-center mb-4">
                {exam.title}
            </h3>

            {/* Info Box */}
            <div className="bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl p-4 mb-4">
                <div className="flex flex-col gap-3">
                    {/* Duration */}
                    <div className="flex items-center gap-3">
                        <Clock className="size-5 text-gray-400" />
                        <span className="text-sm text-gray-500 dark:text-gray-400">
                            {exam.duration} {t("minutes")}
                        </span>
                    </div>

                    {/* Questions */}
                    <div className="flex items-center gap-3">
                        <List className="size-5 text-gray-400" />
                        <span className="text-sm text-gray-500 dark:text-gray-400">
                            {exam.questionsCount} {t("questions")}
                        </span>
                    </div>

                    {/* Date */}
                    <div className="flex items-center gap-3">
                        <Calendar className="size-5 text-gray-400" />
                        <span
                            className={`text-sm ${
                                isCompleted
                                    ? "text-success-500"
                                    : "text-gray-500 dark:text-gray-400"
                            }`}
                        >
                            {isCompleted && `${t("takenOn")} ${exam.takenDate}`}
                            {isAvailable && `${t("takenOn")} ${exam.takenDate}`}
                            {isLocked && `${t("opens")} ${exam.opensDate}`}
                        </span>
                    </div>
                </div>
            </div>

            {/* Divider */}
            <div className="border-t border-gray-200 dark:border-gray-700 mb-4" />

            {/* Status Badge */}
            <div className="flex justify-center mb-4">
                <div
                    className={`
                        flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold
                        ${isCompleted ? "bg-success-100 dark:bg-success-500/20 text-success-600 dark:text-success-400" : ""}
                        ${isAvailable ? "bg-warning-100 dark:bg-warning-500/20 text-warning-600 dark:text-warning-500" : ""}
                        ${isLocked ? "bg-gray-100 dark:bg-gray-800 text-gray-500" : ""}
                    `}
                >
                    {isCompleted && (
                        <>
                            <CheckCircle className="size-4" />
                            {t("finishedExam")}
                        </>
                    )}
                    {isAvailable && (
                        <>
                            <AlertCircle className="size-4" />
                            {t("oneAttemptOnly")}
                        </>
                    )}
                    {isLocked && (
                        <>
                            <XCircle className="size-4" />
                            {t("notAvailable")}
                        </>
                    )}
                </div>
            </div>

            {/* Action Button */}
            {isCompleted && (
                <button
                    onClick={() => onViewResults?.(exam.id)}
                    className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-success-500 text-success-600 dark:text-success-400 font-bold text-sm hover:bg-success-50 dark:hover:bg-success-500/10 transition-colors"
                >
                    <BarChart3 className="size-4" />
                    {t("viewResults")}
                </button>
            )}

            {isAvailable && (
                <button
                    onClick={() => onStartExam?.(exam.id)}
                    className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-brand-500 hover:bg-brand-600 text-white font-bold text-sm shadow-lg shadow-brand-500/30 transition-colors"
                >
                    {t("startExam")}
                    <ArrowRight className="size-4" />
                </button>
            )}

            {isLocked && (
                <button
                    disabled
                    className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-gray-400 text-white font-bold text-sm cursor-not-allowed"
                >
                    <Lock className="size-4" />
                    {t("locked")}
                </button>
            )}
        </div>
    );
}

export default ExamCard;
