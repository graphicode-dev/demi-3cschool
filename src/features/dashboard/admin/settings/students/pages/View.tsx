import { useTranslation } from "react-i18next";
import { Link, useParams } from "react-router-dom";
import PageWrapper from "@/design-system/components/PageWrapper";
import { ViewCard } from "@/shared/components/ui/ViewCard";
import { useStudent } from "../api";
import { studentsPaths } from "../navigation/paths";
import { Pen } from "lucide-react";

export default function StudentsViewPage() {
    const { t } = useTranslation("students");
    const { id } = useParams<{ id: string }>();

    const { data, isLoading, error } = useStudent(id);

    return (
        <PageWrapper
            pageHeaderProps={{
                title: t("actions.view", "View"),
                backButton: true,
                actions: (
                    <Link
                        to={studentsPaths.edit(id!)}
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
                    headerTitle={t("sections.details", "Student Details")}
                    data={{
                        rows: [
                            {
                                fields: [
                                    {
                                        label: "",
                                        value: data.image,
                                        type: "image",
                                        colSpan: 3,
                                    },
                                    {
                                        label: t("table.id", "ID"),
                                        value: data.id,
                                    },
                                    {
                                        label: t("fields.name", "Name"),
                                        value: data.name,
                                    },
                                    {
                                        label: t("fields.email", "Email"),
                                        value: data.email,
                                    },
                                    {
                                        label: t("fields.phone", "Phone"),
                                        value: data.phoneNumber ?? "-",
                                    },
                                    {
                                        label: t(
                                            "fields.government",
                                            "Government"
                                        ),
                                        value:
                                            data.userInformation?.governorate
                                                ?.name ?? "-",
                                    },
                                    {
                                        label: t("fields.grade", "Grade"),
                                        value:
                                            data.userInformation?.grade?.name ??
                                            "-",
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
