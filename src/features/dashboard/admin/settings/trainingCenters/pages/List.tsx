import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import PageWrapper from "@/design-system/components/PageWrapper";
import { ErrorState, LoadingState, useConfirmDialog } from "@/design-system";
import { DynamicTable } from "@/design-system/components/table";
import type { TableColumn, TableData } from "@/shared/types";
import { useTrainingCentersList, useDeleteTrainingCenter } from "../api";
import { trainingCentersPaths } from "../navigation/paths";
import { useMutationHandler } from "@/shared/api";
import { Eye, Pen, Plus, Trash } from "lucide-react";
import ActionsDropdown from "@/design-system/components/ActionsDropdown";

export default function TrainingCentersListPage() {
    const { t } = useTranslation("trainingCenters");
    const navigate = useNavigate();
    const { confirm } = useConfirmDialog();

    const { execute } = useMutationHandler();

    const { data, isLoading, error, refetch } = useTrainingCentersList();
    const deleteMutation = useDeleteTrainingCenter();

    const handleDelete = async (rowId: string) => {
        const confirmed = await confirm({
            title: t("confirmDelete", "Are you sure?"),
            message: t("confirmDelete", "Are you sure?"),
            variant: "danger",
            confirmText: t("common.delete", "Delete"),
            cancelText: t("common.cancel", "Cancel"),
            successMessage: t(
                "messages.deleteSuccess",
                "Training center deleted successfully"
            ),
        });

        if (!confirmed) return;

        await execute(() => deleteMutation.mutateAsync(rowId));
    };

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
                    <ActionsDropdown
                        itemId={rowId}
                        actions={[
                            {
                                id: "view",
                                label: t("actions.view", "View"),
                                onClick: () =>
                                    navigate(trainingCentersPaths.view(rowId)),
                                icon: <Eye className="w-4 h-4" />,
                            },
                            {
                                id: "edit",
                                label: t("actions.edit", "Edit"),
                                onClick: () =>
                                    navigate(trainingCentersPaths.edit(rowId)),
                                icon: <Pen className="w-4 h-4" />,
                            },
                            {
                                id: "delete",
                                label: t("actions.delete", "Delete"),
                                onClick: () => handleDelete(rowId),
                                icon: (
                                    <Trash className="text-red-500 w-4 h-4" />
                                ),
                                className: "text-red-500",
                                divider: true,
                            },
                        ]}
                    />
                );
            },
        },
    ] as TableColumn[];

    return (
        <PageWrapper
            pageHeaderProps={{
                title: t("title", "Training Centers"),
                subtitle: t("description", "Manage training centers"),
                actions: (
                    <button
                        type="button"
                        onClick={() => navigate(trainingCentersPaths.create)}
                        className="inline-flex items-center gap-2 px-4 py-2 bg-brand-500 text-white rounded-lg hover:bg-brand-600 transition-colors"
                    >
                        <Plus className="w-4 h-4" />{" "}
                        {t("actions.create", "Create")}
                    </button>
                ),
            }}
        >
            {isLoading ? (
                <LoadingState message={t("loading", "Loading...")} />
            ) : error ? (
                <ErrorState
                    message={t("error", "Failed to load")}
                    onRetry={refetch}
                />
            ) : (
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
                    hideToolbar
                    hidePagination
                    hideActionButtons
                    disableRowClick
                    hideBorder
                    hideHeader
                />
            )}
        </PageWrapper>
    );
}
