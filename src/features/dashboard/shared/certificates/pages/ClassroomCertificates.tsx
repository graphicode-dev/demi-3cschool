import { useMemo, useCallback, useState } from "react";
import { useTranslation } from "react-i18next";
import { Download, Award, Calendar, BookOpen, Loader2 } from "lucide-react";
import { PageWrapper, useToast } from "@/design-system";
import { authStore } from "@/auth";
import { useCertificatesList } from "../api";
import type { Certificate, CertificateStatus } from "../types";
import { generateAndDownloadCertificate } from "../utils/generateCertificate";

const getStatusConfig = (status: CertificateStatus) => {
    switch (status) {
        case "passed":
            return {
                label: "Passed",
                bg: "bg-green-50 dark:bg-green-900/20",
                text: "text-green-600 dark:text-green-400",
                border: "border-green-200 dark:border-green-800",
                badge: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
            };
        case "failed":
            return {
                label: "Failed",
                bg: "bg-red-50 dark:bg-red-900/20",
                text: "text-red-600 dark:text-red-400",
                border: "border-red-200 dark:border-red-800",
                badge: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
            };
        case "pending":
            return {
                label: "Pending",
                bg: "bg-orange-50 dark:bg-orange-900/20",
                text: "text-orange-600 dark:text-orange-400",
                border: "border-orange-200 dark:border-orange-800",
                badge: "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400",
            };
        default:
            return {
                label: status,
                bg: "bg-gray-50 dark:bg-gray-900/20",
                text: "text-gray-600 dark:text-gray-400",
                border: "border-gray-200 dark:border-gray-800",
                badge: "bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400",
            };
    }
};

function ClassroomCertificatesPage() {
    const { t } = useTranslation("shared");
    const { addToast } = useToast();
    const user = authStore((state) => state.user);
    const [downloadingId, setDownloadingId] = useState<string | null>(null);

    const { data: certificates, isLoading, isError } = useCertificatesList({});

    const passedCertificates = useMemo(
        () => certificates?.filter((c) => c.finalQuizStatus === "passed") ?? [],
        [certificates]
    );

    const pendingCertificates = useMemo(
        () => certificates?.filter((c) => c.finalQuizStatus !== "passed") ?? [],
        [certificates]
    );

    const handleDownload = useCallback(
        async (certificate: Certificate) => {
            const studentName = user?.name || certificate.studentName;
            setDownloadingId(certificate.id);
            try {
                await generateAndDownloadCertificate(studentName);
                addToast({
                    type: "success",
                    message: t(
                        "certificates.messages.downloadSuccess",
                        "Certificate downloaded successfully"
                    ),
                });
            } catch {
                addToast({
                    type: "error",
                    message: t(
                        "certificates.messages.downloadFailed",
                        "Failed to download certificate. Please try again."
                    ),
                });
            } finally {
                setDownloadingId(null);
            }
        },
        [user?.name, addToast, t]
    );

    if (isLoading) {
        return (
            <PageWrapper
                pageHeaderProps={{
                    title: t("certificates.title", "My Certificates"),
                }}
            >
                <div className="flex items-center justify-center py-20">
                    <Loader2 className="w-8 h-8 text-brand-500 animate-spin" />
                </div>
            </PageWrapper>
        );
    }

    if (isError) {
        return (
            <PageWrapper
                pageHeaderProps={{
                    title: t("certificates.title", "My Certificates"),
                }}
            >
                <div className="text-center py-20 text-gray-500 dark:text-gray-400">
                    {t(
                        "certificates.errors.loadFailed",
                        "Failed to load certificates"
                    )}
                </div>
            </PageWrapper>
        );
    }

    const noCertificates = !certificates || certificates.length === 0;

    return (
        <PageWrapper
            pageHeaderProps={{
                title: t("certificates.title", "My Certificates"),
                subtitle: t(
                    "certificates.classroomSubtitle",
                    "View and download your earned certificates"
                ),
            }}
        >
            {/* Summary Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
                <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-5 flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-brand-50 dark:bg-brand-900/20 flex items-center justify-center">
                        <Award className="w-6 h-6 text-brand-500" />
                    </div>
                    <div>
                        <p className="text-2xl font-bold text-gray-900 dark:text-white">
                            {certificates?.length ?? 0}
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                            {t("certificates.stats.total", "Total")}
                        </p>
                    </div>
                </div>
                <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-5 flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-green-50 dark:bg-green-900/20 flex items-center justify-center">
                        <Award className="w-6 h-6 text-green-500" />
                    </div>
                    <div>
                        <p className="text-2xl font-bold text-gray-900 dark:text-white">
                            {passedCertificates.length}
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                            {t("certificates.stats.earned", "Earned")}
                        </p>
                    </div>
                </div>
                <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-5 flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-orange-50 dark:bg-orange-900/20 flex items-center justify-center">
                        <Award className="w-6 h-6 text-orange-500" />
                    </div>
                    <div>
                        <p className="text-2xl font-bold text-gray-900 dark:text-white">
                            {pendingCertificates.length}
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                            {t("certificates.stats.pending", "In Progress")}
                        </p>
                    </div>
                </div>
            </div>

            {noCertificates ? (
                <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-12 text-center">
                    <Award className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                        {t("certificates.empty.title", "No Certificates Yet")}
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400 max-w-md mx-auto">
                        {t(
                            "certificates.empty.description",
                            "Complete your courses and pass the final quiz to earn your certificates."
                        )}
                    </p>
                </div>
            ) : (
                <>
                    {/* Earned Certificates */}
                    {passedCertificates.length > 0 && (
                        <div className="mb-8">
                            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                                {t(
                                    "certificates.sections.earned",
                                    "Earned Certificates"
                                )}
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                                {passedCertificates.map((cert) => {
                                    const status = getStatusConfig(
                                        cert.finalQuizStatus
                                    );
                                    const isDownloading =
                                        downloadingId === cert.id;
                                    return (
                                        <div
                                            key={cert.id}
                                            className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-lg transition-shadow"
                                        >
                                            {/* Certificate Preview */}
                                            <div className="relative bg-linear-to-br from-cyan-400 to-blue-500 p-6 flex items-center justify-center min-h-[160px]">
                                                <div className="text-center">
                                                    <Award className="w-12 h-12 text-white/90 mx-auto mb-2" />
                                                    <p className="text-white font-bold text-lg">
                                                        {t(
                                                            "certificates.card.completion",
                                                            "Certificate of Completion"
                                                        )}
                                                    </p>
                                                    <p className="text-white/80 text-sm mt-1">
                                                        {user?.name ||
                                                            cert.studentName}
                                                    </p>
                                                </div>
                                                <span
                                                    className={`absolute top-3 right-3 px-2.5 py-1 text-xs font-semibold rounded-full ${status.badge}`}
                                                >
                                                    {t(
                                                        `certificates.status.${cert.finalQuizStatus}`,
                                                        status.label
                                                    )}
                                                </span>
                                            </div>

                                            {/* Card Body */}
                                            <div className="p-5">
                                                <h3 className="font-semibold text-gray-900 dark:text-white mb-3 text-base">
                                                    {cert.levelName}
                                                </h3>
                                                <div className="space-y-2 mb-4">
                                                    <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                                                        <BookOpen className="w-4 h-4 shrink-0" />
                                                        <span>
                                                            {cert.program}
                                                        </span>
                                                    </div>
                                                    <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                                                        <Calendar className="w-4 h-4 shrink-0" />
                                                        <span>
                                                            {
                                                                cert.certificateDate
                                                            }
                                                        </span>
                                                    </div>
                                                </div>
                                                <button
                                                    onClick={() =>
                                                        handleDownload(cert)
                                                    }
                                                    disabled={isDownloading}
                                                    className="w-full flex items-center justify-center gap-2 bg-brand-500 hover:bg-brand-600 disabled:opacity-60 disabled:cursor-not-allowed text-white font-semibold py-2.5 px-4 rounded-xl transition-colors text-sm"
                                                >
                                                    {isDownloading ? (
                                                        <Loader2 className="w-4 h-4 animate-spin" />
                                                    ) : (
                                                        <Download className="w-4 h-4" />
                                                    )}
                                                    {isDownloading
                                                        ? t(
                                                              "certificates.actions.downloading",
                                                              "Generating..."
                                                          )
                                                        : t(
                                                              "certificates.actions.download",
                                                              "Download Certificate"
                                                          )}
                                                </button>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    )}

                    {/* Pending / In-Progress Certificates */}
                    {pendingCertificates.length > 0 && (
                        <div>
                            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                                {t(
                                    "certificates.sections.inProgress",
                                    "In Progress"
                                )}
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                                {pendingCertificates.map((cert) => {
                                    const status = getStatusConfig(
                                        cert.finalQuizStatus
                                    );
                                    return (
                                        <div
                                            key={cert.id}
                                            className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden opacity-75"
                                        >
                                            {/* Muted Preview */}
                                            <div className="relative bg-linear-to-br from-gray-300 to-gray-400 dark:from-gray-700 dark:to-gray-600 p-6 flex items-center justify-center min-h-[160px]">
                                                <div className="text-center">
                                                    <Award className="w-12 h-12 text-white/60 mx-auto mb-2" />
                                                    <p className="text-white/80 font-bold text-lg">
                                                        {t(
                                                            "certificates.card.completion",
                                                            "Certificate of Completion"
                                                        )}
                                                    </p>
                                                </div>
                                                <span
                                                    className={`absolute top-3 right-3 px-2.5 py-1 text-xs font-semibold rounded-full ${status.badge}`}
                                                >
                                                    {t(
                                                        `certificates.status.${cert.finalQuizStatus}`,
                                                        status.label
                                                    )}
                                                </span>
                                            </div>

                                            {/* Card Body */}
                                            <div className="p-5">
                                                <h3 className="font-semibold text-gray-900 dark:text-white mb-3 text-base">
                                                    {cert.levelName}
                                                </h3>
                                                <div className="space-y-2 mb-4">
                                                    <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                                                        <BookOpen className="w-4 h-4 shrink-0" />
                                                        <span>
                                                            {cert.program}
                                                        </span>
                                                    </div>
                                                    <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                                                        <Calendar className="w-4 h-4 shrink-0" />
                                                        <span>
                                                            {
                                                                cert.certificateDate
                                                            }
                                                        </span>
                                                    </div>
                                                </div>
                                                <div className="w-full text-center text-sm font-medium text-gray-400 dark:text-gray-500 py-2.5">
                                                    {t(
                                                        "certificates.card.notAvailable",
                                                        "Pass the final quiz to unlock"
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    )}
                </>
            )}
        </PageWrapper>
    );
}

export default ClassroomCertificatesPage;
