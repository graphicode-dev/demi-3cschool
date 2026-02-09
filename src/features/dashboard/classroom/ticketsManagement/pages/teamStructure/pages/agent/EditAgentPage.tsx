/**
 * EditAgentPage Component
 *
 * Page for updating agent assignment (block and lead).
 */

import { useState, useEffect, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate, useParams } from "react-router-dom";
import { User } from "lucide-react";
import { PageWrapper, useToast } from "@/design-system";
import { teamStructure } from "../../navigation/paths";
import { getMockAgent, mockBlocks, mockLeads } from "../../mockData";
import type { Agent, AgentStatus } from "../../types";
import { paths } from "@/router";

export function EditAgentPage() {
    const { t } = useTranslation("ticketsManagement");
    const navigate = useNavigate();
    const { id } = useParams<{ id: string }>();
    const { addToast } = useToast();

    const [agent, setAgent] = useState<Agent | null>(null);
    const [selectedBlockId, setSelectedBlockId] = useState("");
    const [selectedLeadId, setSelectedLeadId] = useState("");
    const [status, setStatus] = useState<AgentStatus>("available");

    useEffect(() => {
        if (id) {
            const foundAgent: Agent | undefined = getMockAgent(id);
            if (foundAgent) {
                setAgent(foundAgent);
                setSelectedBlockId(foundAgent.blockId || "");
                setSelectedLeadId(foundAgent.managedBy || "");
                setStatus(foundAgent.status);
            }
        }
    }, [id]);

    const availableLeads = useMemo(() => {
        if (!selectedBlockId) return mockLeads;
        return mockLeads.filter(
            (lead) => lead.assignedBlockId === selectedBlockId
        );
    }, [selectedBlockId]);

    const currentPlacement = useMemo(() => {
        if (!agent) return null;
        const block = mockBlocks.find((b) => b.id === agent.blockId);
        const lead = mockLeads.find((l) => l.id === agent.managedBy);
        return {
            blockName: block?.name || agent.blockName || "",
            leadName: lead?.name || agent.managedBy || "",
        };
    }, [agent]);

    const handleCancel = () => {
        navigate(teamStructure.manageTeam());
    };

    const handleSubmit = () => {
        if (agent && selectedBlockId && selectedLeadId) {
            addToast({
                type: "success",
                title: t("manageTeam.editAgent.successMessage"),
            });
            navigate(teamStructure.manageTeam());
        }
    };

    const isFormValid = selectedBlockId && selectedLeadId;

    if (!agent) {
        return null;
    }

    return (
        <PageWrapper
            pageHeaderProps={{
                title: t("manageTeam.editAgent.pageTitleWithName", {
                    name: agent.name,
                }),
                subtitle: t("manageTeam.editAgent.pageSubtitle"),
                backHref: paths.dashboard.admin.ticketsPaths.teamStructure(),
                backButton: true,
            }}
        >
            <div className="space-y-6">
                {/* Current Placement */}
                {currentPlacement && (
                    <div className="p-4 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg">
                        <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                            {t("manageTeam.editAgent.currentPlacement")}
                        </p>
                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                            {currentPlacement.blockName} •{" "}
                            {currentPlacement.leadName}
                        </p>
                    </div>
                )}

                {/* User Information */}
                <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-900 dark:text-white">
                        {t("manageTeam.editAgent.selectUser")}
                    </label>
                    <div className="flex items-center gap-3 px-4 py-3 border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-900">
                        <div className="w-8 h-8 rounded-full bg-brand-100 dark:bg-brand-900/30 flex items-center justify-center">
                            <User className="w-4 h-4 text-brand-600 dark:text-brand-400" />
                        </div>
                        <span className="text-sm text-gray-900 dark:text-white">
                            {agent.name}
                        </span>
                    </div>
                </div>

                {/* New Block */}
                <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-900 dark:text-white">
                        {t("manageTeam.editAgent.newBlock")}
                    </label>
                    <select
                        value={selectedBlockId}
                        onChange={(e) => {
                            setSelectedBlockId(e.target.value);
                            setSelectedLeadId("");
                        }}
                        className="w-full px-4 py-3 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 appearance-none"
                    >
                        <option value="">
                            {t("manageTeam.addAgent.blockPlaceholder")}
                        </option>
                        {mockBlocks.map((block) => (
                            <option key={block.id} value={block.id}>
                                {block.name}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Assigned To Lead */}
                <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-900 dark:text-white">
                        {t("manageTeam.editAgent.assignedToLead")}
                    </label>
                    <select
                        value={selectedLeadId}
                        onChange={(e) => setSelectedLeadId(e.target.value)}
                        className="w-full px-4 py-3 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 appearance-none"
                    >
                        <option value="">
                            {t("manageTeam.addAgent.leadPlaceholder")}
                        </option>
                        {availableLeads.map((lead) => (
                            <option key={lead.id} value={lead.id}>
                                {lead.name}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Status */}
                <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-900 dark:text-white">
                        {t("manageTeam.editAgent.status")}
                    </label>
                    <div className="flex rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
                        <button
                            type="button"
                            onClick={() => setStatus("available")}
                            className={`flex-1 py-3 text-sm font-medium transition-colors ${
                                status === "available"
                                    ? "bg-success-50 dark:bg-success-500/15 text-success-600 dark:text-success-400 border-r border-gray-200 dark:border-gray-700"
                                    : "bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 border-r border-gray-200 dark:border-gray-700"
                            }`}
                        >
                            {t("teamStructure.status.available")}
                        </button>
                        <button
                            type="button"
                            onClick={() => setStatus("busy")}
                            className={`flex-1 py-3 text-sm font-medium transition-colors ${
                                status === "busy"
                                    ? "bg-warning-50 dark:bg-warning-500/15 text-warning-600 dark:text-warning-400"
                                    : "bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700"
                            }`}
                        >
                            {t("teamStructure.status.busy")}
                        </button>
                    </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-3 pt-4">
                    <button
                        type="button"
                        onClick={handleCancel}
                        className="flex-1 px-4 py-3 border border-gray-200 dark:border-gray-700 rounded-lg text-gray-700 dark:text-gray-300 font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                    >
                        {t("manageTeam.editAgent.cancel")}
                    </button>
                    <button
                        type="button"
                        onClick={handleSubmit}
                        disabled={!isFormValid}
                        className={`flex-1 px-4 py-3 rounded-lg font-medium transition-colors ${
                            isFormValid
                                ? "bg-brand-500 hover:bg-brand-600 text-white"
                                : "bg-gray-100 dark:bg-gray-700 text-gray-400 cursor-not-allowed"
                        }`}
                    >
                        {t("manageTeam.editAgent.submit")}
                    </button>
                </div>
            </div>
        </PageWrapper>
    );
}

export default EditAgentPage;
