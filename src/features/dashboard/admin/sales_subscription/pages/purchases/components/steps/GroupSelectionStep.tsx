/**
 * Step 4: Group Selection Step
 *
 * Select group type: Regular, Semi-Private, or Private.
 */

import React, { memo, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { cn } from "@/utils";
import { useInvoiceWizardStore, selectGroupType } from "../../stores";
import type { GroupType } from "../../types";

interface GroupTypeCardProps {
    type: GroupType;
    title: string;
    subtitle: string;
    isSelected: boolean;
    onSelect: (type: GroupType) => void;
}

const GroupTypeCard = memo(function GroupTypeCard({
    type,
    title,
    subtitle,
    isSelected,
    onSelect,
}: GroupTypeCardProps) {
    const handleClick = useCallback(() => {
        onSelect(type);
    }, [type, onSelect]);

    return (
        <button
            type="button"
            onClick={handleClick}
            className={cn(
                "flex flex-col items-center justify-center p-5 rounded-xl border-2 text-center transition-all min-h-24",
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
                {subtitle}
            </p>
        </button>
    );
});

export const GroupSelectionStep = memo(function GroupSelectionStep() {
    const { t } = useTranslation("salesSubscription");

    const selectedType = useInvoiceWizardStore(selectGroupType);
    const setGroupType = useInvoiceWizardStore((state) => state.setGroupType);

    const handleSelect = useCallback(
        (type: GroupType) => {
            setGroupType(type);
        },
        [setGroupType]
    );

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-xl font-semibold">
                    {t(
                        "purchases.wizard.steps.groupSelection.title",
                        "Select Group Type"
                    )}
                </h2>
            </div>

            <div className="grid grid-cols-3 gap-4">
                <GroupTypeCard
                    type="regular"
                    title={t("purchases.wizard.groupTypes.regular", "Regular")}
                    subtitle={t(
                        "purchases.wizard.groupTypes.regularDesc",
                        "Up to 15 students"
                    )}
                    isSelected={selectedType === "regular"}
                    onSelect={handleSelect}
                />
                <GroupTypeCard
                    type="semi_private"
                    title={t(
                        "purchases.wizard.groupTypes.semiPrivate",
                        "Semi Private"
                    )}
                    subtitle={t(
                        "purchases.wizard.groupTypes.semiPrivateDesc",
                        "3-5 students"
                    )}
                    isSelected={selectedType === "semi_private"}
                    onSelect={handleSelect}
                />
                <GroupTypeCard
                    type="private"
                    title={t("purchases.wizard.groupTypes.private", "Private")}
                    subtitle={t(
                        "purchases.wizard.groupTypes.privateDesc",
                        "1-2 students"
                    )}
                    isSelected={selectedType === "private"}
                    onSelect={handleSelect}
                />
            </div>
        </div>
    );
});

export default GroupSelectionStep;
