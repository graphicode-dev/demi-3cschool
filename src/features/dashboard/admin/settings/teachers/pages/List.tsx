import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import PageWrapper from "@/design-system/components/PageWrapper";
import { ErrorState, LoadingState, useConfirmDialog } from "@/design-system";
import { DynamicTable } from "@/design-system/components/table";
import type { TableColumn, TableData } from "@/shared/types";
import { useTeachersList, useDeleteTeacher } from "../api";
import { teachersPaths } from "../navigation/paths";
import { useMutationHandler } from "@/shared/api";

export default function TeachersListPage() {
    const { t } = useTranslation("teachers");
    const navigate = useNavigate();
    const { confirm } = useConfirmDialog();

    const { execute } = useMutationHandler();

    const { data, isLoading, error, refetch } = useTeachersList({ page: 1 });
    const deleteMutation = useDeleteTeacher();

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
                    <div className="flex items-center gap-2 justify-end">
                        <button
                            type="button"
                            onClick={(e) => {
                                e.stopPropagation();
                                navigate(teachersPaths.view(rowId));
                            }}
                            className="px-3 py-1.5 rounded-md border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800"
                        >
                            {t("actions.view", "View")}
                        </button>
                        <button
                            type="button"
                            onClick={(e) => {
                                e.stopPropagation();
                                navigate(teachersPaths.edit(rowId));
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
                                    message: t("confirmDelete", "Are you sure?"),
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
                                            "Teacher deleted successfully"
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
                title: t("title", "Teachers"),
                subtitle: t("description", "Manage teachers"),
            }}
        >
            <div className="flex justify-end mb-4">
                <button
                    type="button"
                    onClick={() => navigate(teachersPaths.create)}
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
                        title={t("title", "Teachers")}
                        data={
                            (data?.items ?? []).map((item) => ({
                                id: String(item.id),
                                columns: {
                                    id: item.id,
                                    name: item.name,
                                    email: item.email,
                                    role: item.role?.caption ?? item.role?.name ?? "-",
                                },
                            })) as TableData[]
                        }
                        columns={columnsData}
                        initialView="grid"
                        hideToolbar
                        hidePagination
                        hideActionButtons
                        disableRowClick={false}
                        onRowClick={(rowId) => navigate(teachersPaths.view(rowId))}
                    />
                </div>
            )}
        </PageWrapper>
    );
}
