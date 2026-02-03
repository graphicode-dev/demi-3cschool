import { useTranslation } from "react-i18next";
import { useNavigate, useParams } from "react-router-dom";
import PageWrapper from "@/design-system/components/PageWrapper";
import { useTrainingCenter } from "../api";
import { trainingCentersPaths } from "../navigation/paths";

export default function TrainingCentersViewPage() {
    const { t } = useTranslation("trainingCenters");
    const navigate = useNavigate();
    const { id } = useParams<{ id: string }>();

    const { data, isLoading, error } = useTrainingCenter(id);

    return (
        <PageWrapper
            pageHeaderProps={{
                title: t("actions.view", "View"),
                backButton: true,
            }}
        >
            {isLoading ? (
                <div className="text-sm text-gray-500 dark:text-gray-400">
                    {t("loading", "Loading...")}
                </div>
            ) : error || !data ? (
                <div className="text-sm text-red-600 dark:text-red-400">
                    {t("error", "Failed to load")}
                </div>
            ) : (
                <div className="space-y-4 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg p-6">
                    <div className="flex justify-end gap-2">
                        <button
                            type="button"
                            onClick={() => navigate(trainingCentersPaths.edit(data.id))}
                            className="px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800"
                        >
                            {t("actions.edit", "Edit")}
                        </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <div className="text-xs text-gray-500 dark:text-gray-400">
                                {t("table.id", "ID")}
                            </div>
                            <div className="text-sm text-gray-900 dark:text-gray-100">
                                {data.id}
                            </div>
                        </div>
                        <div>
                            <div className="text-xs text-gray-500 dark:text-gray-400">
                                {t("fields.name", "Name")}
                            </div>
                            <div className="text-sm text-gray-900 dark:text-gray-100">
                                {data.name}
                            </div>
                        </div>
                        <div>
                            <div className="text-xs text-gray-500 dark:text-gray-400">
                                {t("table.governorate", "Governorate")}
                            </div>
                            <div className="text-sm text-gray-900 dark:text-gray-100">
                                {data.governorate?.name ?? "-"}
                            </div>
                        </div>
                        <div>
                            <div className="text-xs text-gray-500 dark:text-gray-400">
                                {t("table.status", "Status")}
                            </div>
                            <div className="text-sm text-gray-900 dark:text-gray-100">
                                {data.isActive
                                    ? t("status.active", "Active")
                                    : t("status.inactive", "Inactive")}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </PageWrapper>
    );
}
