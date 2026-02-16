import { useTranslation } from "react-i18next";
import { Clock, Loader2, CheckCircle, FileSearch } from "lucide-react";

import { PageWrapper } from "@/design-system";

function AcceptanceExamWaitingPage() {
    const { t } = useTranslation("acceptanceTest");

    return (
        <PageWrapper>
            <div className="max-w-xl min-h-[80vh] mx-auto flex justify-center items-center px-4 py-8">
                <div className="relative w-full bg-white dark:bg-gray-900 rounded-3xl border-2 border-amber-200 dark:border-amber-800 overflow-hidden shadow-2xl">
                    {/* Decorative background blobs */}
                    <div className="absolute top-0 right-0 w-72 h-72 bg-amber-400/10 dark:bg-amber-500/10 rounded-full blur-3xl -translate-y-1/3 translate-x-1/3 pointer-events-none" />
                    <div className="absolute bottom-0 left-0 w-56 h-56 bg-yellow-400/10 dark:bg-yellow-400/10 rounded-full blur-3xl translate-y-1/3 -translate-x-1/3 pointer-events-none" />

                    <div className="relative px-8 py-12 sm:px-12 text-center">
                        {/* Animated icon */}
                        <div className="relative inline-block mb-8">
                            <div className="absolute inset-0 bg-amber-400/25 rounded-full blur-2xl animate-pulse" />
                            <div className="relative flex h-28 w-28 items-center justify-center rounded-full bg-amber-100 dark:bg-amber-900/30 border-4 border-amber-300 dark:border-amber-700 mx-auto shadow-lg">
                                <Clock
                                    className="h-14 w-14 text-amber-600 dark:text-amber-400"
                                    strokeWidth={2}
                                />
                            </div>
                        </div>

                        <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-white mb-4">
                            {t("waiting.title")}
                        </h1>

                        <p className="text-lg text-gray-500 dark:text-gray-400 mb-10 max-w-sm mx-auto leading-relaxed">
                            {t("waiting.description")}
                        </p>

                        {/* Processing status card */}
                        <div className="relative p-7 rounded-2xl bg-amber-50/80 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800/50 mb-10 overflow-hidden">
                            {/* Animated shimmer effect */}
                            <div className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-linear-to-r from-transparent via-white/10 to-transparent" />

                            <div className="relative flex items-center justify-center gap-3 mb-6">
                                <Loader2
                                    className="h-6 w-6 text-amber-600 dark:text-amber-400 animate-spin"
                                    strokeWidth={3}
                                />
                                <span className="text-lg font-bold text-amber-800 dark:text-amber-300">
                                    {t("waiting.processing")}
                                </span>
                            </div>

                            {/* Processing steps */}
                            <div className="space-y-4 text-left max-w-xs mx-auto">
                                <div className="flex items-center gap-3">
                                    <CheckCircle className="h-5 w-5 text-green-500 dark:text-green-400 shrink-0" />
                                    <span className="text-base font-medium text-gray-700 dark:text-gray-300">
                                        {t("waiting.examSubmitted")}
                                    </span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className="h-5 w-5 rounded-full border-[2.5px] border-amber-500 border-t-transparent animate-spin shrink-0" />
                                    <span className="text-base font-medium text-gray-700 dark:text-gray-300">
                                        {t("waiting.reviewingAnswers")}
                                    </span>
                                </div>
                                <div className="flex items-center gap-3 opacity-40">
                                    <FileSearch className="h-5 w-5 text-gray-400 shrink-0" />
                                    <span className="text-base text-gray-400 dark:text-gray-500">
                                        {t("waiting.generatingResults")}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Info message */}
                        <div className="inline-flex items-center gap-3 px-6 py-3.5 rounded-2xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
                            <div className="h-2.5 w-2.5 rounded-full bg-amber-500 animate-pulse" />
                            <p className="text-sm font-semibold text-gray-500 dark:text-gray-400">
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
