/**
 * StatCard Component
 *
 * A stat card with icon, value, title, and optional trend indicator.
 * Matches Figma design: icon top-left, trend top-right, value and label below.
 */

import type { ReactNode } from "react";
import { ArrowUp, ArrowDown } from "lucide-react";

interface StatCardProps {
    title: string;
    value: number | string;
    icon: ReactNode;
    trend?: {
        value: number;
        label?: string;
    };
    variant?: "purple" | "green" | "orange" | "blue";
}

const variantStyles = {
    purple: {
        bg: "bg-[rgba(108,99,255,0.1)]",
        text: "text-[#6C63FF]",
    },
    green: {
        bg: "bg-[rgba(43,182,115,0.1)]",
        text: "text-[#2BB673]",
    },
    orange: {
        bg: "bg-[rgba(255,162,66,0.1)]",
        text: "text-[#FFA242]",
    },
    blue: {
        bg: "bg-[rgba(0,174,237,0.1)]",
        text: "text-brand-500",
    },
};

export function StatCard({
    title,
    value,
    icon,
    trend,
    variant = "purple",
}: StatCardProps) {
    const styles = variantStyles[variant];
    const isPositive = trend && trend.value > 0;
    const isNegative = trend && trend.value < 0;

    return (
        <div className="flex flex-col justify-center px-4 py-2 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-[0px_1px_3px_0px_rgba(0,0,0,0.1),0px_1px_2px_0px_rgba(0,0,0,0.1)]">
            {/* Top row: Icon and Trend */}
            <div className="flex items-center justify-between h-[50px]">
                <div
                    className={`flex items-center justify-center w-[30px] h-[30px] rounded-md ${styles.bg}`}
                >
                    <div className={styles.text}>{icon}</div>
                </div>
                {trend && trend.value !== 0 && (
                    <div className="flex items-center gap-1">
                        {isPositive ? (
                            <ArrowUp className="w-4 h-4 text-[#2BB673]" />
                        ) : (
                            <ArrowDown className="w-4 h-4 text-[#EF4444]" />
                        )}
                        <span
                            className={`text-[9px] font-normal ${
                                isPositive ? "text-[#2BB673]" : "text-[#EF4444]"
                            }`}
                        >
                            {isPositive ? "+" : ""}
                            {trend.value} %
                        </span>
                    </div>
                )}
            </div>

            {/* Bottom row: Value and Title */}
            <div className="flex flex-col gap-1 h-[52px] justify-center">
                <p className="text-[23px] font-bold text-gray-900 dark:text-white leading-[23px]">
                    {value}
                </p>
                <p className="text-[9px] text-gray-900 dark:text-gray-400 leading-[13px]">
                    {title}
                </p>
            </div>
        </div>
    );
}

export default StatCard;
