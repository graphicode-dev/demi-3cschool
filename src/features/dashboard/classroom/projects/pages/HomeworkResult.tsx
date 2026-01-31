import { useTranslation } from "react-i18next";
import { useParams, useNavigate } from "react-router-dom";
import { Clock, CheckCircle, GraduationCap, ArrowLeft } from "lucide-react";
import { MOCK_PROJECTS } from "../mocks";

export function HomeworkResultPage() {
    const { t } = useTranslation("projects");
    const { projectId } = useParams<{ projectId: string }>();
    const navigate = useNavigate();

    const project = MOCK_PROJECTS.find((p) => p.id === Number(projectId));

    if (!project) {
        return (
            <div className="flex flex-col items-center justify-center py-12">
                <p className="text-gray-500 dark:text-gray-400">
                    {t("projectNotFound")}
                </p>
            </div>
        );
    }

    const isUnderReview = project.status === "under_review";

    return (
        <div className="flex flex-col gap-6 max-w-4xl mx-auto">
            {/* Back Button */}
            <button
                onClick={() => navigate(-1)}
                className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors w-fit"
            >
                <ArrowLeft className="size-4" />
                <span className="text-sm font-medium">{t("back")}</span>
            </button>

            {/* Header Section */}
            <div className="flex flex-col gap-1">
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                    {t("result.title")}
                </h1>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                    {t("result.description")}
                </p>
            </div>

            {/* Result Card */}
            <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-theme-sm border border-gray-200 dark:border-gray-700 p-6 sm:p-10">
                <div className="flex flex-col items-center gap-6">
                    {/* Status Icon */}
                    <div
                        className={`size-28 rounded-full flex items-center justify-center ${
                            isUnderReview
                                ? "bg-warning-500/10"
                                : "bg-success-500/10"
                        }`}
                    >
                        {isUnderReview ? (
                            <Clock className="size-14 text-warning-500" />
                        ) : (
                            <CheckCircle className="size-14 text-success-500" />
                        )}
                    </div>

                    {/* Status Badge (Under Review only) */}
                    {isUnderReview && (
                        <div className="flex items-center gap-3 px-6 py-3 rounded-2xl bg-warning-500/10">
                            <span className="size-3 rounded-full bg-warning-500" />
                            <span className="text-lg font-semibold text-warning-600">
                                {t("result.waitingForTeacher")}
                            </span>
                        </div>
                    )}

                    {/* Title */}
                    <h2 className="text-3xl font-bold text-gray-900 dark:text-white text-center">
                        {isUnderReview
                            ? t("result.underReview")
                            : t("result.greatJob")}
                    </h2>

                    {/* Description */}
                    <p className="text-base text-gray-500 dark:text-gray-400 text-center max-w-md">
                        {isUnderReview
                            ? t("result.underReviewDescription")
                            : t("result.reviewedDescription")}
                    </p>

                    {/* Points Card (Reviewed only) */}
                    {!isUnderReview && project.grade !== undefined && (
                        <div className="w-full max-w-sm bg-success-500/10 border border-success-500/50 rounded-2xl p-6 flex flex-col items-center gap-2">
                            <span className="text-lg font-semibold text-success-600">
                                {t("result.points")}
                            </span>
                            <span className="text-3xl font-bold text-success-600 tracking-wider">
                                {project.grade}/{project.maxGrade || 10}
                            </span>
                        </div>
                    )}

                    {/* Teacher Feedback (Reviewed only) */}
                    {!isUnderReview && project.feedback && (
                        <div className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl p-6">
                            <div className="flex items-center gap-4 mb-3">
                                <div className="size-12 rounded-full bg-brand-500 flex items-center justify-center">
                                    <GraduationCap className="size-6 text-white" />
                                </div>
                                <span className="text-lg font-bold text-gray-900 dark:text-white">
                                    {t("result.teacherFeedback")}
                                </span>
                            </div>
                            <p className="text-base text-gray-600 dark:text-gray-300 leading-relaxed">
                                "{project.feedback}"
                            </p>
                        </div>
                    )}

                    {/* Encouragement Message (Under Review only) */}
                    {isUnderReview && (
                        <div className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl py-6 px-8 text-center">
                            <p className="text-lg font-medium text-gray-600 dark:text-gray-300 italic">
                                "{t("result.encouragement")}" 🌟
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default HomeworkResultPage;
