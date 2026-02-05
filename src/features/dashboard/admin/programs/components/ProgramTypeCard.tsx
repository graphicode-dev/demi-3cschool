import { Link } from "react-router-dom";

interface ProgramTypeCardProps {
    title: string;
    description: string;
    href: string;
    icon: React.ReactNode;
    iconBg?: string;
    testId?: string;
}

export function ProgramTypeCard({
    title,
    description,
    href,
    icon,
    iconBg = "bg-brand-100 dark:bg-brand-900/30",
    testId,
}: ProgramTypeCardProps) {
    return (
        <div
            data-testid={testId}
            className="group p-6 bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 hover:border-brand-300 dark:hover:border-brand-600 hover:shadow-lg transition-all duration-200"
        >
            <div className="flex items-start justify-between">
                <Link to={href} className="flex items-start gap-4 flex-1">
                    <div
                        className={`w-12 h-12 rounded-xl ${iconBg} flex items-center justify-center shrink-0`}
                    >
                        {icon}
                    </div>
                    <div>
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors">
                            {title}
                        </h3>
                        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                            {description}
                        </p>
                    </div>
                </Link>
            </div>
        </div>
    );
}

export default ProgramTypeCard;
