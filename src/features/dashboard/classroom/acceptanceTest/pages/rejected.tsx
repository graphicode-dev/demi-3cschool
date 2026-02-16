import { useTranslation } from "react-i18next";

import { XCircle, Mail, AlertTriangle } from "lucide-react";
import { PageWrapper } from "@/design-system";

function AcceptanceExamRejectedPage() {
    const { t } = useTranslation("acceptanceTest");

    return (
        <PageWrapper>
            <div className="max-w-xl min-h-[80vh] flex justify-center items-center mx-auto px-4 py-8">
                <div className="relative w-full bg-white dark:bg-gray-900 rounded-3xl border-2 border-red-200 dark:border-red-800 overflow-hidden shadow-2xl">
                    {/* Decorative background blobs */}
                    <div className="absolute top-0 right-0 w-64 h-64 bg-red-400/10 dark:bg-red-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />
                    <div className="absolute bottom-0 left-0 w-48 h-48 bg-rose-400/10 dark:bg-rose-400/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2 pointer-events-none" />

                    <div className="relative px-8 py-12 sm:px-12 text-center">
                        {/* Icon */}
                        <div className="relative inline-block mb-8">
                            <div className="absolute inset-0 bg-red-400/20 rounded-full blur-2xl" />
                            <div className="relative flex h-28 w-28 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/30 border-4 border-red-200 dark:border-red-700 mx-auto shadow-lg">
                                <XCircle
                                    className="h-14 w-14 text-red-500 dark:text-red-400"
                                    strokeWidth={2}
                                />
                            </div>
                        </div>

                        <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-white mb-4">
                            {t("rejected.title")}
                        </h1>

                        <p className="text-lg text-gray-500 dark:text-gray-400 mb-10 max-w-sm mx-auto leading-relaxed">
                            {t("rejected.description")}
                        </p>

                        {/* Main message card */}
                        <div className="relative p-6 rounded-2xl bg-red-50/80 dark:bg-red-950/20 border border-red-200 dark:border-red-800/50 mb-10">
                            <div className="flex items-start gap-4">
                                <div className="shrink-0 mt-0.5">
                                    <AlertTriangle className="h-6 w-6 text-red-500 dark:text-red-400" />
                                </div>
                                <p className="text-left text-base text-red-700 dark:text-red-300 font-medium leading-relaxed">
                                    {t("rejected.message")}
                                </p>
                            </div>
                        </div>

                        {/* Contact section */}
                        <div className="inline-flex items-center gap-3 px-6 py-3.5 rounded-2xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
                            <Mail className="h-5 w-5 text-gray-400 dark:text-gray-500" />
                            <p className="text-sm font-semibold text-gray-500 dark:text-gray-400">
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
