import { useState, useMemo, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { Filter, User, Download, Send } from "lucide-react";
import { PageWrapper, DynamicTable, useToast } from "@/design-system";
import type { TableColumn, TableData } from "@/shared/types";
import { useCertificatesList } from "../api";
import type { Certificate, CertificateStatus } from "../types";

const getStatusBadgeClass = (status: CertificateStatus) => {
    switch (status) {
        case "passed":
            return "bg-green-100 text-green-600 dark:bg-green-900/20 dark:text-green-400";
        case "failed":
            return "bg-red-100 text-red-600 dark:bg-red-900/20 dark:text-red-400";
        case "pending":
            return "bg-orange-100 text-orange-600 dark:bg-orange-900/20 dark:text-orange-400";
        default:
            return "bg-gray-100 text-gray-600 dark:bg-gray-900/20 dark:text-gray-400";
    }
};

const transformCertificateToTableData = (
    certificate: Certificate
): TableData => ({
    id: certificate.id,
    avatar: "",
    columns: {
        id: certificate.id,
        studentId: certificate.studentId,
        student: certificate.studentName,
        program: certificate.program,
        levelName: certificate.levelName,
        finalQuizStatus: certificate.finalQuizStatus,
        statusRaw: certificate.finalQuizStatus,
        certificateDate: certificate.certificateDate,
    },
});

function CertificatesPage() {
    const { t } = useTranslation("shared");
    const { addToast } = useToast();
    const navigate = useNavigate();
    const [currentPage, setCurrentPage] = useState(1);

    const {
        data: certificates,
        isLoading,
        isError,
    } = useCertificatesList({
        page: currentPage,
    });

    const paginationInfo = certificates
        ? {
              currentPage: 1,
              lastPage: 1,
              perPage: 10,
          }
        : null;

    const tableData: TableData[] = useMemo(
        () => certificates?.map(transformCertificateToTableData) || [],
        [certificates]
    );

    const getStatusLabel = (status: CertificateStatus) => {
        switch (status) {
            case "passed":
                return t("certificates.status.passed", "Passed");
            case "failed":
                return t("certificates.status.failed", "Failed");
            case "pending":
                return t("certificates.status.pending", "Pending");
            default:
                return status;
        }
    };

    const handlePageChange = useCallback((page: number) => {
        setCurrentPage(page);
    }, []);

    const handleDownloadCertificate = useCallback(
        (certificateId: string, studentName: string, levelName: string) => {
            const certificate = certificates?.find(
                (c) => c.id === certificateId
            );
            if (!certificate) return;

            const content = `
                CERTIFICATE OF COMPLETION
                
                This is to certify that
                ${studentName}
                
                has successfully completed
                ${levelName}
                
                Program: ${certificate.program}
                Date: ${certificate.certificateDate}
                Certificate ID: ${certificateId}
            `;

            const blob = new Blob([content], { type: "text/plain" });
            const url = URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.href = url;
            link.download = `certificate-${studentName.replace(/\s+/g, "-")}-${certificateId}.txt`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(url);

            addToast({
                type: "success",
                message: t(
                    "certificates.messages.downloadSuccess",
                    "Certificate downloaded successfully"
                ),
            });
        },
        [certificates, t, addToast]
    );

    const handleSendCertificate = useCallback(
        (certificateId: string, studentName: string) => {
            addToast({
                type: "success",
                message: t(
                    "certificates.messages.sendSuccess",
                    "Certificate sent to {{studentName}} successfully",
                    { studentName }
                ),
            });
        },
        [t, addToast]
    );

    const handleViewStudent = useCallback(
        (studentId: string) => {
            navigate(`/students/${studentId}`);
        },
        [navigate]
    );

    const columns: TableColumn[] = useMemo(
        () => [
            {
                id: "id",
                header: t("certificates.table.id", "ID"),
                accessorKey: "id",
                sortable: true,
            },
            {
                id: "student",
                header: t("certificates.table.student", "Student"),
                accessorKey: "student",
                sortable: true,
            },
            {
                id: "program",
                header: t("certificates.table.program", "Program"),
                accessorKey: "program",
                sortable: true,
            },
            {
                id: "levelName",
                header: t("certificates.table.levelName", "Level Name"),
                accessorKey: "levelName",
                sortable: true,
            },
            {
                id: "finalQuizStatus",
                header: t(
                    "certificates.table.finalQuizStatus",
                    "Final Quiz Status"
                ),
                accessorKey: "finalQuizStatus",
                sortable: true,
                cell: ({ row }) => (
                    <span
                        className={`inline-flex px-2.5 py-1 text-xs font-medium rounded-full ${getStatusBadgeClass(
                            row.columns.statusRaw as CertificateStatus
                        )}`}
                    >
                        {getStatusLabel(
                            row.columns.statusRaw as CertificateStatus
                        )}
                    </span>
                ),
            },
            {
                id: "certificateDate",
                header: t(
                    "certificates.table.certificateDate",
                    "Certificate Date"
                ),
                accessorKey: "certificateDate",
                sortable: true,
            },
            {
                id: "action",
                header: t("certificates.table.action", "Action"),
                accessorKey: "action",
                sortable: false,
                cell: ({ row }) => (
                    <div className="flex items-center gap-2">
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                handleViewStudent(
                                    row.columns.studentId as string
                                );
                            }}
                            className="p-1.5 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                            title={t(
                                "certificates.actions.viewStudent",
                                "View Student"
                            )}
                        >
                            <User className="w-4 h-4" />
                        </button>
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                handleDownloadCertificate(
                                    row.id,
                                    row.columns.student as string,
                                    row.columns.levelName as string
                                );
                            }}
                            className="p-1.5 text-cyan-500 hover:bg-cyan-50 dark:hover:bg-cyan-900/20 rounded-lg transition-colors"
                            title={t(
                                "certificates.actions.download",
                                "Download Certificate"
                            )}
                        >
                            <Download className="w-4 h-4" />
                        </button>
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                handleSendCertificate(
                                    row.id,
                                    row.columns.student as string
                                );
                            }}
                            className="p-1.5 text-brand-500 hover:bg-brand-50 dark:hover:bg-brand-900/20 rounded-lg transition-colors"
                            title={t(
                                "certificates.actions.send",
                                "Send Certificate"
                            )}
                        >
                            <Send className="w-4 h-4" />
                        </button>
                    </div>
                ),
            },
        ],
        [
            t,
            getStatusLabel,
            handleViewStudent,
            handleDownloadCertificate,
            handleSendCertificate,
        ]
    );

    return (
        <PageWrapper
            pageHeaderProps={{
                title: t("certificates.title", "Certificates"),
                subtitle: t(
                    "certificates.subtitle",
                    "Student certificates generated after successfully passing the final quiz"
                ),
            }}
        >
            {/* Filters Section */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6 mb-6">
                <div className="flex items-center gap-2 text-brand-500 mb-4">
                    <Filter className="w-5 h-5" />
                    <h2 className="text-lg font-semibold">
                        {t("certificates.filters.title", "Filters")}
                    </h2>
                </div>
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                    <div className="relative flex-1 max-w-md">
                        <svg
                            className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                            />
                        </svg>
                        <input
                            type="text"
                            placeholder={t(
                                "certificates.filters.searchPlaceholder",
                                "Search by student name or student id"
                            )}
                            className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg text-sm text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500"
                        />
                    </div>
                    <button className="p-2.5 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                        <Filter className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                    </button>
                </div>
            </div>

            {/* Certificates Table */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700">
                <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                    <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                        {t("certificates.listTitle", "Issued Certificates")}
                    </h2>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                        {t(
                            "certificates.listSubtitle",
                            "Certificates generated after students successfully pass the final quiz"
                        )}
                    </p>
                </div>

                <DynamicTable
                    title={t("certificates.listTitle", "Issued Certificates")}
                    data={tableData}
                    columns={columns}
                    initialView="grid"
                    itemsPerPage={paginationInfo?.perPage ?? 10}
                    hideHeader={true}
                    currentPage={paginationInfo?.currentPage}
                    lastPage={paginationInfo?.lastPage}
                    totalCount={certificates?.length}
                    onPageChange={paginationInfo ? handlePageChange : undefined}
                    disableRowClick
                />
            </div>

            {isLoading && (
                <div className="flex justify-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-500" />
                </div>
            )}

            {isError && (
                <div className="text-center py-8 text-red-500">
                    {t(
                        "certificates.errors.loadFailed",
                        "Failed to load certificates"
                    )}
                </div>
            )}
        </PageWrapper>
    );
}

export default CertificatesPage;
