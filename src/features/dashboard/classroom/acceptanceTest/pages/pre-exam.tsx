import {
    ClipboardList,
    Loader2,
    Clock,
    Target,
    AlertCircle,
    BookOpen,
    Zap,
    Shield,
    ArrowRight,
} from "lucide-react";
import { useTranslation } from "react-i18next";
import { AcceptanceExam } from "../types";
import { PageWrapper } from "@/design-system";

interface PreExamProps {
    startExam: () => void;
    isStarting: boolean;
    studentExam: AcceptanceExam;
}

// Helper to get questions count from exam (handles both camelCase and snake_case)
const getQuestionsCount = (exam: AcceptanceExam): number => {
    return (
        exam.questionsCount ??
        (exam as any).questionsCount ??
        (exam as any).questions?.length ??
        0
    );
};

function PreExam({ startExam, isStarting, studentExam }: PreExamProps) {
    const { t } = useTranslation("acceptanceTest");

    // Check if exam has questions
    const examQuestionsCount = getQuestionsCount(studentExam);
    const canStartExam = examQuestionsCount > 0;

    return (
        <PageWrapper>
            <div className="max-w-xl lg:max-w-2xl h-screen flex justify-center items-center mx-auto px-4">
                <div className="relative w-full bg-linear-to-br from-white via-white to-brand-50/30 dark:from-gray-900 dark:via-gray-900 dark:to-brand-950/20 rounded-3xl border-2 border-brand-200/50 dark:border-brand-900/50 overflow-hidden shadow-xl">
                    {/* Decorative background elements */}
                    <div className="absolute top-0 right-0 w-72 h-72 bg-brand-500/5 dark:bg-brand-500/10 rounded-full blur-3xl -translate-y-1/3 translate-x-1/3"></div>
                    <div className="absolute bottom-0 left-0 w-56 h-56 bg-brand-400/5 dark:bg-brand-400/10 rounded-full blur-3xl translate-y-1/3 -translate-x-1/3"></div>

                    {/* Header Section */}
                    <div className="relative p-8 text-center border-b border-brand-100/50 dark:border-brand-900/50">
                        <div className="relative inline-block mb-4">
                            <div className="absolute inset-0 bg-brand-500/20 dark:bg-brand-500/30 rounded-2xl blur-xl"></div>
                            <div className="relative flex h-20 w-20 items-center justify-center rounded-2xl bg-linear-to-br from-brand-100 to-brand-200 dark:from-brand-500/20 dark:to-brand-600/20 border-2 border-brand-300 dark:border-brand-700 mx-auto shadow-lg">
                                <ClipboardList
                                    className="h-10 w-10 text-brand-600 dark:text-brand-400"
                                    strokeWidth={2.5}
                                />
                            </div>
                        </div>
                        <h1 className="text-3xl font-bold bg-linear-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-300 bg-clip-text text-transparent mb-2">
                            {t("exam.title")}
                        </h1>
                        <p className="text-gray-600 dark:text-gray-400">
                            {t("exam.description")}
                        </p>
                    </div>

                    <div className="relative p-8 space-y-6">
                        {/* Exam Details */}
                        <div>
                            <div className="flex items-center gap-2 mb-4">
                                <BookOpen className="h-5 w-5 text-brand-600 dark:text-brand-400" />
                                <h3 className="font-semibold text-gray-900 dark:text-white">
                                    {t("exam.examDetails")}
                                </h3>
                            </div>
                            <div className="p-5 rounded-2xl border-2 bg-linear-to-br from-brand-50 to-brand-100/50 dark:from-brand-500/10 dark:to-brand-600/10 border-brand-500 shadow-md">
                                <div className="flex items-start justify-between gap-4">
                                    <div className="flex-1">
                                        <h4 className="font-semibold text-gray-900 dark:text-white mb-1">
                                            {studentExam.title}
                                        </h4>
                                        {studentExam.description && (
                                            <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                                                {studentExam.description}
                                            </p>
                                        )}
                                        <div className="flex flex-wrap items-center gap-3 text-xs">
                                            {(studentExam.timeLimit ||
                                                (studentExam as any)
                                                    .timeLimit) && (
                                                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 font-medium">
                                                    <Clock className="h-3.5 w-3.5" />
                                                    {studentExam.timeLimit ||
                                                        (studentExam as any)
                                                            .timeLimit}{" "}
                                                    {t("exam.minutes")}
                                                </span>
                                            )}
                                            {(studentExam.passingScore ||
                                                (studentExam as any)
                                                    .passingScore) && (
                                                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400 font-medium">
                                                    <Target className="h-3.5 w-3.5" />
                                                    {studentExam.passingScore ||
                                                        (studentExam as any)
                                                            .passingScore}
                                                    % pass
                                                </span>
                                            )}
                                            <span
                                                className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg font-medium ${
                                                    examQuestionsCount === 0
                                                        ? "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400"
                                                        : "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400"
                                                }`}
                                            >
                                                <BookOpen className="h-3.5 w-3.5" />
                                                {examQuestionsCount}{" "}
                                                {t("exam.questionsLabel")}
                                            </span>
                                        </div>
                                        {examQuestionsCount === 0 && (
                                            <div className="flex items-center gap-1.5 mt-2 text-xs text-red-600 dark:text-red-400">
                                                <AlertCircle className="h-3.5 w-3.5" />
                                                <span className="font-medium">
                                                    {t(
                                                        "exam.noQuestionsWarning"
                                                    )}
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Instructions Card */}
                        <div className="relative p-5 rounded-2xl bg-linear-to-br from-yellow-50 to-amber-50/50 dark:from-yellow-950/30 dark:to-amber-900/20 border-2 border-yellow-200 dark:border-yellow-800/50 overflow-hidden">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-yellow-500/10 rounded-full blur-2xl"></div>
                            <div className="relative flex items-start gap-3 mb-3">
                                <div className="shrink-0 mt-0.5">
                                    <Shield className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />
                                </div>
                                <h3 className="font-semibold text-yellow-800 dark:text-yellow-400">
                                    {t("exam.importantInstructions")}
                                </h3>
                            </div>
                            <ul className="relative text-sm text-yellow-700 dark:text-yellow-300 space-y-2 ml-8">
                                <li className="flex items-start gap-2">
                                    <Zap className="h-4 w-4 mt-0.5 shrink-0" />
                                    <span>{t("exam.instruction1")}</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <Zap className="h-4 w-4 mt-0.5 shrink-0" />
                                    <span>{t("exam.instruction2")}</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <Zap className="h-4 w-4 mt-0.5 shrink-0" />
                                    <span>{t("exam.instruction3")}</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <Zap className="h-4 w-4 mt-0.5 shrink-0" />
                                    <span>{t("exam.instruction4")}</span>
                                </li>
                            </ul>
                        </div>

                        {/* Warning if exam has no questions */}
                        {examQuestionsCount === 0 && (
                            <div className="relative p-5 rounded-2xl bg-linear-to-br from-red-50 to-red-100/50 dark:from-red-950/30 dark:to-red-900/20 border-2 border-red-200 dark:border-red-800/50 overflow-hidden animate-pulse">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-red-500/10 rounded-full blur-2xl"></div>
                                <div className="relative flex items-center gap-3 text-red-600 dark:text-red-400">
                                    <AlertCircle
                                        className="h-6 w-6 shrink-0"
                                        strokeWidth={2.5}
                                    />
                                    <span className="font-semibold">
                                        {t("exam.cannotStartNoQuestions")}
                                    </span>
                                </div>
                            </div>
                        )}

                        {/* Start Button */}
                        <div className="flex gap-4 pt-2">
                            <button
                                onClick={startExam}
                                disabled={isStarting || !canStartExam}
                                className="group relative flex-1 px-8 py-4 rounded-xl bg-linear-to-r from-brand-500 to-brand-600 hover:from-brand-600 hover:to-brand-700 text-white font-semibold transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:from-brand-500 disabled:hover:to-brand-600 flex items-center justify-center gap-3 shadow-lg hover:shadow-xl disabled:shadow-lg overflow-hidden"
                            >
                                <div className="absolute inset-0 bg-linear-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                                <span className="relative">
                                    {isStarting ? (
                                        <>
                                            <Loader2
                                                className="inline h-5 w-5 animate-spin mr-2"
                                                strokeWidth={2.5}
                                            />
                                            {t("exam.starting")}
                                        </>
                                    ) : (
                                        <>
                                            {t("exam.startExam")}
                                            <ArrowRight
                                                className="inline h-5 w-5 ms-3 group-hover:translate-x-1 transition-transform rtl:rotate-180"
                                                strokeWidth={2.5}
                                            />
                                        </>
                                    )}
                                </span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </PageWrapper>
    );
}

export default PreExam;
