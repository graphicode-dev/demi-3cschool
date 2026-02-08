import { useTranslation } from "react-i18next";
import { useNavigate, useParams } from "react-router-dom";
import { Star, Clock } from "lucide-react";
import { PageWrapper, ErrorState, LoadingState } from "@/design-system";
import { useAttemptResult } from "../api";
import { finalExamsPaths } from "../navigation";
import {
    USE_MOCK_DATA,
    MOCK_RESULT_PASSED,
    MOCK_RESULT_UNDER_REVIEW,
} from "../mocks";

export function ExamResultPage() {
    const { t } = useTranslation("finalExams");
    const navigate = useNavigate();
    const { examId } = useParams<{ examId: string }>();

    // For demo purposes, use passed result for exam 1, under review for others
    const mockResult =
        examId === "1" ? MOCK_RESULT_PASSED : MOCK_RESULT_UNDER_REVIEW;

    const {
        data: realResult,
        isLoading,
        error,
    } = useAttemptResult(examId ?? "", { enabled: !!examId && !USE_MOCK_DATA });

    const result = USE_MOCK_DATA ? mockResult : realResult;

    const handleBackToExams = () => {
        navigate(finalExamsPaths.list());
    };

    if (isLoading) return <LoadingState />;

    if (error) {
        return (
            <ErrorState
                title={t("result.failedToLoad")}
                message={(error as any)?.message || t("result.unknownError")}
                onRetry={() => window.location.reload()}
            />
        );
    }

    if (!result) {
        return (
            <ErrorState
                title={t("result.notFound")}
                message={t("result.resultNotFound")}
            />
        );
    }

    const isPassed = result.status === "passed";
    const isUnderReview = result.status === "under_review";

    return (
        <PageWrapper>
            <div className="max-w-lg mx-auto">
                {/* Title */}
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                    {t("result.title")}
                </h1>
                <p className="text-gray-500 dark:text-gray-400 mb-6">
                    {t("result.subtitle")}
                </p>

                {/* Result Card */}
                <div
                    className={`rounded-2xl border-2 p-8 mb-6 ${
                        isPassed
                            ? "bg-success-50 dark:bg-success-500/10 border-success-200 dark:border-success-500/20"
                            : "bg-brand-50 dark:bg-brand-500/10 border-brand-200 dark:border-brand-500/20"
                    }`}
                >
                    {/* Icon */}
                    <div className="flex justify-center mb-6">
                        <div
                            className={`flex items-center justify-center size-20 rounded-full ${
                                isPassed
                                    ? "bg-success-100 dark:bg-success-500/20"
                                    : "bg-brand-100 dark:bg-brand-500/20"
                            }`}
                        >
                            {isPassed ? (
                                <Star
                                    className="size-10 text-success-500"
                                    fill="currentColor"
                                />
                            ) : (
                                <Clock className="size-10 text-brand-500" />
                            )}
                        </div>
                    </div>

                    {/* Status Title */}
                    <h2
                        className={`text-2xl font-bold text-center mb-2 ${
                            isPassed
                                ? "text-success-700 dark:text-success-400"
                                : "text-gray-900 dark:text-white"
                        }`}
                    >
                        {isPassed
                            ? t("result.greatJob")
                            : t("result.underReview")}
                    </h2>

                    {/* Status Description */}
                    <p className="text-center text-gray-600 dark:text-gray-400 mb-6">
                        {isPassed
                            ? t("result.passedDescription")
                            : t("result.underReviewDescription")}
                    </p>

                    {/* Score Box (only for passed) */}
                    {isPassed && (
                        <div className="bg-white dark:bg-gray-900 rounded-xl border border-success-200 dark:border-success-500/20 p-4 mb-4">
                            <p className="text-center text-sm text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1">
                                {t("result.score")}
                            </p>
                            <p className="text-center text-3xl font-bold text-success-600 dark:text-success-400">
                                {result.score} / {result.totalPoints}
                            </p>
                        </div>
                    )}

                    {/* Encouragement Message */}
                    <div
                        className={`rounded-xl border px-4 py-3 text-center ${
                            isPassed
                                ? "bg-success-100 dark:bg-success-500/10 border-success-200 dark:border-success-500/20"
                                : "bg-white dark:bg-gray-900 border-brand-200 dark:border-brand-500/20"
                        }`}
                    >
                        <p
                            className={`text-sm font-medium ${
                                isPassed
                                    ? "text-success-700 dark:text-success-400"
                                    : "text-gray-600 dark:text-gray-400"
                            }`}
                        >
                            {isPassed
                                ? t("result.keepUpGreatWork")
                                : t("result.checkBackLater")}
                        </p>
                    </div>
                </div>

                {/* Back Button */}
                <button
                    onClick={handleBackToExams}
                    className="w-full flex items-center justify-center gap-2 py-4 px-6 rounded-xl bg-brand-500 hover:bg-brand-600 text-white font-semibold transition-colors"
                >
                    {t("result.backToExams")}
                </button>
            </div>
        </PageWrapper>
    );
}

export default ExamResultPage;
