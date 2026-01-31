/**
 * Step Indicator Component
 *
 * Displays the wizard progress with step circles and a continuous progress bar.
 * The progress bar animates smoothly as user navigates between steps.
 */

import { memo, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { Check } from "lucide-react";
import { cn } from "@/utils";

interface Step {
    key: string;
    labelKey: string;
}

interface StepIndicatorProps {
    steps: Step[];
    currentStep: number;
    completedSteps: number[];
}

const StepCircle = memo(function StepCircle({
    isCompleted,
    isCurrent,
}: {
    isCompleted: boolean;
    isCurrent: boolean;
}) {
    return (
        <div
            className={cn(
                "relative z-10 flex h-8 w-8 items-center justify-center rounded-full text-sm font-medium transition-all duration-300 ease-in-out",
                (isCompleted || isCurrent) && "bg-brand-500 text-white",
                !isCompleted &&
                    !isCurrent &&
                    "bg-gray-200 dark:bg-gray-600 text-gray-500 dark:text-gray-400"
            )}
            aria-current={isCurrent ? "step" : undefined}
        >
            <Check className="h-4 w-4" aria-hidden="true" />
        </div>
    );
});

export const StepIndicator = memo(function StepIndicator({
    steps,
    currentStep,
    completedSteps,
}: StepIndicatorProps) {
    const { t } = useTranslation("salesSubscription");

    const progressPercentage = useMemo(() => {
        const totalSteps = steps.length;
        if (totalSteps <= 1) return 0;
        const completedSegments = Math.max(0, currentStep - 1);
        const totalSegments = totalSteps - 1;
        return (completedSegments / totalSegments) * 100;
    }, [currentStep, steps.length]);

    return (
        <nav aria-label="Progress" className="w-full px-4">
            <div className="relative">
                <div
                    className="absolute top-4 h-0.5 -translate-y-1/2"
                    style={{
                        left: `calc(100% / ${steps.length} / 2)`,
                        right: `calc(100% / ${steps.length} / 2)`,
                    }}
                >
                    <div className="absolute inset-0 bg-gray-200 dark:bg-gray-600" />
                    <div
                        className="absolute inset-y-0 left-0 bg-brand-500 transition-all duration-500 ease-in-out"
                        style={{ width: `${progressPercentage}%` }}
                    />
                </div>

                <ol className="relative flex items-start justify-between">
                    {steps.map((step, index) => {
                        const stepNumber = index + 1;
                        const isCompleted = completedSteps.includes(stepNumber);
                        const isCurrent = currentStep === stepNumber;

                        return (
                            <li
                                key={step.key}
                                className="flex flex-col items-center"
                                style={{ width: `${100 / steps.length}%` }}
                            >
                                <StepCircle
                                    isCompleted={isCompleted}
                                    isCurrent={isCurrent}
                                />
                                <span
                                    className={cn(
                                        "mt-2 text-xs font-medium whitespace-nowrap text-center",
                                        isCurrent || isCompleted
                                            ? "text-foreground"
                                            : "text-muted-foreground"
                                    )}
                                >
                                    {t(step.labelKey)}
                                </span>
                            </li>
                        );
                    })}
                </ol>
            </div>
        </nav>
    );
});

export default StepIndicator;
