import { useTranslation } from "react-i18next";
import { Link, useParams } from "react-router-dom";
import { PageWrapper, ViewCard } from "@/design-system";
import { useTrainingCenter } from "../api";
import { trainingCentersPaths } from "../navigation/paths";
import { Pen } from "lucide-react";

export default function TrainingCentersViewPage() {
    const { t } = useTranslation("trainingCenters");
    const { id } = useParams<{ id: string }>();

    const { data, isLoading, error } = useTrainingCenter(id);

    return (
        <PageWrapper
            pageHeaderProps={{
                title: t("actions.view", "View"),
                backButton: true,
                actions: (
                    <Link
                        to={trainingCentersPaths.edit(id!)}
                        className="inline-flex items-center gap-2 px-4 py-2.5 bg-brand-500 text-white text-sm font-medium rounded-lg hover:bg-brand-600 transition-colors"
                    >
                        <Pen className="w-3 h-3" />
                        {t("actions.edit", "Edit")}
                    </Link>
                ),
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
                <ViewCard
                    headerTitle={t(
                        "sections.details",
                        "Training Center Details"
                    )}
                    data={{
                        rows: [
                            {
                                fields: [
                                    {
                                        label: t("table.id", "ID"),
                                        value: data.id,
                                    },
                                    {
                                        label: t("fields.name", "Name"),
                                        value: data.name,
                                    },
                                    {
                                        label: t(
                                            "table.governorate",
                                            "Governorate"
                                        ),
                                        value: data.governorate?.name ?? "-",
                                    },
                                    {
                                        label: t("table.status", "Status"),
                                        value: data.isActive
                                            ? t("status.active", "Active")
                                            : t("status.inactive", "Inactive"),
                                    },
                                ],
                            },
                        ],
                    }}
                />
            )}
        </PageWrapper>
    );
}
