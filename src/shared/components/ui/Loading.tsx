export const Loading = ({
    message,
    size = "default",
    fullScreen = true,
}: {
    message?: string;
    size?: "small" | "default" | "large";
    fullScreen?: boolean;
}) => {
    const sizeClasses = {
        small: "h-6 w-6 border-2",
        default: "h-12 w-12 border-3",
        large: "h-16 w-16 border-4",
    };

    return (
        <div
            className={`flex items-center justify-center ${
                fullScreen ? "h-screen" : "h-full min-h-[200px]"
            }`}
        >
            <div className="flex flex-col items-center gap-4">
                <div className="relative">
                    <div
                        className={`animate-spin rounded-full ${sizeClasses[size]} border-brand-200 dark:border-gray-700`}
                    />
                    <div
                        className={`absolute inset-0 animate-spin rounded-full ${sizeClasses[size]} border-transparent border-t-brand-500`}
                    />
                </div>

                {message && (
                    <p className="text-sm text-gray-600 dark:text-gray-400 animate-pulse">
                        {message}
                    </p>
                )}
            </div>
        </div>
    );
};
