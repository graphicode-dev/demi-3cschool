/**
 * UnlockOfflineSection Component
 *
 * Shows the locked state for offline sessions with unlock progress.
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
        <div className="flex flex-col items-center justify-center py-12 px-6">
            {/* Lock Icon */}
            <div className="w-20 h-20 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mb-6">
                <Lock className="size-10 text-gray-400" />
            </div>

            {/* Title */}
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                {t("unlockOffline.title")}
            </h3>

            {/* Description */}
            <p className="text-sm text-gray-500 dark:text-gray-400 text-center max-w-sm mb-6">
                {t("unlockOffline.description", {
                    count: remaining,
                })}
            </p>

            {/* Progress Banner */}
            <div className="flex items-center gap-2 px-4 py-3 bg-brand-50 dark:bg-brand-500/10 border border-brand-200 dark:border-brand-500/30 rounded-xl">
                <Monitor className="size-5 text-brand-500" />
                <span className="text-sm text-gray-700 dark:text-gray-300">
                    {t("unlockOffline.keepLearning")}
                    <span className="font-semibold text-warning-500">
                        {" "}
                        {t("unlockOffline.unlockSoon")}
                    </span>
                </span>
            </div>
        </div>
    );
}

export default UnlockOfflineSection;
