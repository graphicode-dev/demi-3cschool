import { useTranslation } from "react-i18next";

import { XCircle, Mail, AlertTriangle } from "lucide-react";
import { PageWrapper } from "@/design-system";

function AcceptanceExamRejectedPage() {
    const { t } = useTranslation("acceptanceTest");

    return (
        <PageWrapper>
            <div className="max-w-2xl h-screen flex justify-center items-center mx-auto px-4">
                <div className="relative w-full bg-linear-to-br from-white via-white to-red-50/30 dark:from-gray-900 dark:via-gray-900 dark:to-red-950/20 rounded-3xl border-2 border-red-200 dark:border-red-900/50 overflow-hidden shadow-xl">
                    {/* Decorative background elements */}
                    <div className="absolute top-0 right-0 w-64 h-64 bg-red-500/5 dark:bg-red-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
                    <div className="absolute bottom-0 left-0 w-48 h-48 bg-red-400/5 dark:bg-red-400/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2"></div>

                    <div className="relative p-8 sm:p-12 text-center">
                        {/* Animated icon container */}
                        <div className="relative inline-block mb-6">
                            <div className="absolute inset-0 bg-red-500/20 dark:bg-red-500/30 rounded-full blur-xl animate-pulse"></div>
                            <div className="relative flex h-24 w-24 items-center justify-center rounded-full bg-linear-to-br from-red-100 to-red-200 dark:from-red-900/40 dark:to-red-800/40 border-4 border-red-200 dark:border-red-700 mx-auto shadow-lg">
                                <XCircle
                                    className="h-12 w-12 text-red-600 dark:text-red-400"
                                    strokeWidth={2.5}
                                />
                            </div>
                        </div>

                        <h1 className="text-3xl sm:text-4xl font-bold bg-linear-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-300 bg-clip-text text-transparent mb-4">
                            {t("rejected.title")}
                        </h1>

                        <p className="text-lg text-gray-600 dark:text-gray-400 mb-8 max-w-md mx-auto">
                            {t("rejected.description")}
                        </p>

                        {/* Main message card with icon */}
                        <div className="relative p-6 rounded-2xl bg-linear-to-br from-red-50 to-red-100/50 dark:from-red-950/30 dark:to-red-900/20 border-2 border-red-200 dark:border-red-800/50 mb-8 shadow-md">
                            <div className="flex items-start gap-4">
                                <div className="shrink-0 mt-1">
                                    <AlertTriangle className="h-6 w-6 text-red-600 dark:text-red-400" />
                                </div>
                                <p className="text-left text-red-800 dark:text-red-300 font-medium leading-relaxed">
                                    {t("rejected.message")}
                                </p>
                            </div>
                        </div>

                        {/* Contact section with enhanced styling */}
                        <div className="inline-flex items-center gap-3 px-6 py-3 rounded-xl bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
                            <Mail className="h-5 w-5 text-gray-500 dark:text-gray-400" />
                            <p className="text-sm text-gray-600 dark:text-gray-400 font-medium">
                                {t("rejected.contact")}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </PageWrapper>
    );
}

export default AcceptanceExamRejectedPage;
