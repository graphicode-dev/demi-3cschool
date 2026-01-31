import { useTranslation } from "react-i18next";

interface Step {
    id: string;
    labelKey: string;
    label: string;
}

interface StepIndicatorProps {
    steps: Step[];
    currentStep: number;
    onStepClick?: (stepIndex: number) => void;
}

export function StepIndicator({
    steps,
    currentStep,
    onStepClick,
}: StepIndicatorProps) {
    const { t } = useTranslation("groupsManagement");

    return (
        <div className="flex items-center justify-center gap-2 mb-8">
            {steps.map((step, index) => {
                const isActive = index === currentStep;
                const isCompleted = index < currentStep;
                const isClickable = onStepClick && index <= currentStep;

                return (
                    <button
                        key={step.id}
                        type="button"
                        onClick={() => isClickable && onStepClick?.(index)}
                        disabled={!isClickable}
                        className={`
                            w-3 h-3 rounded-full transition-all duration-200
                            ${isActive ? "bg-brand-500 w-8" : ""}
                            ${isCompleted ? "bg-brand-500" : ""}
                            ${!isActive && !isCompleted ? "bg-gray-300 dark:bg-gray-600" : ""}
                            ${isClickable ? "cursor-pointer hover:opacity-80" : "cursor-default"}
                        `}
                        aria-label={t(step.labelKey, step.label)}
                        aria-current={isActive ? "step" : undefined}
                    />
                );
            })}
        </div>
    );
}

export default StepIndicator;
