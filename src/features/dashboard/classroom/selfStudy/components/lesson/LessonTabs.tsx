import { useTranslation } from "react-i18next";
import type { LessonTabType } from "../../types";

interface LessonTabsProps {
    activeTab: LessonTabType;
    onTabChange: (tab: LessonTabType) => void;
}

const TABS: LessonTabType[] = ["about", "assignments", "quiz", "materials"];

export function LessonTabs({ activeTab, onTabChange }: LessonTabsProps) {
    const { t } = useTranslation("selfStudy");

    return (
        <div className="flex gap-6 border-b border-gray-200 dark:border-gray-700">
            {TABS.map((tab) => (
                <button
                    key={tab}
                    type="button"
                    onClick={() => onTabChange(tab)}
                    className={`
                        relative pb-3 text-base font-bold transition-colors
                        ${
                            activeTab === tab
                                ? "text-brand-500"
                                : "text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                        }
                    `}
                >
                    {t(`lesson.tabs.${tab}`)}
                    {activeTab === tab && (
                        <div className="absolute bottom-0 left-0 right-0 h-1 bg-brand-500 rounded-full" />
                    )}
                </button>
            ))}
        </div>
    );
}

export default LessonTabs;
