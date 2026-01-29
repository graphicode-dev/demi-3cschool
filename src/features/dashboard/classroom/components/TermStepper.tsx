import { useTranslation } from "react-i18next";
import { Check, Lock } from "lucide-react";

export type TermStatus = "completed" | "current" | "locked";

export interface Term {
    id: number;
    name: string;
    order: number;
    status: TermStatus;
}

interface TermStepperProps {
    terms: Term[];
    selectedTermId: number;
    onTermSelect: (termId: number) => void;
    translationNamespace?: string;
}

export function TermStepper({
    terms,
    selectedTermId,
    onTermSelect,
    translationNamespace = "selfStudy",
}: TermStepperProps) {
    const { t } = useTranslation(translationNamespace);

    const sortedTerms = [...terms].sort((a, b) => a.order - b.order);

    const handleTermClick = (term: Term) => {
        if (term.status === "completed" || term.status === "current") {
            onTermSelect(term.id);
        }
    };

    return (
        <div className="relative flex items-center justify-center gap-4 bg-white dark:bg-gray-900 rounded-xl shadow-theme-sm p-4">
            {sortedTerms.map((term, index) => {
                const isCompleted = term.status === "completed";
                const isCurrent = term.status === "current";
                const isLocked = term.status === "locked";
                const isLast = index === sortedTerms.length - 1;
                const isSelected = term.id === selectedTermId;
                const isClickable = isCompleted || isCurrent;

                return (
                    <div key={term.id} className="flex items-center">
                        <button
                            type="button"
                            onClick={() => handleTermClick(term)}
                            disabled={isLocked}
                            className={`
                                flex flex-col items-center gap-2
                                ${isClickable ? "cursor-pointer" : "cursor-not-allowed"}
                            `}
                        >
                            {/* Circle */}
                            <div
                                className={`
                                    flex items-center justify-center size-12 rounded-full transition-all
                                    ${isCompleted ? "bg-success-500" : ""}
                                    ${isCurrent ? "bg-white dark:bg-gray-800 border-[3px] border-brand-500" : ""}
                                    ${isLocked ? "bg-gray-200 dark:bg-gray-700 shadow-theme-xs" : ""}
                                    ${isSelected && isClickable ? "ring-2 ring-offset-2 ring-brand-500 dark:ring-offset-gray-900" : ""}
                                `}
                            >
                                {isCompleted && (
                                    <Check
                                        className="size-6 text-white"
                                        strokeWidth={3}
                                    />
                                )}
                                {isCurrent && (
                                    <span className="text-lg font-bold text-brand-500">
                                        {term.order}
                                    </span>
                                )}
                                {isLocked && (
                                    <Lock className="size-4 text-gray-500 dark:text-gray-400" />
                                )}
                            </div>

                            {/* Label */}
                            <span
                                className={`
                                    text-sm font-medium tracking-wide text-center
                                    ${isCompleted ? "text-success-500" : ""}
                                    ${isCurrent ? "text-brand-500" : ""}
                                    ${isLocked ? "text-gray-500 dark:text-gray-400" : ""}
                                `}
                            >
                                {t(`terms.${term.name}`)}
                            </span>
                        </button>

                        {/* Progress Line */}
                        {!isLast && (
                            <div className="w-24 h-1 mx-2 -mt-6">
                                <div
                                    className={`
                                        h-full rounded-full
                                        ${isCompleted ? "bg-success-500" : "bg-gray-300 dark:bg-gray-600"}
                                    `}
                                />
                            </div>
                        )}
                    </div>
                );
            })}
        </div>
    );
}

export default TermStepper;
