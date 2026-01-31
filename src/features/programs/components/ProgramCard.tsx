import { BookOpen, FileText, Layers } from "lucide-react";
import { Program } from "../types";
import { useTranslation } from "react-i18next";
import { StatItem } from "./StatItem";

interface ProgramCardProps {
    program: Program;
}

export function ProgramCard({ program }: ProgramCardProps) {
    const { t } = useTranslation("programs");

    return (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-theme-sm border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-start gap-4 mb-6">
                <div className="flex items-center justify-center w-14 h-14 rounded-xl bg-brand-50 dark:bg-brand-500/10">
                    <BookOpen className="w-7 h-7 text-brand-500" />
                </div>
                <div className="flex-1">
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-1">
                        {program.title}
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                        {program.description}
                    </p>
                    <div className="flex items-center gap-3 mt-3">
                        <span
                            className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                                program.isActive
                                    ? "bg-success-50 text-success-600 dark:bg-success-500/10 dark:text-success-400"
                                    : "bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400"
                            }`}
                        >
                            {program.isActive
                                ? t("programs.card.active")
                                : t("programs.card.inactive")}
                        </span>
                        <span className="text-sm text-gray-400 dark:text-gray-500">
                            {t("programs.card.updatedAgo", {
                                time: program.updatedAt,
                            })}
                        </span>
                    </div>
                </div>
            </div>

            <div className="w-full flex flex-wrap items-center justify-between gap-6 pt-6 border-t border-gray-100 dark:border-gray-700">
                <StatItem
                    icon={<Layers className="w-5 h-5 text-brand-500" />}
                    iconBgColor="bg-brand-50 dark:bg-brand-500/10"
                    value={program.stats.learningPaths}
                    label={t("programs.card.learningPaths")}
                />
                <StatItem
                    icon={<Layers className="w-5 h-5 text-success-500" />}
                    iconBgColor="bg-success-50 dark:bg-success-500/10"
                    value={program.stats.totalLevels}
                    label={t("programs.card.totalLevels")}
                />
                <StatItem
                    icon={<FileText className="w-5 h-5 text-warning-500" />}
                    iconBgColor="bg-warning-50 dark:bg-warning-500/10"
                    value={program.stats.totalLessons}
                    label={t("programs.card.totalLessons")}
                />
            </div>
        </div>
    );
}
