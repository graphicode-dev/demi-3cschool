/**
 * UnlockOfflineSection Component
 *
 * Shows the locked state for offline sessions with unlock progress.
 * Matches the Figma design with lock icon, title, description, and progress banner.
 */

import { useTranslation } from "react-i18next";
import { Lock, Monitor } from "lucide-react";

interface UnlockOfflineSectionProps {
    completedSessions: number;
    requiredSessions: number;
}

export function UnlockOfflineSection({
    completedSessions,
    requiredSessions,
}: UnlockOfflineSectionProps) {
    const { t } = useTranslation("enrollmentsGroup");
    const remaining = requiredSessions - completedSessions;

    return (
        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-700 p-8">
            <div className="flex flex-col items-center justify-center py-8">
                {/* Lock Icon */}
                <div className="w-24 h-24 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mb-6">
                    <Lock className="size-12 text-gray-400" />
                </div>

                {/* Title */}
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                    {t("unlockOffline.title", "Unlock Offline Sessions")}
                </h3>

                {/* Description */}
                <p className="text-sm text-gray-500 dark:text-gray-400 text-center max-w-md mb-8">
                    {t("unlockOffline.description", {
                        count: remaining,
                        defaultValue: `Offline sessions will be available after you complete your first ${remaining} online classes.`,
                    })}
                </p>

                {/* Progress Banner */}
                <div className="flex items-center gap-2 px-5 py-3 bg-brand-50 dark:bg-brand-500/10 border border-brand-200 dark:border-brand-500/30 rounded-xl">
                    <Monitor className="size-5 text-brand-500" />
                    <span className="text-sm text-gray-700 dark:text-gray-300">
                        {t(
                            "unlockOffline.keepLearning",
                            "Keep learning online —"
                        )}
                        <span className="font-semibold text-warning-500">
                            {" "}
                            {t(
                                "unlockOffline.unlockSoon",
                                "your offline session will unlock soon!"
                            )}
                        </span>
                    </span>
                </div>
            </div>
        </div>
    );
}

export default UnlockOfflineSection;
