/**
 * HighWorkloadAlert Component
 *
 * Displays a warning alert when workload is high.
 * Matches Figma design node 1264:13010
 */

import { useTranslation } from "react-i18next";
import { AlertTriangle } from "lucide-react";

interface HighWorkloadAlertProps {
    isVisible: boolean;
}

export function HighWorkloadAlert({ isVisible }: HighWorkloadAlertProps) {
    const { t } = useTranslation("adminTicketsManagement");

    if (!isVisible) return null;

    return (
        <div className="bg-white dark:bg-gray-800 border-l-4 border-l-[#FFA242] border border-gray-200 dark:border-gray-700 rounded-lg p-4 shadow-[0px_4px_8px_0px_rgba(0,0,0,0.1)]">
            <div className="flex items-start gap-3">
                <div className="shrink-0">
                    <AlertTriangle className="w-5 h-5 text-[#FFA242]" />
                </div>
                <div>
                    <h4 className="text-[14px] font-semibold text-gray-900 dark:text-white">
                        {t("distribution.alert.title", "High Workload Alert")}
                    </h4>
                    <p className="text-[12px] text-[#666] dark:text-gray-400 mt-0.5">
                        {t(
                            "distribution.alert.description",
                            "Some agents are approaching maximum capacity. Consider redistributing tickets or adjusting assignments."
                        )}
                    </p>
                </div>
            </div>
        </div>
    );
}

export default HighWorkloadAlert;
