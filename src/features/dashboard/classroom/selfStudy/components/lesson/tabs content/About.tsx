import { Clock, PlayCircle } from "lucide-react";
import { Lesson } from "../../../types";
import { TFunction } from "i18next";

export const AboutTab = ({
    lesson,
    t,
}: {
    lesson: Lesson;
    t: TFunction<"selfStudy", undefined>;
}) => {
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
                    <span>15 {t("common.mins")}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-brand-500">
                    <PlayCircle className="size-4" />
                    <span>{t("lesson.about.videoLesson")}</span>
                </div>
            </div>
        </div>
    );
};
