import { useTranslation } from "react-i18next";
import { Clock, Loader2, CheckCircle, FileSearch } from "lucide-react";

import { PageWrapper } from "@/design-system";

function AcceptanceExamWaitingPage() {
    const { t } = useTranslation("acceptanceTest");

    return (
        <PageWrapper>
            <div className="max-w-2xl h-screen mx-auto flex justify-center items-center px-4">
                <div className="relative w-full bg-linear-to-br from-white via-white to-yellow-50/30 dark:from-gray-900 dark:via-gray-900 dark:to-yellow-950/20 rounded-3xl border-2 border-yellow-200 dark:border-yellow-900/50 overflow-hidden shadow-xl">
                    {/* Decorative background elements */}
                    <div className="absolute top-0 right-0 w-72 h-72 bg-yellow-500/5 dark:bg-yellow-500/10 rounded-full blur-3xl -translate-y-1/3 translate-x-1/3"></div>
                    <div className="absolute bottom-0 left-0 w-56 h-56 bg-amber-400/5 dark:bg-amber-400/10 rounded-full blur-3xl translate-y-1/3 -translate-x-1/3"></div>

                    <div className="relative p-8 sm:p-12 text-center">
                        {/* Animated icon container */}
                        <div className="relative inline-block mb-6">
                            <div className="absolute inset-0 bg-yellow-500/20 dark:bg-yellow-500/30 rounded-full blur-xl animate-pulse"></div>
                            <div className="relative flex h-24 w-24 items-center justify-center rounded-full bg-linear-to-br from-yellow-100 to-amber-200 dark:from-yellow-900/40 dark:to-amber-800/40 border-4 border-yellow-200 dark:border-yellow-700 mx-auto shadow-lg">
                                <Clock
                                    className="h-12 w-12 text-yellow-600 dark:text-yellow-400"
                                    strokeWidth={2.5}
                                />
                            </div>
                        </div>

                        <h1 className="text-3xl sm:text-4xl font-bold bg-linear-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-300 bg-clip-text text-transparent mb-4">
                            {t("waiting.title")}
                        </h1>

                        <p className="text-lg text-gray-600 dark:text-gray-400 mb-8 max-w-md mx-auto">
                            {t("waiting.description")}
                        </p>

                        {/* Processing status card */}
                        <div className="relative p-6 rounded-2xl bg-linear-to-br from-yellow-50 to-amber-100/50 dark:from-yellow-950/30 dark:to-amber-900/20 border-2 border-yellow-200 dark:border-yellow-800/50 mb-8 shadow-md overflow-hidden">
                            {/* Animated shimmer effect */}
                            <div className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-linear-to-r from-transparent via-white/10 to-transparent"></div>

                            <div className="relative flex items-center justify-center gap-3 mb-4">
                                <Loader2
                                    className="h-6 w-6 text-yellow-600 dark:text-yellow-400 animate-spin"
                                    strokeWidth={3}
                                />
                                <span className="text-lg font-semibold text-yellow-800 dark:text-yellow-300">
                                    {t("waiting.processing")}
                                </span>
                            </div>

                            {/* Processing steps */}
                            <div className="space-y-3 text-left max-w-xs mx-auto">
                                <div className="flex items-center gap-3 text-sm">
                                    <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400 shrink-0" />
                                    <span className="text-gray-700 dark:text-gray-300">
                                        Exam submitted successfully
                                    </span>
                                </div>
                                <div className="flex items-center gap-3 text-sm">
                                    <div className="h-4 w-4 rounded-full border-2 border-yellow-500 border-t-transparent animate-spin shrink-0"></div>
                                    <span className="text-gray-700 dark:text-gray-300">
                                        Reviewing answers
                                    </span>
                                </div>
                                <div className="flex items-center gap-3 text-sm opacity-50">
                                    <FileSearch className="h-4 w-4 text-gray-400 shrink-0" />
                                    <span className="text-gray-500 dark:text-gray-400">
                                        Generating results
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Info message */}
                        <div className="inline-flex items-center gap-3 px-6 py-3 rounded-xl bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
                            <div className="h-2 w-2 rounded-full bg-yellow-500 animate-pulse"></div>
                            <p className="text-sm text-gray-600 dark:text-gray-400 font-medium">
                                {t("waiting.checkBack")}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            <style>{`
                @keyframes shimmer {
                    100% {
                        transform: translateX(100%);
                    }
                }
            `}</style>
        </PageWrapper>
    );
}

export default AcceptanceExamWaitingPage;
