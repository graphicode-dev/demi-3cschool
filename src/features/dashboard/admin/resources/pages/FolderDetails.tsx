/**
 * FolderDetails Page
 *
 * Page for viewing folder contents with resource table and type tabs.
 */

import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
    Plus,
    Video,
    FileText,
    Image,
    Music,
    Eye,
    Pencil,
    Trash2,
} from "lucide-react";
import {
    PageWrapper,
    EmptyState,
    LoadingState,
    ConfirmDialog,
} from "@/design-system";
import { useFolder } from "../api/folders";
import { useResourcesList, useDeleteResource } from "../api/resources";
import { ResourcePreviewModal } from "../components/ResourcePreviewModal";
import type { Resource, ResourceType } from "../types";

type TabType = "all" | ResourceType;

const TABS: { key: TabType; icon: React.ElementType; labelKey: string }[] = [
    { key: "all", icon: FileText, labelKey: "tabs.all" },
    { key: "video", icon: Video, labelKey: "tabs.videos" },
    { key: "file", icon: FileText, labelKey: "tabs.files" },
    { key: "image", icon: Image, labelKey: "tabs.images" },
    { key: "audio", icon: Music, labelKey: "tabs.audio" },
];

const TYPE_COLORS: Record<ResourceType, string> = {
    video: "bg-amber-100 text-amber-700",
    file: "bg-brand-100 text-brand-700",
    image: "bg-success-100 text-success-700",
    audio: "bg-purple-100 text-purple-700",
};

export function FolderDetails() {
    const { t } = useTranslation("adminResources");
    const navigate = useNavigate();
    const { folderId } = useParams<{ folderId: string }>();
    const [activeTab, setActiveTab] = useState<TabType>("all");
    const [page, setPage] = useState<number>(1);
    const [selectedResource, setSelectedResource] = useState<Resource | null>(
        null
    );
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);
    const [showPreviewModal, setShowPreviewModal] = useState(false);

    useEffect(() => {
        setPage(1);
    }, [activeTab, folderId]);

    const numericFolderId = folderId ? Number(folderId) : undefined;

    const { data: folder, isLoading: folderLoading } = useFolder(
        folderId || ""
    );
    const { data: resourcesPage, isLoading: resourcesLoading } =
        useResourcesList(
            {
                folderId: numericFolderId || "",
                type: activeTab,
                page,
            },
            !!numericFolderId
        );

    const resources = resourcesPage?.items ?? [];
    const currentPage = resourcesPage?.currentPage ?? page;
    const lastPage = resourcesPage?.lastPage ?? 1;

    const deleteResource = useDeleteResource();

    const handleAddResource = () => {
        navigate(`/admin/resources/folder/${folderId}/resource/create`);
    };

    const handleView = (resource: Resource) => {
        setSelectedResource(resource);
        setShowPreviewModal(true);
    };

    const handleEdit = (resource: Resource) => {
        navigate(
            `/admin/resources/folder/${folderId}/resource/${resource.id}/edit`
        );
    };

    const handleDelete = (resource: Resource) => {
        setSelectedResource(resource);
        setShowDeleteDialog(true);
    };

    const confirmDelete = async () => {
        if (selectedResource) {
            await deleteResource.mutateAsync(selectedResource.id);
            setShowDeleteDialog(false);
            setSelectedResource(null);
        }
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
        });
    };

    const isLoading = folderLoading || resourcesLoading;

    if (isLoading && !folder) {
        return (
            <PageWrapper pageHeaderProps={{ title: "Loading..." }}>
                <LoadingState />
            </PageWrapper>
        );
    }

    return (
        <PageWrapper
            pageHeaderProps={{
                title: folder?.name || "",
                actions: (
                    <button
                        onClick={handleAddResource}
                        className="flex items-center gap-2 px-4 py-2.5 bg-brand-500 text-white rounded-lg hover:bg-brand-600 transition-colors text-sm font-medium"
                    >
                        <Plus className="size-4" />
                        {t("resource.add")}
                    </button>
                ),
            }}
        >
            {/* Tabs */}
            <div className="flex items-center gap-2 mb-6 flex-wrap">
                {TABS.map((tab) => {
                    const Icon = tab.icon;
                    const isActive = activeTab === tab.key;
                    return (
                        <button
                            key={tab.key}
                            onClick={() => setActiveTab(tab.key)}
                            className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                                isActive
                                    ? "bg-brand-500 text-white"
                                    : "bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700"
                            }`}
                        >
                            <Icon className="size-4" />
                            {t(tab.labelKey)}
                        </button>
                    );
                })}
            </div>

            {/* Content */}
            {resourcesLoading ? (
                <LoadingState />
            ) : resources.length === 0 ? (
                <div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-12">
                    <EmptyState
                        title={t("empty.title")}
                        message={
                            activeTab === "all"
                                ? t("empty.allDescription")
                                : t("empty.description", {
                                      type: t(`tabs.${activeTab}s`),
                                  })
                        }
                    />
                </div>
            ) : (
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
                    {/* Table */}
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="bg-gray-50 dark:bg-gray-900/50 border-b border-gray-200 dark:border-gray-700">
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider w-12">
                                        {t("table.id")}
                                    </th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                        {t("table.resourceName")}
                                    </th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider w-24">
                                        {t("table.type")}
                                    </th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider w-32">
                                        {t("table.uploadDate")}
                                    </th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider w-32">
                                        {t("table.action")}
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                                {resources.map((resource, index) => (
                                    <tr
                                        key={resource.id}
                                        className={`hover:bg-gray-50 dark:hover:bg-gray-700/50 ${
                                            index === 0
                                                ? "bg-brand-50/50 dark:bg-brand-900/10"
                                                : ""
                                        }`}
                                    >
                                        <td className="px-4 py-3">
                                            <div className="flex items-center gap-2">
                                                <input
                                                    type="checkbox"
                                                    className="size-4 rounded border-gray-300 text-brand-500 focus:ring-brand-500"
                                                />
                                                <span className="text-sm text-gray-600 dark:text-gray-400">
                                                    {index + 1}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-4 py-3">
                                            <div className="flex items-center gap-3">
                                                <ResourceIcon
                                                    type={resource.type}
                                                />
                                                <span className="text-sm font-medium text-gray-900 dark:text-white">
                                                    {resource.title}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-4 py-3">
                                            <span
                                                className={`inline-flex px-2 py-1 text-xs font-medium rounded ${
                                                    TYPE_COLORS[resource.type]
                                                }`}
                                            >
                                                {t(`types.${resource.type}`)}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400">
                                            {formatDate(resource.uploadedAt)}
                                        </td>
                                        <td className="px-4 py-3">
                                            <div className="flex items-center gap-1">
                                                <button
                                                    onClick={() =>
                                                        handleView(resource)
                                                    }
                                                    className="p-1.5 text-brand-500 hover:bg-brand-50 dark:hover:bg-brand-900/20 rounded transition-colors"
                                                    title="View"
                                                >
                                                    <Eye className="size-4" />
                                                </button>
                                                <button
                                                    onClick={() =>
                                                        handleEdit(resource)
                                                    }
                                                    className="p-1.5 text-brand-500 hover:bg-brand-50 dark:hover:bg-brand-900/20 rounded transition-colors"
                                                    title="Edit"
                                                >
                                                    <Pencil className="size-4" />
                                                </button>
                                                <button
                                                    onClick={() =>
                                                        handleDelete(resource)
                                                    }
                                                    className="p-1.5 text-error-500 hover:bg-error-50 dark:hover:bg-error-900/20 rounded transition-colors"
                                                    title="Delete"
                                                >
                                                    <Trash2 className="size-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* Pagination */}
            {lastPage > 1 && (
                <div className="flex items-center justify-between mt-6">
                    <button
                        type="button"
                        onClick={() => setPage((p) => Math.max(1, p - 1))}
                        disabled={currentPage <= 1}
                        className="px-4 py-2 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {t("pagination.prev")}
                    </button>
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                        {t("pagination.page")} {currentPage}{" "}
                        {t("pagination.of")} {lastPage}
                    </span>
                    <button
                        type="button"
                        onClick={() =>
                            setPage((p) => Math.min(lastPage, p + 1))
                        }
                        disabled={currentPage >= lastPage}
                        className="px-4 py-2 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {t("pagination.next")}
                    </button>
                </div>
            )}

            {/* Delete Confirmation Dialog */}
            <ConfirmDialog
                isOpen={showDeleteDialog}
                onClose={() => setShowDeleteDialog(false)}
                title={t("resource.deleteConfirmTitle")}
                message={t("resource.deleteConfirmMessage")}
                variant="danger"
                confirmText={t("resource.confirmDelete")}
                cancelText={t("resource.cancel")}
                onConfirm={confirmDelete}
                loading={deleteResource.isPending}
            />

            {/* Resource Preview Modal */}
            {selectedResource && (
                <ResourcePreviewModal
                    isOpen={showPreviewModal}
                    onClose={() => {
                        setShowPreviewModal(false);
                        setSelectedResource(null);
                    }}
                    resource={selectedResource}
                />
            )}
        </PageWrapper>
    );
}

function ResourceIcon({ type }: { type: ResourceType }) {
    const iconClass = "size-5";
    const containerClass = "p-1.5 rounded";

    switch (type) {
        case "video":
            return (
                <div
                    className={`${containerClass} bg-amber-100 text-amber-600`}
                >
                    <Video className={iconClass} />
                </div>
            );
        case "file":
            return (
                <div
                    className={`${containerClass} bg-brand-100 text-brand-600`}
                >
                    <FileText className={iconClass} />
                </div>
            );
        case "image":
            return (
                <div
                    className={`${containerClass} bg-success-100 text-success-600`}
                >
                    <Image className={iconClass} />
                </div>
            );
        case "audio":
            return (
                <div
                    className={`${containerClass} bg-purple-100 text-purple-600`}
                >
                    <Music className={iconClass} />
                </div>
            );
    }
}

export default FolderDetails;
