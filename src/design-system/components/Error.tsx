interface ErrorProps {
    message: string;
    variant?: "inline" | "card" | "banner";
    showIcon?: boolean;
    title?: string;
    helpText?: string;
    onRetry?: () => void;
    onHelp?: () => void;
    showButtons?: boolean;
}

export function ErrorComponent(props: ErrorProps | string) {
    const config: ErrorProps =
        typeof props === "string"
            ? {
                  message: props,
                  variant: "card",
                  showIcon: true,
                  showButtons: true,
              }
            : {
                  message: props.message,
                  variant: props.variant || "card",
                  showIcon: props.showIcon !== false,
                  title: props.title,
                  helpText: props.helpText,
                  onRetry: props.onRetry,
                  onHelp: props.onHelp,
                  showButtons: props.showButtons !== false,
              };

    const {
        message,
        variant,
        showIcon,
        title,
        helpText,
        onRetry,
        onHelp,
        showButtons,
    } = config;

    const ErrorIcon = () => (
        <svg
            className="w-6 h-6 shrink-0"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
        >
            <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
        </svg>
    );

    const InlineVariant = () => (
        <div className="flex justify-center items-center gap-2 text-sm text-error-600 dark:text-error-400">
            {showIcon && <ErrorIcon />}
            <span>{message}</span>
        </div>
    );

    const BannerVariant = () => (
        <div className="bg-error-50 dark:bg-error-500/10 border-l-4 border-error-500 p-4 rounded-xl">
            <div className="flex items-start gap-3">
                {showIcon && (
                    <div className="text-error-500 mt-0.5">
                        <ErrorIcon />
                    </div>
                )}
                <div className="flex-1">
                    {title && (
                        <h4 className="text-sm font-semibold text-error-700 dark:text-error-400 mb-1">
                            {title}
                        </h4>
                    )}
                    <p className="text-sm text-error-600 dark:text-error-300">
                        {message}
                    </p>
                </div>
            </div>
        </div>
    );

    const CardVariant = () => (
        <div className="max-w-md w-full mx-4">
            <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-800 rounded-3xl shadow-xl p-8 transition-all duration-300">
                {/* Header with Icon */}
                <div className="flex flex-col items-center text-center mb-6">
                    {showIcon && (
                        <div className="w-16 h-16 rounded-full bg-error-100 dark:bg-error-500/20 flex items-center justify-center text-error-500 mb-4">
                            <svg
                                className="w-8 h-8"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                />
                            </svg>
                        </div>
                    )}
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                        {title || "Something went wrong"}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                        {message}
                    </p>
                </div>

                {/* Help Text Section */}
                {helpText && (
                    <div className="mb-6 p-4 bg-brand-50 dark:bg-brand-500/10 rounded-xl border border-brand-200 dark:border-brand-500/20">
                        <div className="flex items-start gap-3">
                            <svg
                                className="w-5 h-5 text-brand-500 shrink-0 mt-0.5"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                />
                            </svg>
                            <div className="flex-1">
                                <h4 className="text-sm font-semibold text-brand-700 dark:text-brand-400 mb-1">
                                    How to fix this
                                </h4>
                                <p className="text-sm text-brand-600 dark:text-brand-300 leading-relaxed">
                                    {helpText}
                                </p>
                            </div>
                        </div>
                    </div>
                )}

                {/* Action Buttons */}
                {showButtons && (
                    <div className="flex flex-col sm:flex-row gap-3">
                        {onRetry && (
                            <button
                                onClick={onRetry}
                                className="flex-1 px-5 py-3 bg-brand-500 hover:bg-brand-600 text-white font-medium rounded-xl transition-all duration-200 flex items-center justify-center gap-2 shadow-sm hover:shadow-md"
                            >
                                <svg
                                    className="w-4 h-4"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                                    />
                                </svg>
                                Try Again
                            </button>
                        )}
                        {onHelp && (
                            <button
                                onClick={onHelp}
                                className="flex-1 px-5 py-3 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 font-medium rounded-xl border border-gray-300 dark:border-gray-600 transition-all duration-200 flex items-center justify-center gap-2"
                            >
                                <svg
                                    className="w-4 h-4"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                    />
                                </svg>
                                Get Help
                            </button>
                        )}
                        {!onRetry && !onHelp && (
                            <button
                                onClick={() => window.location.reload()}
                                className="w-full px-5 py-3 bg-brand-500 hover:bg-brand-600 text-white font-medium rounded-xl transition-all duration-200 flex items-center justify-center gap-2 shadow-sm hover:shadow-md"
                            >
                                <svg
                                    className="w-4 h-4"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                                    />
                                </svg>
                                Reload Page
                            </button>
                        )}
                    </div>
                )}

                {/* Additional Info */}
                <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-800">
                    <p className="text-xs text-gray-500 dark:text-gray-500 text-center">
                        If this problem persists, please contact support
                    </p>
                </div>
            </div>
        </div>
    );

    const variantRender = () => {
        switch (variant) {
            case "inline":
                return <InlineVariant />;
            case "banner":
                return <BannerVariant />;
            case "card":
                return <CardVariant />;
            default:
                return <InlineVariant />;
        }
    };

    return (
        <div className="w-full h-screen flex justify-center items-center bg-transparent">
            {variantRender()}
        </div>
    );
}

