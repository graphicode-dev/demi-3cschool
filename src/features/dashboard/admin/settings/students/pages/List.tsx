import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { ErrorState, LoadingState, useConfirmDialog } from "@/design-system";
import { PageWrapper, ActionsDropdown, DynamicTable } from "@/design-system";
import type { TableColumn, TableData } from "@/shared/types";
import { useStudentsList, useDeleteStudent } from "../api";
import { studentsPaths } from "../navigation/paths";
import { useMutationHandler } from "@/shared/api";
import { Eye, Pen, Plus, Trash } from "lucide-react";

export default function StudentsListPage() {
    const { t } = useTranslation("students");
    const navigate = useNavigate();
    const { confirm } = useConfirmDialog();

    const { execute } = useMutationHandler();

    const { data, isLoading, error, refetch } = useStudentsList({ page: 1 });
    const deleteMutation = useDeleteStudent();

    const handleDelete = async (rowId: string) => {
        const confirmed = await confirm({
            title: t("confirmDelete", "Are you sure?"),
            message: t("confirmDelete", "Are you sure?"),
            variant: "danger",
            confirmText: t("common.delete", "Delete"),
            cancelText: t("common.cancel", "Cancel"),
            successMessage: t(
                "messages.deleteSuccess",
                "Student deleted successfully"
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
            id: "email",
            header: t("fields.email", "Email"),
            accessorKey: "email",
        },
        {
            id: "role",
            header: t("fields.role", "Role"),
            accessorKey: "role",
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
                                    navigate(studentsPaths.view(rowId)),
                                icon: <Eye className="w-4 h-4" />,
                            },
                            {
                                id: "edit",
                                label: t("actions.edit", "Edit"),
                                onClick: () =>
                                    navigate(studentsPaths.edit(rowId)),
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
                title: t("title", "Students"),
                subtitle: t("description", "Manage students"),
                actions: (
                    <button
                        type="button"
                        onClick={() => navigate(studentsPaths.create)}
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
                    title={t("title", "Students")}
                    data={
                        (data?.items ?? []).map((item) => ({
                            id: String(item.id),
                            columns: {
                                id: item.id,
                                name: item.name,
                                email: item.email,
                                role:
                                    item.role?.caption ??
                                    item.role?.name ??
                                    "-",
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
