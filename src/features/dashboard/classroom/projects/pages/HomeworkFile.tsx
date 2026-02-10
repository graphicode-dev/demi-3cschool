import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";
import { FileText, Download } from "lucide-react";
import { PageWrapper } from "@/design-system";
import { useAssignmentGroups, type Assignment } from "../api";

export function HomeworkFilePage() {
    const { t } = useTranslation("projects");
    const { groupId, assignmentId } = useParams<{
        groupId: string;
        assignmentId: string;
    }>();

    const { data: groups, isLoading } = useAssignmentGroups(groupId);

    const assignment: Assignment | undefined = useMemo(() => {
        if (!groups || !assignmentId) return undefined;
        for (const group of groups) {
            for (const lesson of group.lessons) {
                const found = lesson.assignments.find(
                    (a) => String(a.assignmentId) === assignmentId
                );
                if (found) return found;
            }
        }
        return undefined;
    }, [groups, assignmentId]);

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center py-12">
                <p className="text-gray-500 dark:text-gray-400">
                    {t("loading", "Loading...")}
                </p>
            </div>
        );
    }

    if (!assignment) {
        return (
            <div className="flex flex-col items-center justify-center py-12">
                <p className="text-gray-500 dark:text-gray-400">
                    {t("projectNotFound")}
                </p>
            </div>
        );
    }

    const handleDownload = () => {
        if (assignment.assignmentFileUrl) {
            window.open(assignment.assignmentFileUrl, "_blank");
        }
    };

    return (
        <PageWrapper
            pageHeaderProps={{
                title: t("homeworkFile.title"),
                subtitle: t("homeworkFile.description"),
                backButton: true,
            }}
        >
            {/* File Card */}
            <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-theme-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
                {/* File Header */}
                <div className="flex items-center justify-between p-4 sm:p-6">
                    <div className="flex items-center gap-4">
                        {/* File Icon */}
                        <div className="size-14 rounded-2xl bg-brand-500/15 flex items-center justify-center">
                            <FileText className="size-7 text-brand-500" />
                        </div>

                        {/* File Info */}
                        <div className="flex flex-col">
                            <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                                {assignment.assignmentTitle || "Homework.pdf"}
                            </h3>
                            <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                                <span className="px-2 py-0.5 rounded-md bg-gray-100 dark:bg-gray-800 text-xs font-semibold uppercase">
                                    PDF
                                </span>
                                <span>•</span>
                                <span>{t("homeworkFile.assignment")}</span>
                            </div>
                        </div>
                    </div>

                    {/* Download Button */}
                    <button
                        onClick={handleDownload}
                        className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-linear-to-r from-brand-500 to-brand-400 text-white font-bold shadow-lg shadow-brand-500/30 hover:shadow-brand-500/40 transition-all"
                    >
                        <Download className="size-5" />
                        {t("homeworkFile.download")}
                    </button>
                </div>

                {/* File Preview - A4 aspect ratio (1:1.414) */}
                <div className="mx-4 mb-4 sm:mx-6 sm:mb-6 flex justify-center">
                    <div
                        className="bg-gray-100 dark:bg-gray-800 rounded-3xl flex items-center justify-center border border-gray-200 dark:border-gray-700 w-full max-w-[595px]"
                        style={{ aspectRatio: "1 / 1.414" }}
                    >
                        <p className="text-gray-500 dark:text-gray-400 text-sm">
                            {t("homeworkFile.previewPlaceholder")}
                        </p>
                    </div>
                </div>
            </div>
        </PageWrapper>
    );
}

export default HomeworkFilePage;
