import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";
import { Clock, CheckCircle, GraduationCap } from "lucide-react";
import { PageWrapper } from "@/design-system";
import { useAssignmentGroups, type Assignment } from "../api";

export function HomeworkResultPage() {
    const { t } = useTranslation("projects");
    const { groupId, assignmentId } = useParams<{
        groupId: string;
        assignmentId: string;
    }>();

    const { data: groups, isLoading } = useAssignmentGroups(groupId);

    const assignment: Assignment | undefined = useMemo(() => {
        if (!groups || !assignmentId) return undefined;
        for (const group of groups) {
            for (const lesson of group.lessons) {
                const found = lesson.assignments.find(
                    (a) => String(a.assignmentId) === assignmentId
                );
                if (found) return found;
            }
        }
        return undefined;
    }, [groups, assignmentId]);

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center py-12">
                <p className="text-gray-500 dark:text-gray-400">
                    {t("loading", "Loading...")}
                </p>
            </div>
        );
    }

    if (!assignment) {
        return (
            <div className="flex flex-col items-center justify-center py-12">
                <p className="text-gray-500 dark:text-gray-400">
                    {t("projectNotFound")}
                </p>
            </div>
        );
    }

    const isUnderReview = assignment.status === "submitted";
    const isReviewed = assignment.status === "reviewed";

    return (
        <PageWrapper
            pageHeaderProps={{
                title: t("result.title"),
                subtitle: t("result.description"),
                backButton: true,
            }}
        >
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
                    {isReviewed && assignment.score !== null && (
                        <div className="w-full max-w-sm bg-success-500/10 border border-success-500/50 rounded-2xl p-6 flex flex-col items-center gap-2">
                            <span className="text-lg font-semibold text-success-600">
                                {t("result.points")}
                            </span>
                            <span className="text-3xl font-bold text-success-600 tracking-wider">
                                {assignment.score}/{assignment.maxScore}
                            </span>
                        </div>
                    )}

                    {/* Teacher Feedback (Reviewed only) */}
                    {isReviewed && assignment.teacherComment && (
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
                                {assignment.teacherComment}
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
        </PageWrapper>
    );
}

export default HomeworkResultPage;
