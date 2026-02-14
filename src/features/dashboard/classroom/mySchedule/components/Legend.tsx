interface LegendProps {
    t: (key: string) => string;
}

export function Legend({ t }: LegendProps) {
    return (
        <div className="w-fit mx-auto mt-6 p-4 bg-white dark:bg-gray-900 rounded-3xl shadow-sm flex justify-center gap-8">
            <div className="flex items-center gap-2">
                <div className="size-2.5 rounded-full bg-success-500" />
                <span className="text-sm text-gray-500 dark:text-gray-400">
                    {t("onlineSession")}
                </span>
            </div>
            <div className="flex items-center gap-2">
                <div className="size-2.5 rounded-full bg-brand-500" />
                <span className="text-sm text-gray-500 dark:text-gray-400">
                    {t("offlineCenter")}
                </span>
            </div>
            <div className="flex items-center gap-2">
                <div className="size-2.5 rounded-full bg-error-500" />
                <span className="text-sm text-gray-500 dark:text-gray-400">
                    {t("cancelled")}
                </span>
            </div>
        </div>
    );
}
