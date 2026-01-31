/**
 * Level Prices List Page
 *
 * Main page for managing level prices.
 * Displays a data table with level price information.
 */

import { useMemo, useState, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { Plus, Eye, Edit, Trash2 } from "lucide-react";
import {
    LoadingState,
    ErrorState,
    EmptyState,
    ConfirmDialog,
} from "@/design-system";
import { DynamicTable } from "@/design-system/components/table";

import type { TableColumn, TableData } from "@/shared/types";
import { salesPaths } from "../../../navigation/paths";
import { LevelMultiSelect } from "@/features/sales_subscription/components";
import type { LevelPrice } from "../types";
import {
    useLevelPricesList,
    useDeleteLevelPrice,
    useLevelPricesForLevel,
} from "../api";
import PageWrapper from "@/design-system/components/PageWrapper";
import { useMutationHandler } from "@/shared/api";

export default function PriceListsList() {
    const { t } = useTranslation("sales_subscription");
    const navigate = useNavigate();
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [priceListToDelete, setPriceListToDelete] = useState<string | null>(
        null
    );
    const [selectedLevelId, setSelectedLevelId] = useState<string>();

    /**
     * Transform API LevelPrice data to TableData format
     */
    const transformLevelPriceToTableData = useCallback(
        (levelPrice: LevelPrice): TableData => ({
            id: String(levelPrice.id),
            avatar: levelPrice.level?.title?.charAt(0) || "L",
            columns: {
                id: levelPrice.id,
                name: levelPrice.name,
                description: levelPrice.description || "-",
                price: `$${parseFloat(levelPrice.price).toFixed(2)}`,
                groupType: levelPrice.groupType,
                originalPrice: `$${parseFloat(levelPrice.originalPrice).toFixed(2)}`,
                maxInstallments: levelPrice.maxInstallments,
                isDefault: levelPrice.isDefault,
                isActive: levelPrice.isActive,
                isValid: levelPrice.isValid,
                validFrom: levelPrice.validFrom || "-",
                validUntil: levelPrice.validUntil || "-",
                createdAt: levelPrice.createdAt,
                updatedAt: levelPrice.updatedAt,
            },
        }),
        []
    );

    // Fetch level prices list
    const {
        data: levelPricesResponse,
        isLoading: isLevelPricesLoading,
        error: levelPricesError,
        refetch,
    } = useLevelPricesForLevel(selectedLevelId);

    const levelPrices = levelPricesResponse?.items ?? [];

    // Transform level prices to table data
    const tableData: TableData[] = useMemo(
        () => levelPrices.map(transformLevelPriceToTableData),
        [levelPrices, transformLevelPriceToTableData]
    );

    const handleRowClick = useCallback(
        (rowId: string) => {
            navigate(salesPaths.priceLists.view(rowId));
        },
        [navigate]
    );

    const handleEdit = useCallback(
        (rowId: string) => {
            navigate(salesPaths.priceLists.edit(rowId));
        },
        [navigate]
    );

    const { mutateAsync: deleteMutateAsync, isPending: isDeleting } =
        useDeleteLevelPrice();
    const { execute } = useMutationHandler();

    const handleDelete = useCallback((rowId: string) => {
        setPriceListToDelete(rowId);
        setDeleteDialogOpen(true);
    }, []);

    const handleConfirmDelete = useCallback(() => {
        if (!priceListToDelete) return;

        execute(() => deleteMutateAsync(priceListToDelete), {
            successMessage: t(
                "priceLists.messages.deleteSuccess",
                "Price list deleted successfully"
            ),
            onSuccess: () => {
                refetch();
                setDeleteDialogOpen(false);
                setPriceListToDelete(null);
            },
        });
    }, [deleteMutateAsync, execute, priceListToDelete, refetch, t]);

    const handleCancelDelete = useCallback(() => {
        setDeleteDialogOpen(false);
        setPriceListToDelete(null);
    }, []);

    const handleLevelChange = useCallback((levelIds: string[]) => {
        setSelectedLevelId(levelIds[0]);
    }, []);

    const columns: TableColumn[] = useMemo(
        () => [
            {
                id: "id",
                header: t("priceLists.table.id", "ID"),
                accessorKey: "id",
                sortable: true,
            },
            {
                id: "name",
                header: t("priceLists.table.name", "Name"),
                accessorKey: "name",
                sortable: true,
            },
            {
                id: "description",
                header: t("priceLists.table.description", "Description"),
                accessorKey: "description",
                sortable: true,
            },
            {
                id: "price",
                header: t("priceLists.table.price", "Price"),
                accessorKey: "price",
                sortable: true,
            },
            {
                id: "groupType",
                header: t("priceLists.table.groupType", "Group Type"),
                accessorKey: "groupType",
                sortable: true,
            },
            {
                id: "originalPrice",
                header: t("priceLists.table.originalPrice", "Original Price"),
                accessorKey: "originalPrice",
                sortable: true,
            },
            {
                id: "maxInstallments",
                header: t(
                    "priceLists.table.maxInstallments",
                    "Max Installments"
                ),
                accessorKey: "maxInstallments",
                sortable: true,
            },
            {
                id: "isDefault",
                header: t("priceLists.table.isDefault", "Default"),
                accessorKey: "isDefault",
                sortable: true,
                cell: ({ row }) => (
                    <span
                        className={
                            row.columns.isDefault
                                ? "text-green-600"
                                : "text-gray-400"
                        }
                    >
                        {row.columns.isDefault
                            ? t("common.yes", "Yes")
                            : t("common.no", "No")}
                    </span>
                ),
            },
            {
                id: "isActive",
                header: t("priceLists.table.isActive", "Active"),
                accessorKey: "isActive",
                sortable: true,
                cell: ({ row }) => (
                    <span
                        className={
                            row.columns.isActive
                                ? "text-green-600"
                                : "text-gray-400"
                        }
                    >
                        {row.columns.isActive
                            ? t("common.yes", "Yes")
                            : t("common.no", "No")}
                    </span>
                ),
            },
            {
                id: "isValid",
                header: t("priceLists.table.isValid", "Valid"),
                accessorKey: "isValid",
                sortable: true,
                cell: ({ row }) => (
                    <span
                        className={
                            row.columns.isValid
                                ? "text-green-600"
                                : "text-red-500"
                        }
                    >
                        {row.columns.isValid
                            ? t("common.yes", "Yes")
                            : t("common.no", "No")}
                    </span>
                ),
            },
            {
                id: "validFrom",
                header: t("priceLists.table.validFrom", "Valid From"),
                accessorKey: "validFrom",
                sortable: true,
            },
            {
                id: "validUntil",
                header: t("priceLists.table.validUntil", "Valid Until"),
                accessorKey: "validUntil",
                sortable: true,
            },
            {
                id: "createdAt",
                header: t("priceLists.table.createdAt", "Created At"),
                accessorKey: "createdAt",
                sortable: true,
            },
            {
                id: "updatedAt",
                header: t("priceLists.table.updatedAt", "Updated At"),
                accessorKey: "updatedAt",
                sortable: true,
            },
            {
                id: "actions",
                header: t("priceLists.table.actions", "Actions"),
                accessorKey: "actions",
                sortable: false,
                cell: ({ row }) => (
                    <div className="flex items-center gap-2">
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                navigate(salesPaths.priceLists.view(row.id));
                            }}
                            className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            title={t(
                                "priceLists.actions.viewDetails",
                                "View Details"
                            )}
                        >
                            <Eye className="w-4 h-4" />
                        </button>
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                handleEdit(row.id);
                            }}
                            className="p-2 text-gray-600 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                            title={t("priceLists.actions.edit", "Edit")}
                        >
                            <Edit className="w-4 h-4" />
                        </button>
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                handleDelete(row.id);
                            }}
                            className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            title={t("priceLists.actions.delete", "Delete")}
                        >
                            <Trash2 className="w-4 h-4" />
                        </button>
                    </div>
                ),
            },
        ],
        [handleEdit, handleDelete, navigate, t]
    );

    // Loading state
    if (isLevelPricesLoading) {
        return <LoadingState />;
    }

    // Error state
    if (levelPricesError) {
        return (
            <ErrorState
                message={
                    levelPricesError?.message ||
                    t("errors.fetchFailed", "Failed to load data")
                }
                onRetry={refetch}
            />
        );
    }

    return (
        <PageWrapper
            pageHeaderProps={{
                title: t("priceLists.title", "Level Price List"),
                subtitle: t(
                    "priceLists.subtitle",
                    "Explore the pricing plans for all available courses and learning tracks."
                ),
                actions: (
                    <button
                        onClick={() => navigate(salesPaths.priceLists.create())}
                        className="inline-flex items-center gap-2 px-4 py-2.5 bg-brand-500 text-white text-sm font-medium rounded-lg hover:bg-brand-600 transition-colors"
                    >
                        <Plus className="w-4 h-4" />
                        {t("priceLists.actions.addNewLevel", "Add New Level")}
                    </button>
                ),
            }}
        >
            <div className="space-y-3">
                <h3 className="text-gray-900 mb-2">
                    {t("priceLists.filters.title", "Filter by Levels")}
                </h3>
                <LevelMultiSelect
                    selectedIds={selectedLevelId!}
                    mode="single"
                    onChange={handleLevelChange}
                    placeholder={t(
                        "coupons.form.fields.levels.placeholder",
                        "You can choose one level, multiple levels, or select all."
                    )}
                />
                <p className="text-xs text-gray-600">
                    {t(
                        "priceLists.filters.description",
                        "Select one or more levels to filter the price lists below."
                    )}
                </p>
            </div>

            <h3 className="text-xl font-bold text-gray-900 mb-5">
                {t("priceLists.table.pricingPlans", "Pricing Plans")}
            </h3>

            {/* Table */}
            <DynamicTable
                data={tableData}
                columns={columns}
                title={t("priceLists.table.pricingPlans", "Pricing Plans")}
                onRowClick={handleRowClick}
                totalCount={levelPrices.length}
                onAddClick={() => navigate(salesPaths.priceLists.create())}
                addLabel={t("priceLists.actions.addNewLevel", "Add New Level")}
                hideHeader
                hideToolbar
                noPadding
            />

            {/* Empty State */}
            {levelPrices.length === 0 && !isLevelPricesLoading && (
                <EmptyState
                    title={t(
                        "priceLists.emptyState.title",
                        "No price lists found"
                    )}
                    message={t(
                        "priceLists.emptyState.message",
                        "Get started by creating your first price list."
                    )}
                    action={{
                        label: t(
                            "priceLists.emptyState.createPriceList",
                            "Create Price List"
                        ),
                        onClick: () => navigate(salesPaths.priceLists.create()),
                    }}
                />
            )}

            {/* Delete Confirmation Dialog */}
            <ConfirmDialog
                isOpen={deleteDialogOpen}
                onClose={handleCancelDelete}
                variant="danger"
                title={t("priceLists.deleteDialog.title", "Delete Price List")}
                message={t(
                    "priceLists.deleteDialog.message",
                    "Are you sure you want to delete this price list? This action cannot be undone."
                )}
                confirmText={t("common.delete", "Delete")}
                cancelText={t("common.cancel", "Cancel")}
                onConfirm={handleConfirmDelete}
                loading={isDeleting}
            />
        </PageWrapper>
    );
}
