import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import PageWrapper from "@/design-system/components/PageWrapper";
import { ErrorState, LoadingState, useConfirmDialog } from "@/design-system";
import { DynamicTable } from "@/design-system/components/table";
import type { TableColumn, TableData } from "@/shared/types";
import { useTrainingCentersList, useDeleteTrainingCenter } from "../api";
import { trainingCentersPaths } from "../navigation/paths";
import { useMutationHandler } from "@/shared/api";

export default function TrainingCentersListPage() {
    const { t } = useTranslation("trainingCenters");
    const navigate = useNavigate();
    const { confirm } = useConfirmDialog();

    const { execute } = useMutationHandler();

    const { data, isLoading, error, refetch } = useTrainingCentersList();
    const deleteMutation = useDeleteTrainingCenter();

    const columnsData = [
        {
            id: "id",
            header: t("table.id", "ID"),
            accessorKey: "id",
            sortable: true,
        },
        {
            id: "name",
            header: t("fields.name", "Name"),
            accessorKey: "name",
            sortable: true,
        },
        {
            id: "governorate",
            header: t("table.governorate", "Governorate"),
            accessorKey: "governorate",
        },
        {
            id: "status",
            header: t("table.status", "Status"),
            accessorKey: "status",
        },
        {
            id: "actions",
            header: t("table.actions", "Actions"),
            accessorKey: "actions",
            cell: ({ row }) => {
                const rowId = String(row?.original?.id ?? row?.id);

                return (
                    <div className="flex items-center gap-2 justify-end">
                        <button
                            type="button"
                            onClick={(e) => {
                                e.stopPropagation();
                                navigate(trainingCentersPaths.view(rowId));
                            }}
                            className="px-3 py-1.5 rounded-md border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800"
                        >
                            {t("actions.view", "View")}
                        </button>
                        <button
                            type="button"
                            onClick={(e) => {
                                e.stopPropagation();
                                navigate(trainingCentersPaths.edit(rowId));
                            }}
                            className="px-3 py-1.5 rounded-md border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800"
                        >
                            {t("actions.edit", "Edit")}
                        </button>
                        <button
                            type="button"
                            disabled={deleteMutation.isPending}
                            onClick={async (e) => {
                                e.stopPropagation();

                                const confirmed = await confirm({
                                    title: t("confirmDelete", "Are you sure?"),
                                    message: t(
                                        "confirmDelete",
                                        "Are you sure?"
                                    ),
                                    variant: "danger",
                                    confirmText: t("common.delete", "Delete"),
                                    cancelText: t("common.cancel", "Cancel"),
                                });

                                if (!confirmed) return;

                                await execute(
                                    () => deleteMutation.mutateAsync(rowId),
                                    {
                                        successMessage: t(
                                            "messages.deleteSuccess",
                                            "Training center deleted successfully"
                                        ),
                                    }
                                );
                            }}
                            className="px-3 py-1.5 rounded-md border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 hover:bg-red-50 dark:hover:bg-red-900/20 disabled:opacity-50"
                        >
                            {t("actions.delete", "Delete")}
                        </button>
                    </div>
                );
            },
        },
    ] as TableColumn[];

    return (
        <PageWrapper
            pageHeaderProps={{
                title: t("title", "Training Centers"),
                subtitle: t("description", "Manage training centers"),
                backButton: true,
            }}
        >
            <div className="flex justify-end mb-4">
                <button
                    type="button"
                    onClick={() => navigate(trainingCentersPaths.create)}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-brand-500 text-white rounded-lg hover:bg-brand-600 transition-colors"
                >
                    {t("actions.create", "Create")}
                </button>
            </div>

            {isLoading ? (
                <LoadingState message={t("loading", "Loading...")} />
            ) : error ? (
                <ErrorState
                    message={t("error", "Failed to load")}
                    onRetry={refetch}
                />
            ) : (
                <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden">
                    <DynamicTable
                        title={t("title", "Training Centers")}
                        data={
                            (data ?? []).map((item) => ({
                                id: String(item.id),
                                columns: {
                                    id: item.id,
                                    name: item.name,
                                    governorate: item.governorate?.name ?? "-",
                                    status: item.isActive
                                        ? t("status.active", "Active")
                                        : t("status.inactive", "Inactive"),
                                },
                            })) as TableData[]
                        }
                        columns={columnsData}
                        initialView="grid"
                        hideToolbar
                        hidePagination
                        hideActionButtons
                        disableRowClick={false}
                        onRowClick={(rowId) =>
                            navigate(trainingCentersPaths.view(rowId))
                        }
                    />
                </div>
            )}
        </PageWrapper>
    );
}
