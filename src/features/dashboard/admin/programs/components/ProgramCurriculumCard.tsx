import { useTranslation } from "react-i18next";
import type { ProgramCurriculum } from "../types";
import { withSkeleton } from "@/design-system/hooks/useSkeleton";

interface ProgramCurriculumCardProps {
    program: ProgramCurriculum;
    isToggling: boolean;
    onToggle: () => void;
}

function ProgramCurriculumCardBase({
    program,
    isToggling,
    onToggle,
}: ProgramCurriculumCardProps) {
    const { t } = useTranslation("programs");

    const isActive = Boolean(program.isActive);

    return (
        <div className="flex items-center justify-between p-4 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
            <div className="flex-1">
                <h3 className="text-base font-semibold text-gray-900 dark:text-white">
                    {program.name}
                </h3>
                {program.caption && (
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                        {program.caption}
                    </p>
                )}
            </div>

            <div className="flex items-center gap-3">
                <span
                    className={`text-xs font-medium px-2 py-1 rounded-full ${
                        isActive
                            ? "bg-success-50 text-success-600 dark:bg-success-500/10 dark:text-success-400"
                            : "bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400"
                    }`}
                >
                    {isActive
                        ? t("programs.card.active")
                        : t("programs.card.inactive")}
                </span>

                <button
                    type="button"
                    role="switch"
                    aria-checked={isActive}
                    disabled={isToggling}
                    onClick={onToggle}
                    className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${
                        isActive
                            ? "bg-brand-500"
                            : "bg-gray-200 dark:bg-gray-600"
                    }`}
                >
                    <span className="sr-only">
                        {t("programs.toggleStatus", "Toggle status")}
                    </span>
                    <span
                        className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                            isActive
                                ? "ltr:translate-x-5 rtl:-translate-x-5"
                                : "translate-x-0"
                        }`}
                    />
                </button>
            </div>
        </div>
    );
}

export const ProgramCurriculumCard = withSkeleton(
    "program-card",
    ProgramCurriculumCardBase
);
