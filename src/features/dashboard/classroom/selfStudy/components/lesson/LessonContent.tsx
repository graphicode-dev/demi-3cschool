import { useTranslation } from "react-i18next";
import type { Lesson, LessonTabType } from "../../types";

interface LessonContentProps {
    lesson: Lesson;
    activeTab: LessonTabType;
}

export function LessonContent({ lesson, activeTab }: LessonContentProps) {
    const { t } = useTranslation("selfStudy");

    if (activeTab === "about") {
        return (
            <div className="flex flex-col gap-2">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                    {lesson.title}
                </h2>
                <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
                    {lesson.description}
                </p>
            </div>
        );
    }

    if (activeTab === "assignments") {
        return (
            <div className="flex flex-col items-center justify-center py-8">
                <p className="text-sm text-gray-400 dark:text-gray-500">
                    {t("lesson.noAssignments")}
                </p>
            </div>
        );
    }

    if (activeTab === "quiz") {
        return (
            <div className="flex flex-col items-center justify-center py-8">
                <p className="text-sm text-gray-400 dark:text-gray-500">
                    {t("lesson.noLessonQuiz")}
                </p>
            </div>
        );
    }

    if (activeTab === "materials") {
        return (
            <div className="flex flex-col items-center justify-center py-8">
                <p className="text-sm text-gray-400 dark:text-gray-500">
                    {t("lesson.noMaterials")}
                </p>
            </div>
        );
    }

    return null;
}

export default LessonContent;
