import { useTranslation } from "react-i18next";
import { Sun } from "lucide-react";

interface SummerCampBannerProps {
    totalSessions: number;
    completedSessions: number;
}

export function SummerCampBanner({
    totalSessions,
    completedSessions,
}: SummerCampBannerProps) {
    const { t } = useTranslation("physicalSessions");

    const progressPercentage = (completedSessions / totalSessions) * 100;

    return (
        <div className="bg-warning-50 dark:bg-warning-500/10 border border-warning-400 rounded-xl p-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            {/* Left Section */}
            <div className="flex items-center gap-3">
                {/* Sun Icon */}
                <div className="bg-white dark:bg-gray-800 rounded-full p-3 shadow-sm shrink-0">
                    <Sun className="size-8 text-warning-500" />
                </div>

                {/* Text */}
                <div className="flex flex-col gap-0.5">
                    <h3 className="text-base font-bold text-warning-700 dark:text-warning-400">
                        {t("summerCamp.title")}
                    </h3>
                    <p className="text-xs text-warning-600 dark:text-warning-500">
                        {t("summerCamp.description", { count: totalSessions })}
                    </p>
                </div>
            </div>

            {/* Right Section - Progress */}
            <div className="flex flex-col gap-1.5 w-full md:w-56">
                <div className="flex items-center justify-between text-xs text-warning-600 dark:text-warning-500">
                    <span>{t("summerCamp.yourProgress")}</span>
                    <span>
                        {t("summerCamp.completed", {
                            completed: completedSessions,
                            total: totalSessions,
                        })}
                    </span>
                </div>
                <div className="bg-gray-200 dark:bg-gray-700 rounded-full h-2 overflow-hidden">
                    <div
                        className="bg-warning-500 h-full rounded-full transition-all duration-300"
                        style={{ width: `${progressPercentage}%` }}
                    />
                </div>
            </div>
        </div>
    );
}

export default SummerCampBanner;
