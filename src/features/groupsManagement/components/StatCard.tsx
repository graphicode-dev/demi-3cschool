import type { ReactNode } from "react";

interface StatCardProps {
    title: string;
    value: number | string;
    icon?: ReactNode;
    variant?: "default" | "primary" | "success" | "warning" | "danger";
}

const variantStyles = {
    default: "border-gray-200 dark:border-gray-700",
    primary: "border-brand-200 dark:border-brand-700",
    success: "border-green-200 dark:border-green-700",
    warning: "border-yellow-200 dark:border-yellow-700",
    danger: "border-red-200 dark:border-red-700",
};

const iconVariantStyles = {
    default: "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400",
    primary:
        "bg-brand-100 text-brand-600 dark:bg-brand-900 dark:text-brand-400",
    success:
        "bg-green-100 text-green-600 dark:bg-green-900 dark:text-green-400",
    warning:
        "bg-yellow-100 text-yellow-600 dark:bg-yellow-900 dark:text-yellow-400",
    danger: "bg-red-100 text-red-600 dark:bg-red-900 dark:text-red-400",
};

export function StatCard({
    title,
    value,
    icon,
    variant = "default",
}: StatCardProps) {
    return (
        <div
            className={`flex items-center gap-4 p-4 bg-white dark:bg-gray-800 rounded-xl border ${variantStyles[variant]}`}
        >
            {icon && (
                <div
                    className={`flex items-center justify-center w-12 h-12 rounded-full ${iconVariantStyles[variant]}`}
                >
                    {icon}
                </div>
            )}
            <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                    {title}
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {value}
                </p>
            </div>
        </div>
    );
}

export default StatCard;
