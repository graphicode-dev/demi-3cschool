/**
 * ProgressStepper Component
 *
 * Shows the ticket lifecycle progress (In Progress -> Resolved -> Closed).
 */

import { useTranslation } from "react-i18next";
import { Loader2, CheckCircle, Package } from "lucide-react";

export function ProgressStepper() {
    const { t } = useTranslation("supportHelp");

    const steps = [
        {
            id: "in_progress",
            label: t("supportHelp.progress.inProgress", "In Progress"),
            description: t(
                "supportHelp.progress.inProgressDesc",
                "We are working on it"
            ),
            icon: <Loader2 className="w-4 h-4" />,
            bgColor: "bg-amber-100",
            iconColor: "text-amber-500",
        },
        {
            id: "resolved",
            label: t("supportHelp.progress.resolved", "Resolved"),
            description: t(
                "supportHelp.progress.resolvedDesc",
                "Your problem is fixed"
            ),
            icon: <CheckCircle className="w-4 h-4" />,
            bgColor: "bg-green-100",
            iconColor: "text-green-500",
        },
        {
            id: "closed",
            label: t("supportHelp.progress.closed", "Closed"),
            description: t(
                "supportHelp.progress.closedDesc",
                "The ticket is finished"
            ),
            icon: <Package className="w-4 h-4" />,
            bgColor: "bg-brand-100",
            iconColor: "text-brand-500",
        },
    ];

    return (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4">
            <div className="flex items-center justify-between relative">
                {/* Progress line */}
                <div className="absolute top-[20px] left-[15%] right-[15%] h-0.5 bg-gray-200 dark:bg-gray-700 z-0" />

                {steps.map((step, index) => (
                    <div
                        key={step.id}
                        className="flex flex-col items-center gap-1 z-10"
                    >
                        <div
                            className={`w-10 h-10 rounded-full ${step.bgColor} flex items-center justify-center ${step.iconColor}`}
                        >
                            {step.icon}
                        </div>
                        <div className="text-center">
                            <p className="font-medium text-gray-900 dark:text-white text-sm">
                                {step.label}
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                                {step.description}
                            </p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default ProgressStepper;
