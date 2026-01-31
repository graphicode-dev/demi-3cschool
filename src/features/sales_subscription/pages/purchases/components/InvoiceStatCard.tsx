/**
 * InvoiceStatCard Component
 *
 * A stat card with icon, value, title, and optional trend indicator.
 * Used in the student purchase page to display statistics.
 */

import type { ReactNode } from "react";

interface InvoiceStatCardProps {
    title: string;
    value: number | string;
    icon: ReactNode;
    trend?: {
        value: number;
        label: string;
    };
    variant?: "purple" | "green" | "orange" | "brand";
}

const variantStyles = {
    purple: {
        bg: "bg-[rgba(108,99,255,0.1)]",
        text: "text-[#6C63FF]",
    },
    green: {
        bg: "bg-[rgba(34,197,94,0.1)]",
        text: "text-[#22C55E]",
    },
    orange: {
        bg: "bg-[rgba(249,115,22,0.1)]",
        text: "text-[#F97316]",
    },
    brand: {
        bg: "bg-[rgba(0,174,237,0.1)]",
        text: "text-brand-500",
    },
};

export function InvoiceStatCard({
    title,
    value,
    icon,
    trend,
    variant = "purple",
}: InvoiceStatCardProps) {
    const styles = variantStyles[variant];

    return (
        <div className="flex items-center gap-4 p-4 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm">
            <div
                className={`flex items-center justify-center w-10 h-10 rounded-lg ${styles.bg}`}
            >
                <div className={styles.text}>{icon}</div>
            </div>
            <div className="flex-1">
                <div className="flex items-center gap-2">
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">
                        {value}
                    </p>
                    {trend && trend.value !== 0 && (
                        <span
                            className={`text-xs font-medium ${
                                trend.value > 0
                                    ? "text-green-500"
                                    : "text-red-500"
                            }`}
                        >
                            {trend.value > 0 ? "+" : ""}
                            {trend.value}% {trend.label}
                        </span>
                    )}
                </div>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                    {title}
                </p>
            </div>
        </div>
    );
}

export default InvoiceStatCard;
