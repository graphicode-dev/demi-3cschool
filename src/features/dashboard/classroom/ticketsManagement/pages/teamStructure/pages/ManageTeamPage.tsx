/**
 * ManageTeamPage Component
 *
 * Main page for managing team leads and agents.
 * Displays lead cards and agents table.
 */

import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { Plus, Search, MoreHorizontal, Filter } from "lucide-react";
import PageWrapper from "@/design-system/components/PageWrapper";
import { DynamicTable } from "@/design-system/components/table";
import { ConfirmDialog } from "@/design-system/components/ConfirmDialog";
import { useToast } from "@/design-system/hooks/useToast";
import { teamStructure } from "../navigation/paths";
import { mockLeads, mockTeamAgents, mockLeads as leadsData } from "../mockData";
import type { Lead, Agent } from "../types";
import type { TableColumn, TableData } from "@/shared/types";
import LeadCard from "../components/LeadCard";
import ActionsDropdown, {
    DropdownAction,
} from "@/design-system/components/ActionsDropdown";

export function ManageTeamPage() {
    const { t } = useTranslation("ticketsManagement");
    const navigate = useNavigate();
    const { addToast } = useToast();

    const [leads] = useState<Lead[]>(mockLeads);
    const [agents] = useState<Agent[]>(mockTeamAgents);
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
    const [selectedAgent, setSelectedAgent] = useState<Agent | null>(null);
    const [showRemoveDialog, setShowRemoveDialog] = useState(false);
    const [showRemoveAgentDialog, setShowRemoveAgentDialog] = useState(false);
    const [reassignLeadId, setReassignLeadId] = useState("");

    const statusColors = {
        available:
            "bg-success-50 text-success-600 dark:bg-success-500/15 dark:text-success-400",
        busy: "bg-warning-50 text-warning-600 dark:bg-warning-500/15 dark:text-warning-400",
        offline:
            "bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400",
    };

    const handleAddLead = () => {
        navigate(teamStructure.addLead());
    };

    const handleEditLead = (lead: Lead) => {
        navigate(teamStructure.editLead(lead.id));
    };

    const handleChangeBlock = (lead: Lead) => {
        navigate(teamStructure.changeLeadBlock(lead.id));
    };

    const handleConvertToAgent = (lead: Lead) => {
        navigate(teamStructure.convertLeadToAgent(lead.id));
    };

    const handleRemoveLead = (lead: Lead) => {
        setSelectedLead(lead);
        setShowRemoveDialog(true);
    };

    const handleConfirmRemove = () => {
        if (selectedLead) {
            addToast({
                type: "success",
                title: t("manageTeam.removeLead.title"),
            });
            setShowRemoveDialog(false);
            setSelectedLead(null);
            setReassignLeadId("");
        }
    };

    // Agent handlers
    const handleAddAgent = () => {
        navigate(teamStructure.addAgent());
    };

    const handleEditAgent = (agent: Agent) => {
        navigate(teamStructure.editAgent(agent.id));
    };

    const handlePromoteAgent = (agent: Agent) => {
        navigate(teamStructure.promoteAgentToLead(agent.id));
    };

    const handleRemoveAgent = (agent: Agent) => {
        setSelectedAgent(agent);
        setShowRemoveAgentDialog(true);
    };

    const handleConfirmRemoveAgent = () => {
        if (selectedAgent) {
            addToast({
                type: "success",
                title: t("manageTeam.removeAgent.title"),
            });
            setShowRemoveAgentDialog(false);
            setSelectedAgent(null);
        }
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
            id: "blockAssignment",
            header: t("manageTeam.table.blockAssignment"),
            accessorKey: "blockName",
            sortable: true,
            cell: ({ row }) => (
                <span className="text-brand-500 hover:underline cursor-pointer">
                    {row.columns.blockName}
                </span>
            ),
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
                    {t(`teamStructure.status.${row.columns.status}`)}
                </span>
            ),
        },
        {
            id: "action",
            header: t("manageTeam.table.action"),
            accessorKey: "action",
            sortable: false,
            cell: ({ row }) => {
                const agentActions: DropdownAction[] = [
                    {
                        id: "edit",
                        label: t("manageTeam.actions.edit"),
                        onClick: () => {
                            const agent = agents.find((a) => a.id === row.id);
                            if (agent) handleEditAgent(agent);
                        },
                    },
                    {
                        id: "promote",
                        label: t("manageTeam.actions.promoteToLead"),
                        onClick: () => {
                            const agent = agents.find((a) => a.id === row.id);
                            if (agent) handlePromoteAgent(agent);
                        },
                    },
                    {
                        id: "remove",
                        label: t("manageTeam.actions.remove"),
                        onClick: () => {
                            const agent = agents.find((a) => a.id === row.id);
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

    const tableData: TableData[] = agents.map((agent, index) => ({
        id: agent.id,
        columns: {
            id: index + 1,
            name: agent.name,
            blockName: agent.blockName || "",
            managedBy: agent.managedBy || "",
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

    return (
        <PageWrapper
            pageHeaderProps={{
                title: t("manageTeam.pageTitle"),
                subtitle: t("manageTeam.pageSubtitle"),
                backButton: true,
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
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3  gap-4">
                    {leads.map((lead) => (
                        <LeadCard
                            key={lead.id}
                            lead={lead}
                            onEdit={() => handleEditLead(lead)}
                            onChangeBlock={() => handleChangeBlock(lead)}
                            onConvert={() => handleConvertToAgent(lead)}
                            onRemove={() => handleRemoveLead(lead)}
                        />
                    ))}
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
            </div>

            {/* Remove Lead Dialog */}
            <ConfirmDialog
                isOpen={showRemoveDialog}
                onClose={() => {
                    setShowRemoveDialog(false);
                    setSelectedLead(null);
                    setReassignLeadId("");
                }}
                title={t("manageTeam.removeLead.title")}
                variant="danger"
                message={
                    <div className="space-y-4">
                        <p
                            dangerouslySetInnerHTML={{
                                __html: t("manageTeam.removeLead.message", {
                                    name: selectedLead?.name || "",
                                }),
                            }}
                        />
                        {selectedLead && selectedLead.agentsCount > 0 && (
                            <div className="p-4 bg-warning-50 dark:bg-warning-500/15 border border-warning-200 dark:border-warning-500/30 rounded-lg">
                                <p className="text-sm font-medium text-warning-700 dark:text-warning-400 mb-1">
                                    {t("manageTeam.removeLead.warningTitle")}
                                </p>
                                <p className="text-sm text-warning-600 dark:text-warning-400/80">
                                    {t("manageTeam.removeLead.warningMessage")}
                                </p>
                            </div>
                        )}
                        {selectedLead && selectedLead.agentsCount > 0 && (
                            <select
                                value={reassignLeadId}
                                onChange={(e) =>
                                    setReassignLeadId(e.target.value)
                                }
                                className="w-full px-4 py-2.5 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
                            >
                                <option value="">
                                    {t(
                                        "manageTeam.removeLead.reassignPlaceholder"
                                    )}
                                </option>
                                {leadsData
                                    .filter((l) => l.id !== selectedLead?.id)
                                    .map((lead) => (
                                        <option key={lead.id} value={lead.id}>
                                            {lead.name}
                                        </option>
                                    ))}
                            </select>
                        )}
                    </div>
                }
                confirmText={t("manageTeam.removeLead.submit")}
                cancelText={t("manageTeam.removeLead.cancel")}
                onConfirm={handleConfirmRemove}
            />

            {/* Remove Agent Dialog */}
            <ConfirmDialog
                isOpen={showRemoveAgentDialog}
                onClose={() => {
                    setShowRemoveAgentDialog(false);
                    setSelectedAgent(null);
                }}
                title={t("manageTeam.removeAgent.title")}
                variant="danger"
                message={
                    <p
                        dangerouslySetInnerHTML={{
                            __html: t("manageTeam.removeAgent.message", {
                                name: selectedAgent?.name || "",
                            }),
                        }}
                    />
                }
                confirmText={t("manageTeam.removeAgent.submit")}
                cancelText={t("manageTeam.removeAgent.cancel")}
                onConfirm={handleConfirmRemoveAgent}
            />
        </PageWrapper>
    );
}

export default ManageTeamPage;
