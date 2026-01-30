/**
 * Level Price Detail Page
 *
 * Page for viewing detailed information about a level price.
 */

import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Edit, Trash2 } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { useLevelPrice, useDeleteLevelPrice } from "../api";
import { LoadingState, ErrorState, ConfirmDialog } from "@/design-system";
import { salesPaths } from "../../../navigation/paths";
import PageWrapper from "@/design-system/components/PageWrapper";
import { useMutationHandler } from "@/shared/api";

export default function PriceListDetail() {
    const { t } = useTranslation("sales_subscription");
    const navigate = useNavigate();
    const { id } = useParams<{ id: string }>();
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

    // Get level price data
    const { data: levelPrice, isLoading, error } = useLevelPrice(id);

    // Mutation
    const { mutateAsync: deleteMutateAsync, isPending: isDeleting } =
        useDeleteLevelPrice();
    const { execute } = useMutationHandler();

    // Handle delete
    const handleDelete = () => {
        setDeleteDialogOpen(true);
    };

    const handleConfirmDelete = () => {
        execute(() => deleteMutateAsync(id!), {
            successMessage: t(
                "priceLists.messages.deleteSuccess",
                "Level price deleted successfully"
            ),
            onSuccess: () => navigate(salesPaths.priceLists.list()),
        });
    };

    const handleCancelDelete = () => {
        setDeleteDialogOpen(false);
    };

    // Handle edit
    const handleEdit = () => {
        navigate(salesPaths.priceLists.edit(id!));
    };

    // Loading state
    if (isLoading) {
        return <LoadingState />;
    }

    // Error state
    if (error || !levelPrice) {
        return (
            <ErrorState
                message={error?.message || "Level price not found"}
                onRetry={() => window.location.reload()}
            />
        );
    }

    return (
        <PageWrapper
            pageHeaderProps={{
                backButton: true,
                title: levelPrice.name,
                subtitle: "Level price details and configuration",
                actions: (
                    <div className="flex justify-end gap-4">
                        <Button
                            variant="outline"
                            onClick={handleEdit}
                            className="flex items-center gap-2"
                        >
                            <Edit className="h-4 w-4" />
                            Edit
                        </Button>
                        <Button
                            variant="destructive"
                            onClick={handleDelete}
                            disabled={isDeleting}
                            isLoading={isDeleting}
                            className="flex items-center gap-2"
                        >
                            <Trash2 className="h-4 w-4" />
                            Delete
                        </Button>
                    </div>
                ),
            }}
        >
            {/* Details Card */}
            <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Left Column - Basic Info */}
                    <div className="space-y-6">
                        <div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">
                                Basic Information
                            </h3>
                            <dl className="space-y-4">
                                <div>
                                    <dt className="text-sm font-medium text-gray-500">
                                        ID
                                    </dt>
                                    <dd className="text-lg text-gray-900">
                                        {levelPrice.id}
                                    </dd>
                                </div>
                                <div>
                                    <dt className="text-sm font-medium text-gray-500">
                                        Name
                                    </dt>
                                    <dd className="text-lg text-gray-900">
                                        {levelPrice.name}
                                    </dd>
                                </div>
                                <div>
                                    <dt className="text-sm font-medium text-gray-500">
                                        Description
                                    </dt>
                                    <dd className="text-gray-700">
                                        {levelPrice.description || "-"}
                                    </dd>
                                </div>
                                <div>
                                    <dt className="text-sm font-medium text-gray-500">
                                        Group Type
                                    </dt>
                                    <dd className="text-lg text-gray-900 capitalize">
                                        {levelPrice.groupType}
                                    </dd>
                                </div>
                                <div>
                                    <dt className="text-sm font-medium text-gray-500">
                                        Status
                                    </dt>
                                    <dd>
                                        <span
                                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                                levelPrice.isActive
                                                    ? "bg-green-100 text-green-800"
                                                    : "bg-red-100 text-red-800"
                                            }`}
                                        >
                                            {levelPrice.isActive
                                                ? "Active"
                                                : "Inactive"}
                                        </span>
                                    </dd>
                                </div>
                                <div>
                                    <dt className="text-sm font-medium text-gray-500">
                                        Default Plan
                                    </dt>
                                    <dd>
                                        <span
                                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                                levelPrice.isDefault
                                                    ? "bg-blue-100 text-blue-800"
                                                    : "bg-gray-100 text-gray-800"
                                            }`}
                                        >
                                            {levelPrice.isDefault
                                                ? "Default"
                                                : "Regular"}
                                        </span>
                                    </dd>
                                </div>
                                <div>
                                    <dt className="text-sm font-medium text-gray-500">
                                        Valid
                                    </dt>
                                    <dd>
                                        <span
                                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                                levelPrice.isValid
                                                    ? "bg-green-100 text-green-800"
                                                    : "bg-red-100 text-red-800"
                                            }`}
                                        >
                                            {levelPrice.isValid
                                                ? "Valid"
                                                : "Invalid"}
                                        </span>
                                    </dd>
                                </div>
                            </dl>
                        </div>
                    </div>

                    {/* Right Column - Pricing */}
                    <div className="space-y-6">
                        <div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">
                                Pricing Details
                            </h3>
                            <dl className="space-y-4">
                                <div>
                                    <dt className="text-sm font-medium text-gray-500">
                                        Price
                                    </dt>
                                    <dd className="text-2xl font-bold text-green-600">
                                        $
                                        {parseFloat(levelPrice.price).toFixed(
                                            2
                                        )}
                                    </dd>
                                </div>
                                <div>
                                    <dt className="text-sm font-medium text-gray-500">
                                        Original Price
                                    </dt>
                                    <dd className="text-2xl font-bold text-gray-900">
                                        $
                                        {parseFloat(
                                            levelPrice.originalPrice
                                        ).toFixed(2)}
                                    </dd>
                                </div>
                                {parseFloat(levelPrice.originalPrice) >
                                    parseFloat(levelPrice.price) && (
                                    <div>
                                        <dt className="text-sm font-medium text-gray-500">
                                            Discount
                                        </dt>
                                        <dd className="text-lg font-semibold text-green-600">
                                            $
                                            {(
                                                parseFloat(
                                                    levelPrice.originalPrice
                                                ) - parseFloat(levelPrice.price)
                                            ).toFixed(2)}{" "}
                                            (
                                            {Math.round(
                                                ((parseFloat(
                                                    levelPrice.originalPrice
                                                ) -
                                                    parseFloat(
                                                        levelPrice.price
                                                    )) /
                                                    parseFloat(
                                                        levelPrice.originalPrice
                                                    )) *
                                                    100
                                            )}
                                            %)
                                        </dd>
                                    </div>
                                )}
                                <div>
                                    <dt className="text-sm font-medium text-gray-500">
                                        Max Installments
                                    </dt>
                                    <dd className="text-lg text-gray-900">
                                        {levelPrice.maxInstallments}
                                    </dd>
                                </div>
                            </dl>
                        </div>
                    </div>
                </div>

                {/* Validity Period */}
                <div className="mt-8 pt-8 border-t border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">
                        Validity Period
                    </h3>
                    <dl className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <dt className="text-sm font-medium text-gray-500">
                                Valid From
                            </dt>
                            <dd className="text-lg text-gray-900">
                                {levelPrice.validFrom || "-"}
                            </dd>
                        </div>
                        <div>
                            <dt className="text-sm font-medium text-gray-500">
                                Valid Until
                            </dt>
                            <dd className="text-lg text-gray-900">
                                {levelPrice.validUntil || "-"}
                            </dd>
                        </div>
                    </dl>
                </div>

                {/* Timestamps */}
                <div className="mt-8 pt-8 border-t border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">
                        Timestamps
                    </h3>
                    <dl className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <dt className="text-sm font-medium text-gray-500">
                                Created At
                            </dt>
                            <dd className="text-sm text-gray-600">
                                {levelPrice.createdAt}
                            </dd>
                        </div>
                        <div>
                            <dt className="text-sm font-medium text-gray-500">
                                Updated At
                            </dt>
                            <dd className="text-sm text-gray-600">
                                {levelPrice.updatedAt}
                            </dd>
                        </div>
                    </dl>
                </div>
            </div>

            {/* Delete Confirmation Dialog */}
            <ConfirmDialog
                isOpen={deleteDialogOpen}
                onClose={handleCancelDelete}
                variant="danger"
                title={t("priceLists.deleteDialog.title", "Delete Level Price")}
                message={t(
                    "priceLists.deleteDialog.message",
                    "Are you sure you want to delete this level price? This action cannot be undone."
                )}
                confirmText={t("common.delete", "Delete")}
                cancelText={t("common.cancel", "Cancel")}
                onConfirm={handleConfirmDelete}
                loading={isDeleting}
            />
        </PageWrapper>
    );
}
