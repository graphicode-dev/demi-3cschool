import { LoadingState } from "@/design-system";
import { LessonQuiz } from "@/features/dashboard/admin/learning/pages/lessons/types";
import { TFunction } from "i18next";
import { FileText } from "lucide-react";

export const LessonQuizTab = ({
    quizzes,
    isLoadingQuizzes,
    t,
}: {
    quizzes: LessonQuiz[];
    isLoadingQuizzes: boolean;
    t: TFunction<"selfStudy", undefined>;
}) => {
    if (isLoadingQuizzes) return <LoadingState />;

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
                                    {quiz.timeLimit} {t("lesson.quiz.minutes")}
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
};
