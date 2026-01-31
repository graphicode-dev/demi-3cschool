/**
 * Step 2: Learning Type Step
 *
 * Select between Standard and Professional learning types.
 */

import React, { memo, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { cn } from "@/utils";
import { useInvoiceWizardStore, selectProgramType } from "../../stores";
import type { ProgramType } from "../../types";

interface LearningTypeCardProps {
    type: ProgramType;
    title: string;
    description: string;
    isSelected: boolean;
    onSelect: (type: ProgramType) => void;
}

const LearningTypeCard = memo(function LearningTypeCard({
    type,
    title,
    description,
    isSelected,
    onSelect,
}: LearningTypeCardProps) {
    const handleClick = useCallback(() => {
        onSelect(type);
    }, [type, onSelect]);

    return (
        <button
            type="button"
            onClick={handleClick}
            className={cn(
                "flex flex-col items-start p-5 rounded-xl border-2 text-left transition-all w-full",
                isSelected
                    ? "border-brand-500 bg-brand-500 text-white"
                    : "border-gray-200 dark:border-gray-700 hover:border-brand-300 hover:bg-gray-50 dark:hover:bg-gray-800/50"
            )}
            aria-pressed={isSelected}
        >
            <h3 className="font-semibold text-sm">{title}</h3>
            <p
                className={cn(
                    "text-xs mt-1",
                    isSelected ? "text-white/80" : "text-muted-foreground"
                )}
            >
                {description}
            </p>
        </button>
    );
});

export const LearningTypeStep = memo(function LearningTypeStep() {
    const { t } = useTranslation("salesSubscription");

    const selectedType = useInvoiceWizardStore(selectProgramType);
    const setProgramType = useInvoiceWizardStore(
        (state) => state.setProgramType
    );

    const handleSelect = useCallback(
        (type: ProgramType) => {
            setProgramType(type);
        },
        [setProgramType]
    );

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-xl font-semibold">
                    {t(
                        "purchases.wizard.steps.learningType.title",
                        "Select Learning Type"
                    )}
                </h2>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <LearningTypeCard
                    type="standard"
                    title={t(
                        "purchases.wizard.programTypes.standard",
                        "Standard Learning"
                    )}
                    description={t(
                        "purchases.wizard.programTypes.standardDesc",
                        "Regular curriculum with foundational concepts"
                    )}
                    isSelected={selectedType === "standard"}
                    onSelect={handleSelect}
                />
                <LearningTypeCard
                    type="professional"
                    title={t(
                        "purchases.wizard.programTypes.professional",
                        "Professional Learning"
                    )}
                    description={t(
                        "purchases.wizard.programTypes.professionalDesc",
                        "Advanced curriculum with industry projects"
                    )}
                    isSelected={selectedType === "professional"}
                    onSelect={handleSelect}
                />
            </div>
        </div>
    );
});

export default LearningTypeStep;
