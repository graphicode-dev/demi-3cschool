import { useState, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";
import {
    Save,
    CheckCircle,
    Download,
    Send,
    User,
    GraduationCap,
    FileText,
    MessageSquare,
    BarChart3,
    Hash,
    BookOpen,
    Users,
    UserCheck,
    Calendar,
} from "lucide-react";
import { PageWrapper, ConfirmDialog } from "@/design-system";
import type { ReportStatus } from "../types";

type PerformanceRating =
    | "excellent"
    | "very_good"
    | "good"
    | "fair"
    | "needs_improvement";

interface ReportData {
    id: string;
    student: {
        id: string;
        name: string;
        parentEmail: string;
    };
    academic: {
        level: string;
        track: string;
        groupName: string;
        instructorName: string;
    };
    reportDetails: {
        type: "mid_report" | "final_report";
        sessionsRange: string;
        status: ReportStatus;
    };
    feedback: string;
    performance: {
        doingTasks: PerformanceRating;
        attendanceOnTime: PerformanceRating;
        interactionDuringSession: PerformanceRating;
        behaviorDuringSession: PerformanceRating;
        searchingCooperation: PerformanceRating;
        teamwork: PerformanceRating;
    };
}

const MOCK_REPORT: ReportData = {
    id: "1",
    student: {
        id: "STU-2024-001",
        name: "Ahmed Mohamed",
        parentEmail: "ahmed.parent@email.com",
    },
    academic: {
        level: "Level 3",
        track: "Web Development",
        groupName: "Group A",
        instructorName: "Dr. Sarah Johnson",
    },
    reportDetails: {
        type: "mid_report",
        sessionsRange: "Sessions 1-6",
        status: "draft",
    },
    feedback: "",
    performance: {
        doingTasks: "very_good",
        attendanceOnTime: "excellent",
        interactionDuringSession: "good",
        behaviorDuringSession: "very_good",
        searchingCooperation: "excellent",
        teamwork: "very_good",
    },
};

const getStatusBadgeClass = (status: ReportStatus) => {
    switch (status) {
        case "draft":
            return "bg-orange-100 text-orange-600 dark:bg-orange-900/20 dark:text-orange-400";
        case "ready":
            return "bg-cyan-100 text-cyan-600 dark:bg-cyan-900/20 dark:text-cyan-400";
        case "sent":
            return "bg-green-100 text-green-600 dark:bg-green-900/20 dark:text-green-400";
        default:
            return "bg-gray-100 text-gray-600 dark:bg-gray-900/20 dark:text-gray-400";
    }
};

function ReportViewPage() {
    const { t } = useTranslation("account");
    const { id } = useParams<{ id: string }>();

    const getStatusLabel = (status: ReportStatus) => {
        return t(`reports.status.${status}`, status);
    };

    const getReportTypeLabel = (type: string) => {
        return t(`reports.reportType.${type}`, type);
    };

    const getPerformanceLabel = (rating: PerformanceRating) => {
        return t(`reports.performance.${rating}`, rating);
    };

    const PERFORMANCE_OPTIONS: { value: PerformanceRating; label: string }[] = [
        {
            value: "excellent",
            label: t("reports.performance.excellent", "Excellent"),
        },
        {
            value: "very_good",
            label: t("reports.performance.very_good", "Very Good"),
        },
        { value: "good", label: t("reports.performance.good", "Good") },
        { value: "fair", label: t("reports.performance.fair", "Fair") },
        {
            value: "needs_improvement",
            label: t(
                "reports.performance.needs_improvement",
                "Needs Improvement"
            ),
        },
    ];

    const [report, setReport] = useState<ReportData>(MOCK_REPORT);
    const [feedback, setFeedback] = useState(
        t(
            "reports.view.mockFeedback",
            "Ahmed has shown consistent improvement in his coding skills throughout the first half of the course. He actively participates in class discussions and demonstrates strong problem-solving abilities. His project work has been of high quality, showing attention to detail and creativity."
        )
    );
    const [performance, setPerformance] = useState(MOCK_REPORT.performance);
    const [isSendDialogOpen, setIsSendDialogOpen] = useState(false);
    const [isSaving, setIsSaving] = useState(false);

    const maxFeedbackLength = 2000;

    const handleFeedbackChange = useCallback(
        (e: React.ChangeEvent<HTMLTextAreaElement>) => {
            const value = e.target.value;
            if (value.length <= maxFeedbackLength) {
                setFeedback(value);
            }
        },
        []
    );

    const handlePerformanceChange = useCallback(
        (field: keyof typeof performance, value: PerformanceRating) => {
            setPerformance((prev) => ({ ...prev, [field]: value }));
        },
        []
    );

    const handleSaveAsDraft = useCallback(async () => {
        setIsSaving(true);
        try {
            // API call to save as draft
            await new Promise((resolve) => setTimeout(resolve, 1000));
            setReport((prev) => ({
                ...prev,
                reportDetails: { ...prev.reportDetails, status: "draft" },
            }));
        } finally {
            setIsSaving(false);
        }
    }, []);

    const handleMarkAsReady = useCallback(async () => {
        setIsSaving(true);
        try {
            // API call to mark as ready
            await new Promise((resolve) => setTimeout(resolve, 1000));
            setReport((prev) => ({
                ...prev,
                reportDetails: { ...prev.reportDetails, status: "ready" },
            }));
        } finally {
            setIsSaving(false);
        }
    }, []);

    const handleDownloadPDF = useCallback(() => {
        const printContent = `
            <!DOCTYPE html>
            <html>
            <head>
                <title>${t("reports.view.pdfTitle", "Student Report")} - ${report.student.name}</title>
                <style>
                    * { margin: 0; padding: 0; box-sizing: border-box; }
                    body { font-family: Arial, sans-serif; padding: 40px; color: #333; }
                    .header { text-align: center; margin-bottom: 30px; border-bottom: 2px solid #0ea5e9; padding-bottom: 20px; }
                    .header h1 { color: #0ea5e9; font-size: 24px; margin-bottom: 5px; }
                    .header p { color: #666; font-size: 14px; }
                    .section { margin-bottom: 25px; }
                    .section-title { font-size: 16px; font-weight: bold; color: #0ea5e9; margin-bottom: 15px; border-bottom: 1px solid #e5e7eb; padding-bottom: 8px; }
                    .info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
                    .info-item { margin-bottom: 10px; }
                    .info-label { font-size: 11px; color: #666; text-transform: uppercase; letter-spacing: 0.5px; }
                    .info-value { font-size: 14px; font-weight: 500; margin-top: 2px; }
                    .feedback-box { background: #f9fafb; padding: 15px; border-radius: 8px; font-size: 14px; line-height: 1.6; }
                    .performance-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
                    .performance-item { display: flex; justify-content: space-between; padding: 8px 12px; background: #f9fafb; border-radius: 6px; }
                    .performance-label { font-size: 13px; }
                    .performance-value { font-size: 13px; font-weight: 500; color: #0ea5e9; }
                    .status-badge { display: inline-block; padding: 4px 12px; border-radius: 20px; font-size: 12px; font-weight: 500; }
                    .status-draft { background: #fef3c7; color: #d97706; }
                    .status-ready { background: #cffafe; color: #0891b2; }
                    .status-sent { background: #dcfce7; color: #16a34a; }
                    @media print { body { padding: 20px; } }
                </style>
            </head>
            <body>
                <div class="header">
                    <h1>${t("reports.view.pdfTitle", "Student Report")}</h1>
                    <p>${getReportTypeLabel(report.reportDetails.type)} - ${report.reportDetails.sessionsRange}</p>
                </div>
                
                <div class="section">
                    <div class="section-title">${t("reports.view.studentInfo.title", "Student Information")}</div>
                    <div class="info-grid">
                        <div class="info-item">
                            <div class="info-label">${t("reports.view.studentInfo.studentName", "Student Name")}</div>
                            <div class="info-value">${report.student.name}</div>
                        </div>
                        <div class="info-item">
                            <div class="info-label">${t("reports.view.studentInfo.studentId", "Student ID")}</div>
                            <div class="info-value">${report.student.id}</div>
                        </div>
                    </div>
                </div>
                
                <div class="section">
                    <div class="section-title">${t("reports.view.academicDetails.title", "Academic Details")}</div>
                    <div class="info-grid">
                        <div class="info-item">
                            <div class="info-label">${t("reports.view.academicDetails.levelName", "Level Name")}</div>
                            <div class="info-value">${report.academic.level}</div>
                        </div>
                        <div class="info-item">
                            <div class="info-label">${t("reports.view.academicDetails.trackName", "Track Name")}</div>
                            <div class="info-value">${report.academic.track}</div>
                        </div>
                        <div class="info-item">
                            <div class="info-label">${t("reports.view.academicDetails.groupName", "Group Name")}</div>
                            <div class="info-value">${report.academic.groupName}</div>
                        </div>
                        <div class="info-item">
                            <div class="info-label">${t("reports.view.academicDetails.instructorName", "Instructor Name")}</div>
                            <div class="info-value">${report.academic.instructorName}</div>
                        </div>
                    </div>
                </div>
                
                <div class="section">
                    <div class="section-title">${t("reports.view.reportDetails.title", "Report Details")}</div>
                    <div class="info-grid">
                        <div class="info-item">
                            <div class="info-label">${t("reports.view.reportDetails.reportType", "Report Type")}</div>
                            <div class="info-value">${getReportTypeLabel(report.reportDetails.type)}</div>
                        </div>
                        <div class="info-item">
                            <div class="info-label">${t("reports.view.reportDetails.sessionsRange", "Sessions Range")}</div>
                            <div class="info-value">${report.reportDetails.sessionsRange}</div>
                        </div>
                        <div class="info-item">
                            <div class="info-label">${t("reports.view.reportDetails.status", "Status")}</div>
                            <div class="info-value"><span class="status-badge status-${report.reportDetails.status}">${getStatusLabel(report.reportDetails.status)}</span></div>
                        </div>
                    </div>
                </div>
                
                <div class="section">
                    <div class="section-title">${t("reports.view.feedback.title", "Feedback")}</div>
                    <div class="feedback-box">${feedback}</div>
                </div>
                
                <div class="section">
                    <div class="section-title">${t("reports.view.performance.title", "Performance Evaluation")}</div>
                    <div class="performance-grid">
                        <div class="performance-item">
                            <span class="performance-label">${t("reports.view.performance.doingTasks", "Doing Tasks")}</span>
                            <span class="performance-value">${getPerformanceLabel(performance.doingTasks)}</span>
                        </div>
                        <div class="performance-item">
                            <span class="performance-label">${t("reports.view.performance.attendanceOnTime", "Attendance on Time")}</span>
                            <span class="performance-value">${getPerformanceLabel(performance.attendanceOnTime)}</span>
                        </div>
                        <div class="performance-item">
                            <span class="performance-label">${t("reports.view.performance.interactionDuringSession", "Interaction During the Session")}</span>
                            <span class="performance-value">${getPerformanceLabel(performance.interactionDuringSession)}</span>
                        </div>
                        <div class="performance-item">
                            <span class="performance-label">${t("reports.view.performance.behaviorDuringSession", "Behavior During Session")}</span>
                            <span class="performance-value">${getPerformanceLabel(performance.behaviorDuringSession)}</span>
                        </div>
                        <div class="performance-item">
                            <span class="performance-label">${t("reports.view.performance.searchingCooperation", "Searching & Cooperation")}</span>
                            <span class="performance-value">${getPerformanceLabel(performance.searchingCooperation)}</span>
                        </div>
                        <div class="performance-item">
                            <span class="performance-label">${t("reports.view.performance.teamwork", "Teamwork")}</span>
                            <span class="performance-value">${getPerformanceLabel(performance.teamwork)}</span>
                        </div>
                    </div>
                </div>
            </body>
            </html>
        `;

        const printWindow = window.open("", "_blank");
        if (printWindow) {
            printWindow.document.write(printContent);
            printWindow.document.close();
            printWindow.onload = () => {
                printWindow.print();
            };
        }
    }, [t, report, feedback, performance]);

    const handleSendReport = useCallback(async () => {
        setIsSaving(true);
        try {
            // API call to send report
            await new Promise((resolve) => setTimeout(resolve, 1000));
            setReport((prev) => ({
                ...prev,
                reportDetails: { ...prev.reportDetails, status: "sent" },
            }));
            setIsSendDialogOpen(false);
        } finally {
            setIsSaving(false);
        }
    }, []);

    const InfoItem = ({
        icon: Icon,
        label,
        value,
    }: {
        icon: React.ElementType;
        label: string;
        value: React.ReactNode;
    }) => (
        <div className="flex items-start gap-3 py-3">
            <div className="shrink-0 w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
                <Icon className="w-4 h-4 text-gray-500 dark:text-gray-400" />
            </div>
            <div>
                <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    {label}
                </p>
                <p className="text-sm font-medium text-gray-900 dark:text-white mt-0.5">
                    {value}
                </p>
            </div>
        </div>
    );

    const PerformanceSelect = ({
        label,
        value,
        onChange,
    }: {
        label: string;
        value: PerformanceRating;
        onChange: (value: PerformanceRating) => void;
    }) => (
        <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {label}
            </label>
            <div className="relative">
                <select
                    value={value}
                    onChange={(e) =>
                        onChange(e.target.value as PerformanceRating)
                    }
                    className="w-full px-4 py-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-sm text-gray-900 dark:text-white appearance-none focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500"
                >
                    {PERFORMANCE_OPTIONS.map((option) => (
                        <option key={option.value} value={option.value}>
                            {option.label}
                        </option>
                    ))}
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                    <svg
                        className="w-5 h-5 text-gray-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M19 9l-7 7-7-7"
                        />
                    </svg>
                </div>
            </div>
        </div>
    );

    return (
        <PageWrapper
            pageHeaderProps={{
                title: t("reports.view.title", "Review Student Report"),
                subtitle: t(
                    "reports.view.subtitle",
                    "Review and confirm report details before sending to parent"
                ),
                backButton: true,
                actions: (
                    <div className="flex items-center gap-3">
                        <button
                            onClick={handleSaveAsDraft}
                            disabled={isSaving}
                            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors disabled:opacity-50"
                        >
                            <Save className="w-4 h-4" />
                            {t(
                                "reports.view.actions.saveAsDraft",
                                "Save as Draft"
                            )}
                        </button>
                        <button
                            onClick={handleMarkAsReady}
                            disabled={isSaving}
                            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors disabled:opacity-50"
                        >
                            <CheckCircle className="w-4 h-4" />
                            {t(
                                "reports.view.actions.markAsReady",
                                "Mark as Ready"
                            )}
                        </button>
                        <button
                            onClick={handleDownloadPDF}
                            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                        >
                            <Download className="w-4 h-4" />
                            {t(
                                "reports.view.actions.downloadPDF",
                                "Download PDF Preview"
                            )}
                        </button>
                        <button
                            onClick={() => setIsSendDialogOpen(true)}
                            disabled={isSaving}
                            className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-white bg-brand-500 rounded-lg hover:bg-brand-600 transition-colors disabled:opacity-50"
                        >
                            <Send className="w-4 h-4" />
                            {t(
                                "reports.view.actions.sendReport",
                                "Send Report"
                            )}
                        </button>
                    </div>
                ),
            }}
        >
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Left Column */}
                <div className="space-y-6">
                    {/* Student Information */}
                    <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6">
                        <div className="flex items-center gap-2 mb-4">
                            <User className="w-5 h-5 text-brand-500" />
                            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                                {t(
                                    "reports.view.studentInfo.title",
                                    "Student Information"
                                )}
                            </h2>
                        </div>
                        <div className="divide-y divide-gray-100 dark:divide-gray-700">
                            <InfoItem
                                icon={User}
                                label={t(
                                    "reports.view.studentInfo.studentName",
                                    "Student Name"
                                )}
                                value={report.student.name}
                            />
                            <InfoItem
                                icon={Hash}
                                label={t(
                                    "reports.view.studentInfo.studentId",
                                    "Student ID"
                                )}
                                value={report.student.id}
                            />
                        </div>
                    </div>

                    {/* Academic Details */}
                    <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6">
                        <div className="flex items-center gap-2 mb-4">
                            <GraduationCap className="w-5 h-5 text-brand-500" />
                            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                                {t(
                                    "reports.view.academicDetails.title",
                                    "Academic Details"
                                )}
                            </h2>
                        </div>
                        <div className="divide-y divide-gray-100 dark:divide-gray-700">
                            <InfoItem
                                icon={BookOpen}
                                label={t(
                                    "reports.view.academicDetails.levelName",
                                    "Level Name"
                                )}
                                value={report.academic.level}
                            />
                            <InfoItem
                                icon={BookOpen}
                                label={t(
                                    "reports.view.academicDetails.trackName",
                                    "Track Name"
                                )}
                                value={report.academic.track}
                            />
                            <InfoItem
                                icon={Users}
                                label={t(
                                    "reports.view.academicDetails.groupName",
                                    "Group Name"
                                )}
                                value={report.academic.groupName}
                            />
                            <InfoItem
                                icon={UserCheck}
                                label={t(
                                    "reports.view.academicDetails.instructorName",
                                    "Instructor Name"
                                )}
                                value={report.academic.instructorName}
                            />
                        </div>
                    </div>

                    {/* Report Details */}
                    <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6">
                        <div className="flex items-center gap-2 mb-4">
                            <FileText className="w-5 h-5 text-brand-500" />
                            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                                {t(
                                    "reports.view.reportDetails.title",
                                    "Report Details"
                                )}
                            </h2>
                        </div>
                        <div className="divide-y divide-gray-100 dark:divide-gray-700">
                            <InfoItem
                                icon={FileText}
                                label={t(
                                    "reports.view.reportDetails.reportType",
                                    "Report Type"
                                )}
                                value={getReportTypeLabel(
                                    report.reportDetails.type
                                )}
                            />
                            <InfoItem
                                icon={Calendar}
                                label={t(
                                    "reports.view.reportDetails.sessionsRange",
                                    "Sessions Range"
                                )}
                                value={report.reportDetails.sessionsRange}
                            />
                            <InfoItem
                                icon={Hash}
                                label={t(
                                    "reports.view.reportDetails.status",
                                    "Status"
                                )}
                                value={
                                    <span
                                        className={`inline-flex px-2.5 py-1 text-xs font-medium rounded-full ${getStatusBadgeClass(
                                            report.reportDetails.status
                                        )}`}
                                    >
                                        {getStatusLabel(
                                            report.reportDetails.status
                                        )}
                                    </span>
                                }
                            />
                        </div>
                    </div>
                </div>

                {/* Right Column */}
                <div className="space-y-6">
                    {/* Feedback */}
                    <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6">
                        <div className="flex items-center gap-2 mb-4">
                            <MessageSquare className="w-5 h-5 text-brand-500" />
                            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                                {t("reports.view.feedback.title", "Feedback")}
                            </h2>
                        </div>
                        <textarea
                            value={feedback}
                            onChange={handleFeedbackChange}
                            rows={6}
                            className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl text-sm text-gray-900 dark:text-white placeholder-gray-400 resize-none focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500"
                            placeholder={t(
                                "reports.view.feedback.placeholder",
                                "Enter feedback for the student..."
                            )}
                        />
                        <div className="flex justify-end mt-2">
                            <span className="text-xs text-gray-500 dark:text-gray-400">
                                {feedback.length} / {maxFeedbackLength}{" "}
                                {t(
                                    "reports.view.feedback.characters",
                                    "Characters"
                                )}
                            </span>
                        </div>
                    </div>

                    {/* Performance Evaluation */}
                    <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6">
                        <div className="flex items-center gap-2 mb-4">
                            <BarChart3 className="w-5 h-5 text-brand-500" />
                            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                                {t(
                                    "reports.view.performance.title",
                                    "Performance Evaluation"
                                )}
                            </h2>
                        </div>
                        <div className="space-y-2">
                            <PerformanceSelect
                                label={t(
                                    "reports.view.performance.doingTasks",
                                    "Doing Tasks"
                                )}
                                value={performance.doingTasks}
                                onChange={(v) =>
                                    handlePerformanceChange("doingTasks", v)
                                }
                            />
                            <PerformanceSelect
                                label={t(
                                    "reports.view.performance.attendanceOnTime",
                                    "Attendance on Time"
                                )}
                                value={performance.attendanceOnTime}
                                onChange={(v) =>
                                    handlePerformanceChange(
                                        "attendanceOnTime",
                                        v
                                    )
                                }
                            />
                            <PerformanceSelect
                                label={t(
                                    "reports.view.performance.interactionDuringSession",
                                    "Interaction During the Session"
                                )}
                                value={performance.interactionDuringSession}
                                onChange={(v) =>
                                    handlePerformanceChange(
                                        "interactionDuringSession",
                                        v
                                    )
                                }
                            />
                            <PerformanceSelect
                                label={t(
                                    "reports.view.performance.behaviorDuringSession",
                                    "Behavior During Session"
                                )}
                                value={performance.behaviorDuringSession}
                                onChange={(v) =>
                                    handlePerformanceChange(
                                        "behaviorDuringSession",
                                        v
                                    )
                                }
                            />
                            <PerformanceSelect
                                label={t(
                                    "reports.view.performance.searchingCooperation",
                                    "Searching & Cooperation"
                                )}
                                value={performance.searchingCooperation}
                                onChange={(v) =>
                                    handlePerformanceChange(
                                        "searchingCooperation",
                                        v
                                    )
                                }
                            />
                            <PerformanceSelect
                                label={t(
                                    "reports.view.performance.teamwork",
                                    "Teamwork"
                                )}
                                value={performance.teamwork}
                                onChange={(v) =>
                                    handlePerformanceChange("teamwork", v)
                                }
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* Send Report Confirmation Dialog */}
            <ConfirmDialog
                isOpen={isSendDialogOpen}
                onClose={() => setIsSendDialogOpen(false)}
                title={t(
                    "reports.view.sendDialog.title",
                    "Send Report to Parent"
                )}
                message={
                    <div className="text-left">
                        <p className="mb-4">
                            {t(
                                "reports.view.sendDialog.message",
                                "You Are About To Send The Report For"
                            )}{" "}
                            <span className="font-semibold text-gray-900 dark:text-white">
                                {report.student.name}
                            </span>{" "}
                            {t("reports.view.sendDialog.to", "To")} :
                        </p>
                        <div className="bg-gray-50 dark:bg-gray-900 rounded-lg px-4 py-3 mb-4">
                            <p className="text-sm text-gray-900 dark:text-white">
                                {report.student.parentEmail}
                            </p>
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                            {t(
                                "reports.view.sendDialog.warning",
                                "Once Sent, The Report Will Become Read-Only And Cannot Be Edited."
                            )}
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                            {t(
                                "reports.view.sendDialog.confirm",
                                "Are You Sure You Want To Proceed?"
                            )}
                        </p>
                    </div>
                }
                variant="info"
                icon={<Send className="h-7 w-7" />}
                confirmText={t(
                    "reports.view.sendDialog.sendButton",
                    "Send Report"
                )}
                cancelText={t("reports.view.sendDialog.cancelButton", "Cancel")}
                onConfirm={handleSendReport}
                loading={isSaving}
            />
        </PageWrapper>
    );
}

export default ReportViewPage;
