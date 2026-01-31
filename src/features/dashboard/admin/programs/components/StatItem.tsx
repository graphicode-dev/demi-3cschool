interface StatItemProps {
    icon: React.ReactNode;
    value: number;
    label: string;
    iconBgColor: string;
}

export function StatItem({ icon, value, label, iconBgColor }: StatItemProps) {
    return (
        <div className="flex items-center gap-3">
            <div
                className={`flex items-center justify-center w-10 h-10 rounded-lg ${iconBgColor}`}
            >
                {icon}
            </div>
            <div>
                <p className="text-xl font-semibold text-gray-900 dark:text-white">
                    {value}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                    {label}
                </p>
            </div>
        </div>
    );
}
