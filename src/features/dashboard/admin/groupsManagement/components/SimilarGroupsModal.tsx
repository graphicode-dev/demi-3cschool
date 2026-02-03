import { useTranslation } from "react-i18next";
import { useEffect } from "react";
import { RecommendedGroupCard } from "./RecommendedGroupCard";

interface RecommendedGroup {
    id: string | number;
    name: string;
    studentsCount: number;
    level: string;
    grade: string;
    status: string;
    days: string;
    times: string;
}

interface SimilarGroupsModalProps {
    isOpen: boolean;
    onClose: () => void;
    groups: RecommendedGroup[];
    matchCount?: number;
    onViewDetails?: (id: string) => void;
}

const CloseIcon = () => (
    <svg
        className="w-5 h-5"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
    >
        <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M6 18L18 6M6 6l12 12"
        />
    </svg>
);

export function SimilarGroupsModal({
    isOpen,
    onClose,
    groups,
    matchCount,
    onViewDetails,
}: SimilarGroupsModalProps) {
    const { t, i18n } = useTranslation("groupsManagement");
    const isRtl = i18n.dir() === "rtl";

    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "";
        }
        return () => {
            document.body.style.overflow = "";
        };
    }, [isOpen]);

    return (
        <>
            <div
                className={`h-screen fixed inset-0 bg-black/50 z-40 transition-opacity duration-300 ${
                    isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
                }`}
                onClick={onClose}
                aria-hidden="true"
            />

            <div
                className={`fixed top-0 ${isRtl ? "left-0" : "right-0"} h-full w-full max-w-md bg-white dark:bg-gray-800 shadow-xl z-50 transform transition-transform duration-300 ease-in-out ${
                    isOpen
                        ? "translate-x-0"
                        : isRtl
                          ? "-translate-x-full"
                          : "translate-x-full"
                }`}
            >
                <div className="flex flex-col h-full">
                    <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
                        <div>
                            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                                {t(
                                    "groups.form.similarGroups.title",
                                    "Similar Groups"
                                )}
                            </h2>
                            {matchCount !== undefined && (
                                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                                    {matchCount}{" "}
                                    {t(
                                        "groups.form.similarGroups.matchYourCriteria",
                                        "groups match your criteria"
                                    )}
                                </p>
                            )}
                        </div>
                        <button
                            type="button"
                            onClick={onClose}
                            className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                            aria-label={t("common.close", "Close")}
                        >
                            <CloseIcon />
                        </button>
                    </div>

                    <div className="flex-1 overflow-y-auto p-6">
                        <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-4">
                            {t(
                                "groups.form.similarGroups.recommendedGroup",
                                "Recommended group"
                            )}
                        </p>
                        <div className="space-y-4">
                            {groups.map((group, index) => (
                                <RecommendedGroupCard
                                    key={group.id}
                                    group={group}
                                    isRecommended={index === 0}
                                    onViewDetails={(id) =>
                                        onViewDetails?.(id)
                                    }
                                />
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default SimilarGroupsModal;
