import { useTranslation } from "react-i18next";
import { useParams, useNavigate } from "react-router-dom";
import { FileText, Download, ArrowLeft } from "lucide-react";
import { MOCK_PROJECTS } from "../mocks";

export function HomeworkFilePage() {
    const { t } = useTranslation("projects");
    const { projectId } = useParams<{ projectId: string }>();
    const navigate = useNavigate();

    const project = MOCK_PROJECTS.find((p) => p.id === Number(projectId));

    if (!project) {
        return (
            <div className="flex flex-col items-center justify-center py-12">
                <p className="text-gray-500 dark:text-gray-400">
                    {t("projectNotFound")}
                </p>
            </div>
        );
    }

    const handleDownload = () => {
        if (project.homeworkFile?.url) {
            window.open(project.homeworkFile.url, "_blank");
        }
    };

    return (
        <div className="flex flex-col gap-6 max-w-4xl mx-auto">
            {/* Back Button */}
            <button
                onClick={() => navigate(-1)}
                className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors w-fit"
            >
                <ArrowLeft className="size-4" />
                <span className="text-sm font-medium">{t("back")}</span>
            </button>

            {/* Header Section */}
            <div className="flex flex-col gap-1">
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                    {t("homeworkFile.title")}
                </h1>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                    {t("homeworkFile.description")}
                </p>
            </div>

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
                                {project.homeworkFile?.name || "Homework.pdf"}
                            </h3>
                            <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                                <span className="px-2 py-0.5 rounded-md bg-gray-100 dark:bg-gray-800 text-xs font-semibold uppercase">
                                    {project.homeworkFile?.type || "PDF"}
                                </span>
                                <span>•</span>
                                <span>
                                    {project.homeworkFile?.size || "2.5 MB"}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Download Button */}
                    <button
                        onClick={handleDownload}
                        className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-gradient-to-r from-brand-500 to-brand-400 text-white font-bold shadow-lg shadow-brand-500/30 hover:shadow-brand-500/40 transition-all"
                    >
                        <Download className="size-5" />
                        {t("homeworkFile.download")}
                    </button>
                </div>

                {/* File Preview */}
                <div className="mx-4 mb-4 sm:mx-6 sm:mb-6">
                    <div className="bg-gray-100 dark:bg-gray-800 rounded-3xl h-80 flex items-center justify-center border border-gray-200 dark:border-gray-700">
                        <p className="text-gray-500 dark:text-gray-400 text-sm">
                            {t("homeworkFile.previewPlaceholder")}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default HomeworkFilePage;
