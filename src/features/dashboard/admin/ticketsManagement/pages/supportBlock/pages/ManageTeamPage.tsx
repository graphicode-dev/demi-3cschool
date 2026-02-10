/**
 * ManageTeamPage Component
 *
 * Page for managing team leads and agents for a specific support block.
 * Displays lead cards and agents table.
 */

import { useState, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate, useParams } from "react-router-dom";
import {
    Plus,
    Search,
    MoreHorizontal,
    Filter,
    Pencil,
    Trash2,
} from "lucide-react";
import {
    PageWrapper,
    useToast,
    ActionsDropdown,
    DropdownAction,
    DynamicTable,
    ConfirmDialog,
    LoadingState,
    ErrorState,
} from "@/design-system";
import Pagination from "@/design-system/components/table/Pagination";
import { supportBlock } from "../navigation/paths";
import {
    useSupportBlock,
    useSupportAgentsByBlock,
    useDeleteSupportAgent,
    useDeleteSupportBlock,
} from "../api";
import type { SupportAgent } from "../types";
import type { TableColumn, TableData } from "@/shared/types";

export function ManageTeamPage() {
    const { t } = useTranslation("ticketsManagement");
    const navigate = useNavigate();
    const { addToast } = useToast();
    const { blockId } = useParams<{ blockId: string }>();

    const [currentPage, setCurrentPage] = useState(1);
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedAgent, setSelectedAgent] = useState<SupportAgent | null>(
        null
    );
    const [showRemoveDialog, setShowRemoveDialog] = useState(false);

    // Fetch block details
    const {
        data: blockData,
        isLoading: blockLoading,
        error: blockError,
    } = useSupportBlock(blockId);

    // Fetch agents for this block
    const {
        data: agentsData,
        isLoading: agentsLoading,
        error: agentsError,
        refetch,
    } = useSupportAgentsByBlock(blockId, currentPage);

    const deleteAgentMutation = useDeleteSupportAgent();
    const deleteBlockMutation = useDeleteSupportBlock();

    const [showDeleteBlockDialog, setShowDeleteBlockDialog] = useState(false);

    const isLoading = blockLoading || agentsLoading;
    const error = blockError || agentsError;

    const statusColors = {
        available:
            "bg-success-50 text-success-600 dark:bg-success-500/15 dark:text-success-400",
        busy: "bg-warning-50 text-warning-600 dark:bg-warning-500/15 dark:text-warning-400",
        offline:
            "bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400",
    };

    // Separate leads and agents from the API response
    const agents = agentsData?.items ?? [];
    const leads = useMemo(
        () => agents.filter((agent) => agent.isLead),
        [agents]
    );
    const regularAgents = useMemo(
        () => agents.filter((agent) => !agent.isLead),
        [agents]
    );

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };

    const handleAddLead = () => {
        navigate(supportBlock.addLead(blockId!));
    };

    const handleEditLead = (agent: SupportAgent) => {
        navigate(supportBlock.editLead(blockId!, String(agent.id)));
    };

    const handleEditBlock = () => {
        navigate(supportBlock.editBlock(blockId!));
    };

    const handleDeleteBlock = () => {
        setShowDeleteBlockDialog(true);
    };

    const handleConfirmDeleteBlock = async () => {
        if (blockId) {
            try {
                await deleteBlockMutation.mutateAsync(blockId);
                addToast({
                    type: "success",
                    title: t(
                        "manageTeam.deleteBlock.success",
                        "Block deleted successfully"
                    ),
                });
                navigate(supportBlock.root());
            } catch (err) {
                addToast({
                    type: "error",
                    title: t(
                        "manageTeam.deleteBlock.error",
                        "Failed to delete block"
                    ),
                });
            }
        }
        setShowDeleteBlockDialog(false);
    };

    const handleRemoveAgent = (agent: SupportAgent) => {
        setSelectedAgent(agent);
        setShowRemoveDialog(true);
    };

    const handleConfirmRemove = async () => {
        if (selectedAgent) {
            try {
                await deleteAgentMutation.mutateAsync(selectedAgent.id);
                addToast({
                    type: "success",
                    title: t(
                        "manageTeam.removeAgent.success",
                        "Agent removed successfully"
                    ),
                });
                setShowRemoveDialog(false);
                setSelectedAgent(null);
            } catch (err) {
                addToast({
                    type: "error",
                    title: t(
                        "manageTeam.removeAgent.error",
                        "Failed to remove agent"
                    ),
                });
            }
        }
    };

    // Agent handlers
    const handleAddAgent = () => {
        navigate(supportBlock.addAgent(blockId!));
    };

    const handleEditAgent = (agentId: string) => {
        navigate(supportBlock.editAgent(blockId!, agentId));
    };

    const handlePromoteAgent = (agentId: string) => {
        navigate(supportBlock.promoteAgentToLead(blockId!, agentId));
    };

    const columns: TableColumn[] = [
        {
            id: "id",
            header: t("manageTeam.table.id"),
            accessorKey: "id",
            sortable: true,
        },
        {
            id: "agentName",
            header: t("manageTeam.table.agentName"),
            accessorKey: "name",
            sortable: true,
        },
        {
            id: "managedBy",
            header: t("manageTeam.table.managedBy"),
            accessorKey: "managedBy",
            sortable: true,
        },
        {
            id: "availability",
            header: t("manageTeam.table.availability"),
            accessorKey: "status",
            sortable: true,
            cell: ({ row }) => (
                <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${
                        statusColors[
                            row.columns.status as keyof typeof statusColors
                        ]
                    }`}
                >
                    {t(`supportBlock.status.${row.columns.status}`)}
                </span>
            ),
        },
        {
            id: "action",
            header: t("manageTeam.table.action"),
            accessorKey: "action",
            sortable: false,
            cell: ({ row }) => {
                const agent = regularAgents.find(
                    (a) => String(a.id) === row.id
                );
                const agentActions: DropdownAction[] = [
                    {
                        id: "edit",
                        label: t("manageTeam.actions.edit"),
                        onClick: () => handleEditAgent(row.id),
                    },
                    {
                        id: "promote",
                        label: t("manageTeam.actions.reAssign"),
                        onClick: () => handlePromoteAgent(row.id),
                    },
                    {
                        id: "remove",
                        label: t("manageTeam.actions.remove"),
                        onClick: () => {
                            if (agent) handleRemoveAgent(agent);
                        },
                        className:
                            "text-error-600 dark:text-error-400 hover:bg-gray-100 dark:hover:bg-gray-700",
                    },
                ];
                return (
                    <ActionsDropdown
                        itemId={row.id}
                        actions={agentActions}
                        triggerIcon={
                            <MoreHorizontal className="w-4 h-4 text-gray-500" />
                        }
                    />
                );
            },
        },
    ];

    const tableData: TableData[] = regularAgents.map((agent, index) => ({
        id: String(agent.id),
        columns: {
            id: index + 1,
            name: agent.user.name,
            managedBy: agent.lead?.name || "-",
            status: agent.status,
            action: "",
        },
    }));

    const filteredAgents = searchQuery
        ? tableData.filter((agent) =>
              String(agent.columns.name)
                  .toLowerCase()
                  .includes(searchQuery.toLowerCase())
          )
        : tableData;

    if (isLoading) {
        return <LoadingState />;
    }

    if (error) {
        return (
            <ErrorState
                title={t("supportBlock.error", "Error loading data")}
                message={
                    (error as Error)?.message ||
                    t("supportBlock.unknownError", "Unknown error")
                }
                onRetry={() => refetch()}
            />
        );
    }

    return (
        <PageWrapper
            pageHeaderProps={{
                title: blockData?.name
                    ? t("manageTeam.pageTitleWithBlock", {
                          blockName: blockData.name,
                          defaultValue: `Manage Team - ${blockData.name}`,
                      })
                    : t("manageTeam.pageTitle"),
                subtitle: t("manageTeam.pageSubtitle"),
                backButton: true,
                actions: (
                    <div className="flex items-center gap-2">
                        <button
                            onClick={handleEditBlock}
                            className="inline-flex items-center gap-2 px-4 py-2.5 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg text-sm font-medium transition-colors"
                        >
                            <Pencil className="w-4 h-4" />
                            {t("manageTeam.editBlock", "Edit Block")}
                        </button>
                        <button
                            onClick={handleDeleteBlock}
                            className="inline-flex items-center gap-2 px-4 py-2.5 bg-error-500 hover:bg-error-600 text-white rounded-lg text-sm font-medium transition-colors"
                        >
                            <Trash2 className="w-4 h-4" />
                            {t("manageTeam.deleteBlock", "Delete Block")}
                        </button>
                    </div>
                ),
            }}
        >
            {/* Team Leads Section */}
            <div>
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                        {t("manageTeam.teamLeads")}
                    </h2>
                    <button
                        onClick={handleAddLead}
                        className="inline-flex items-center gap-2 px-4 py-2.5 bg-brand-500 hover:bg-brand-600 text-white rounded-lg text-sm font-medium transition-colors"
                    >
                        <Plus className="w-4 h-4" />
                        {t("manageTeam.addLeadBtn")}
                    </button>
                </div>

                {/* Lead Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {leads.length === 0 ? (
                        <div className="col-span-full text-center py-8 text-gray-500 dark:text-gray-400">
                            {t("manageTeam.noLeads", "No leads found")}
                        </div>
                    ) : (
                        leads.map((lead) => (
                            <div
                                key={lead.id}
                                className="relative flex flex-col gap-3 p-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl"
                            >
                                <div className="flex items-start justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="relative">
                                            <div className="w-10 h-10 rounded-full bg-brand-100 dark:bg-brand-900/30 flex items-center justify-center text-brand-600 dark:text-brand-400 font-medium text-sm">
                                                {lead.user.name
                                                    .split(" ")
                                                    .map((n) => n[0])
                                                    .join("")
                                                    .toUpperCase()
                                                    .slice(0, 2)}
                                            </div>
                                            <div
                                                className={`absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full border-2 border-white dark:border-gray-800 ${
                                                    lead.status === "available"
                                                        ? "bg-success-500"
                                                        : lead.status === "busy"
                                                          ? "bg-warning-500"
                                                          : "bg-gray-400"
                                                }`}
                                            />
                                        </div>
                                        <div>
                                            <span className="font-semibold text-gray-900 dark:text-white text-sm">
                                                {lead.user.name}
                                            </span>
                                            <p className="text-xs text-gray-500 dark:text-gray-400">
                                                {lead.user.email}
                                            </p>
                                        </div>
                                    </div>
                                    <ActionsDropdown
                                        itemId={String(lead.id)}
                                        actions={[
                                            {
                                                id: "edit",
                                                label: t(
                                                    "manageTeam.actions.edit"
                                                ),
                                                onClick: () =>
                                                    handleEditLead(lead),
                                            },
                                            {
                                                id: "remove",
                                                label: t(
                                                    "manageTeam.actions.remove"
                                                ),
                                                onClick: () =>
                                                    handleRemoveAgent(lead),
                                                className:
                                                    "text-error-600 dark:text-error-400 hover:bg-gray-100 dark:hover:bg-gray-700",
                                            },
                                        ]}
                                        triggerIcon={
                                            <MoreHorizontal className="w-4 h-4 text-gray-400" />
                                        }
                                        triggerClassName="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
                                    />
                                </div>
                                <div className="pt-2 border-t border-gray-100 dark:border-gray-700">
                                    <span
                                        className={`px-2 py-0.5 rounded-full text-xs font-medium ${statusColors[lead.status]}`}
                                    >
                                        {t(
                                            `supportBlock.status.${lead.status}`
                                        )}
                                    </span>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>

            {/* Team Agents Section */}
            <div className="mt-10">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                        {t("manageTeam.teamAgents")}
                    </h2>
                    <button
                        onClick={handleAddAgent}
                        className="inline-flex items-center gap-2 px-4 py-2.5 bg-brand-500 hover:bg-brand-600 text-white rounded-lg text-sm font-medium transition-colors"
                    >
                        <Plus className="w-4 h-4" />
                        {t("manageTeam.addAgentsBtn")}
                    </button>
                </div>

                {/* Search and Filter */}
                <div className="flex items-center gap-4 mb-6">
                    <div className="relative flex-1 max-w-md">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                            type="text"
                            placeholder={t("manageTeam.searchAgents")}
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-10 pr-4 py-2.5 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
                        />
                    </div>
                    <button className="p-2.5 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                        <Filter className="w-4 h-4 text-gray-500" />
                    </button>
                </div>

                {/* Agents Table */}
                <DynamicTable
                    data={filteredAgents}
                    columns={columns}
                    hideBorder
                    hideHeader
                    hideToolbar
                    noPadding
                    disableRowClick
                />

                {/* Pagination */}
                {agentsData && agentsData.lastPage > 1 && (
                    <div className="mt-6">
                        <Pagination
                            currentPage={agentsData.currentPage}
                            totalPages={agentsData.lastPage}
                            goToNextPage={() =>
                                handlePageChange(currentPage + 1)
                            }
                            goToPreviousPage={() =>
                                handlePageChange(currentPage - 1)
                            }
                            setPage={handlePageChange}
                            itemsPerPage={agentsData.perPage}
                            totalItems={
                                agentsData.lastPage * agentsData.perPage
                            }
                        />
                    </div>
                )}
            </div>

            {/* Remove Agent Dialog */}
            <ConfirmDialog
                isOpen={showRemoveDialog}
                onClose={() => {
                    setShowRemoveDialog(false);
                    setSelectedAgent(null);
                }}
                title={t("manageTeam.removeAgent.title", "Remove Agent")}
                variant="danger"
                message={
                    <p
                        dangerouslySetInnerHTML={{
                            __html: t("manageTeam.removeAgent.message", {
                                name: selectedAgent?.user.name || "",
                                defaultValue: `Are you sure you want to remove <strong>${selectedAgent?.user.name || ""}</strong>?`,
                            }),
                        }}
                    />
                }
                confirmText={t("manageTeam.removeAgent.confirm", "Remove")}
                cancelText={t("manageTeam.removeAgent.cancel", "Cancel")}
                onConfirm={handleConfirmRemove}
            />

            {/* Delete Block Dialog */}
            <ConfirmDialog
                isOpen={showDeleteBlockDialog}
                onClose={() => setShowDeleteBlockDialog(false)}
                title={t("manageTeam.deleteBlock.title", "Delete Block")}
                variant="danger"
                message={
                    <p
                        dangerouslySetInnerHTML={{
                            __html: t("manageTeam.deleteBlock.message", {
                                name: blockData?.name || "",
                                defaultValue: `Are you sure you want to delete <strong>${blockData?.name || ""}</strong>? This action cannot be undone.`,
                            }),
                        }}
                    />
                }
                confirmText={t("manageTeam.deleteBlock.confirm", "Delete")}
                cancelText={t("manageTeam.deleteBlock.cancel", "Cancel")}
                onConfirm={handleConfirmDeleteBlock}
            />
        </PageWrapper>
    );
}

export default ManageTeamPage;
