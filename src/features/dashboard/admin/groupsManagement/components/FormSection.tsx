import type { ReactNode } from "react";

interface FormSectionProps {
    title: string;
    children: ReactNode;
    className?: string;
}

export function FormSection({
    title,
    children,
    className = "",
}: FormSectionProps) {
    return (
        <div
            className={`bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 ${className}`}
        >
            <div className="p-6 md:p-10">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
                    {title}
                </h2>
                {children}
            </div>
        </div>
    );
}

export default FormSection;
