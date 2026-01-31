/**
 * Step 5: Pricing Plan Step
 *
 * Select pricing plan: Monthly or Quarterly.
 */

import { memo, useCallback, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { cn } from "@/utils";
import {
    useInvoiceWizardStore,
    selectPricingPlan,
    selectLevel,
} from "../../stores";
import { PricingPlan } from "../../types/store.types";
import { useLevelPricesForLevel, LevelPrice } from "../../../pricelists/api";
import { LoadingState } from "@/design-system";

interface PricingPlanCardProps {
    plan: PricingPlan;
    isSelected: boolean;
    onSelect: (plan: PricingPlan) => void;
}

const PricingPlanCard = memo(function PricingPlanCard({
    plan,
    isSelected,
    onSelect,
}: PricingPlanCardProps) {
    const handleClick = useCallback(() => {
        onSelect(plan);
    }, [plan, onSelect]);

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: "USD",
            minimumFractionDigits: 0,
        }).format(amount);
    };

    return (
        <button
            type="button"
            onClick={handleClick}
            className={cn(
                "flex items-center justify-between p-5 rounded-xl border-2 text-left transition-all w-full",
                isSelected
                    ? "border-brand-500 bg-brand-50/50 dark:bg-brand-950/20"
                    : "border-gray-200 dark:border-gray-700 hover:border-brand-300 hover:bg-gray-50 dark:hover:bg-gray-800/50"
            )}
            aria-pressed={isSelected}
        >
            <div className="flex-1">
                <h3 className="font-semibold text-foreground">{plan.name}</h3>
                <p className="text-sm text-muted-foreground">
                    {plan.description}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                    Up to {plan.installments} installments
                </p>
            </div>
            <div className="text-right">
                {plan.originalPrice !== plan.price && (
                    <p className="text-sm text-gray-400 line-through">
                        {formatCurrency(plan.originalPrice)}
                    </p>
                )}
                <p className="text-2xl font-bold text-foreground">
                    {formatCurrency(plan.price)}
                </p>
            </div>
        </button>
    );
});

export const PricingPlanStep = memo(function PricingPlanStep() {
    const { t } = useTranslation("salesSubscription");

    const selectedPlan = useInvoiceWizardStore(selectPricingPlan);
    const level = useInvoiceWizardStore(selectLevel);
    const setPricingPlan = useInvoiceWizardStore(
        (state) => state.setPricingPlan
    );

    // Fetch pricing plans for the selected level
    const { data: levelPricesData, isLoading } = useLevelPricesForLevel(
        level?.id
    );

    // Map API LevelPrice to store PricingPlan type
    const pricingPlans = useMemo(() => {
        if (!levelPricesData?.items) return [];
        return levelPricesData.items.map(
            (lp: LevelPrice): PricingPlan => ({
                id: String(lp.id),
                name: lp.name,
                description: lp.description,
                price: parseFloat(lp.price),
                originalPrice: parseFloat(lp.originalPrice),
                installments: lp.maxInstallments,
            })
        );
    }, [levelPricesData]);

    const handleSelect = useCallback(
        (plan: PricingPlan) => {
            setPricingPlan(plan);
        },
        [setPricingPlan]
    );

    if (isLoading) return <LoadingState />;

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-xl font-semibold">
                    {t(
                        "purchases.wizard.steps.pricingPlan.title",
                        "Select Pricing Plan"
                    )}
                </h2>
            </div>

            <div className="space-y-3">
                {pricingPlans.map((plan) => (
                    <PricingPlanCard
                        key={plan.id}
                        plan={plan}
                        isSelected={selectedPlan?.id === plan.id}
                        onSelect={handleSelect}
                    />
                ))}
            </div>
        </div>
    );
});

export default PricingPlanStep;
