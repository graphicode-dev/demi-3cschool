/**
 * ProgramTypeBadge Component
 *
 * Displays program type as a colored badge.
 * Standard = Cyan, Professional = Orange
 */

import { memo } from "react";
import { useTranslation } from "react-i18next";
import type { ProgramType } from "../types";

interface ProgramTypeBadgeProps {
    type: ProgramType;
}

const typeStyles: Record<ProgramType, string> = {
    standard:
        "bg-brand-100 text-brand-700 dark:bg-brand-900/30 dark:text-brand-400",
    professional:
        "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400",
};

export const ProgramTypeBadge = memo(function ProgramTypeBadge({
    type,
}: ProgramTypeBadgeProps) {
    const { t } = useTranslation("salesSubscription");

    const label =
        type === "standard"
            ? t("purchases.programType.standard", "Standard")
            : t("purchases.programType.professional", "Professional");

    return (
        <span
            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${typeStyles[type]}`}
        >
            {label}
        </span>
    );
});

export default ProgramTypeBadge;
