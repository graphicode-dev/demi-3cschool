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
    Sparkles,
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
            <div className="max-w-xl lg:max-w-2xl min-h-[80vh] flex justify-center items-center mx-auto px-4 py-8">
                <div className="relative w-full bg-white dark:bg-gray-900 rounded-4xl border-2 border-brand-200 dark:border-brand-800 overflow-hidden shadow-2xl">
                    {/* Decorative background blobs */}
                    <div className="absolute top-0 right-0 w-80 h-80 bg-brand-400/10 dark:bg-brand-500/10 rounded-full blur-3xl -translate-y-1/3 translate-x-1/3 pointer-events-none" />
                    <div className="absolute bottom-0 left-0 w-64 h-64 bg-cyan-400/10 dark:bg-cyan-400/10 rounded-full blur-3xl translate-y-1/3 -translate-x-1/3 pointer-events-none" />

                    {/* Header Section */}
                    <div className="relative px-8 pt-10 pb-8 text-center">
                        <div className="relative inline-block mb-5">
                            <div className="absolute inset-0 bg-brand-400/25 rounded-full blur-2xl animate-pulse" />
                            <div className="relative flex h-24 w-24 items-center justify-center rounded-full bg-brand-100 dark:bg-brand-500/20 border-4 border-brand-300 dark:border-brand-700 mx-auto shadow-lg">
                                <ClipboardList
                                    className="h-12 w-12 text-brand-600 dark:text-brand-400"
                                    strokeWidth={2}
                                />
                            </div>
                        </div>
                        <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-white mb-3">
                            {t("exam.title")}
                        </h1>
                        <p className="text-base text-gray-500 dark:text-gray-400 max-w-md mx-auto leading-relaxed">
                            {t("exam.description")}
                        </p>
                    </div>

                    <div className="relative px-8 pb-10 space-y-6">
                        {/* Exam Details */}
                        <div className="rounded-2xl bg-brand-50/60 dark:bg-brand-500/5 border border-brand-200 dark:border-brand-800 p-6">
                            <div className="flex items-center gap-2.5 mb-4">
                                <BookOpen className="h-5 w-5 text-brand-600 dark:text-brand-400" />
                                <h3 className="text-base font-bold text-gray-900 dark:text-white">
                                    {t("exam.examDetails")}
                                </h3>
                            </div>
                            <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
                                {studentExam.title}
                            </h4>
                            {studentExam.description && (
                                <p className="text-sm text-gray-500 dark:text-gray-400 mb-4 leading-relaxed">
                                    {studentExam.description}
                                </p>
                            )}
                            <div className="flex flex-wrap items-center gap-3">
                                {(studentExam.timeLimit ||
                                    (studentExam as any).timeLimit) && (
                                    <span className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 text-sm font-semibold">
                                        <Clock className="h-4 w-4" />
                                        {studentExam.timeLimit ||
                                            (studentExam as any).timeLimit}{" "}
                                        {t("exam.minutes")}
                                    </span>
                                )}
                                {(studentExam.passingScore ||
                                    (studentExam as any).passingScore) && (
                                    <span className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400 text-sm font-semibold">
                                        <Target className="h-4 w-4" />
                                        {t("exam.passingScoreLabel", {
                                            score:
                                                studentExam.passingScore ||
                                                (studentExam as any)
                                                    .passingScore,
                                        })}
                                    </span>
                                )}
                                <span
                                    className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-sm font-semibold ${
                                        examQuestionsCount === 0
                                            ? "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400"
                                            : "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400"
                                    }`}
                                >
                                    <BookOpen className="h-4 w-4" />
                                    {examQuestionsCount}{" "}
                                    {t("exam.questionsLabel")}
                                </span>
                            </div>
                            {examQuestionsCount === 0 && (
                                <div className="flex items-center gap-2 mt-3 text-sm text-red-600 dark:text-red-400">
                                    <AlertCircle className="h-4 w-4" />
                                    <span className="font-medium">
                                        {t("exam.noQuestionsWarning")}
                                    </span>
                                </div>
                            )}
                        </div>

                        {/* Instructions Card */}
                        <div className="relative rounded-2xl bg-amber-50/80 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800/50 p-6 overflow-hidden">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-amber-400/10 rounded-full blur-2xl pointer-events-none" />
                            <div className="relative flex items-center gap-2.5 mb-4">
                                <Shield className="h-5 w-5 text-amber-600 dark:text-amber-400" />
                                <h3 className="text-base font-bold text-amber-800 dark:text-amber-300">
                                    {t("exam.importantInstructions")}
                                </h3>
                            </div>
                            <ul className="relative space-y-3">
                                <li className="flex items-start gap-3 text-sm text-amber-700 dark:text-amber-300">
                                    <Zap className="h-4 w-4 mt-0.5 shrink-0" />
                                    <span className="leading-relaxed">
                                        {t("exam.instruction1")}
                                    </span>
                                </li>
                                <li className="flex items-start gap-3 text-sm text-amber-700 dark:text-amber-300">
                                    <Zap className="h-4 w-4 mt-0.5 shrink-0" />
                                    <span className="leading-relaxed">
                                        {t("exam.instruction2")}
                                    </span>
                                </li>
                                <li className="flex items-start gap-3 text-sm text-amber-700 dark:text-amber-300">
                                    <Zap className="h-4 w-4 mt-0.5 shrink-0" />
                                    <span className="leading-relaxed">
                                        {t("exam.instruction3")}
                                    </span>
                                </li>
                                <li className="flex items-start gap-3 text-sm text-amber-700 dark:text-amber-300">
                                    <Zap className="h-4 w-4 mt-0.5 shrink-0" />
                                    <span className="leading-relaxed">
                                        {t("exam.instruction4")}
                                    </span>
                                </li>
                            </ul>
                        </div>

                        {/* Warning if exam has no questions */}
                        {examQuestionsCount === 0 && (
                            <div className="relative p-5 rounded-2xl bg-red-50 dark:bg-red-950/20 border-2 border-red-200 dark:border-red-800/50 overflow-hidden animate-pulse">
                                <div className="relative flex items-center gap-3 text-red-600 dark:text-red-400">
                                    <AlertCircle
                                        className="h-6 w-6 shrink-0"
                                        strokeWidth={2.5}
                                    />
                                    <span className="font-semibold text-base">
                                        {t("exam.cannotStartNoQuestions")}
                                    </span>
                                </div>
                            </div>
                        )}

                        {/* Start Button */}
                        <div className="pt-2">
                            <button
                                onClick={startExam}
                                disabled={isStarting || !canStartExam}
                                className="group relative w-full px-8 py-5 rounded-2xl bg-brand-500 hover:bg-brand-600 active:scale-[0.98] text-white text-lg font-bold transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 shadow-xl hover:shadow-2xl overflow-hidden"
                            >
                                <div className="absolute inset-0 bg-linear-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                                <span className="relative flex items-center gap-2">
                                    {isStarting ? (
                                        <>
                                            <Loader2
                                                className="h-6 w-6 animate-spin"
                                                strokeWidth={2.5}
                                            />
                                            {t("exam.starting")}
                                        </>
                                    ) : (
                                        <>
                                            <Sparkles className="h-6 w-6" />
                                            {t("exam.startExam")}
                                            <ArrowRight
                                                className="h-6 w-6 group-hover:translate-x-1 transition-transform rtl:rotate-180"
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
