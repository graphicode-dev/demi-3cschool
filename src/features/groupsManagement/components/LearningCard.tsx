import { ChevronRight } from "lucide-react";
import { Link, To } from "react-router-dom";

export const LearningCard = ({
    icon: Icon,
    title,
    description,
    linkText,
    linkColor = "text-brand-600",
    to,
}: {
    icon: any;
    title: string;
    description: string;
    linkText: string;
    linkColor?: string;
    to: string;
}) => {
    return (
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start">
                <div className="text-center flex-1 flex flex-col items-center justify-center gap-2">
                    <div className="flex items-center justify-center h-10 w-10 rounded-lg bg-brand-100 dark:bg-brand-900">
                        <Icon
                            size={20}
                            className="text-brand-600 dark:text-brand-300"
                        />
                    </div>
                    <h4 className="text-lg font-semibold text-gray-900 dark:text-white">
                        {title}
                    </h4>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                        {description}
                    </p>
                </div>

                <div className="w-1/4 flex justify-between items-start mb-4">
                    <Link
                        to={to}
                        className={`text-xs font-semibold ${linkColor} dark:text-brand-400 hover:underline flex items-center gap-1`}
                    >
                        {linkText}
                        <ChevronRight size={14} className="rtl:rotate-180" />
                    </Link>
                </div>
            </div>
        </div>
    );
};
