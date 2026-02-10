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
import { supportBlock } from "../../navigation/paths";
import { useSupportBlocks, useUpdateSupportBlock } from "../../api";
import type { AgentStatus, SupportBlockMember } from "../../types";

export function EditAgentPage() {
    const { t } = useTranslation("ticketsManagement");
    const navigate = useNavigate();
    const { blockId, id } = useParams<{ blockId: string; id: string }>();
    const { addToast } = useToast();

    const { data: blocksData } = useSupportBlocks();
    const blocks = blocksData?.items ?? [];
    const updateBlockMutation = useUpdateSupportBlock();

    // TODO: Replace with real agent API when available
    // For now, we show a placeholder since agents are not directly available from the blocks API
    const agentName = "Agent"; // Placeholder

    const [selectedBlockId, setSelectedBlockId] = useState("");
    const [selectedLeadId, setSelectedLeadId] = useState("");
    const [status, setStatus] = useState<AgentStatus>("available");

    // Get leads for the selected block (leads are members with isLead=true)
    const availableLeads = useMemo(() => {
        if (!selectedBlockId) {
            return blocks.flatMap((block) =>
                block.members.filter((member) => member.isLead)
            );
        }
        const selectedBlock = blocks.find(
            (block) => String(block.id) === selectedBlockId
        );
        return selectedBlock?.members.filter((member) => member.isLead) ?? [];
    }, [selectedBlockId, blocks]);

    const currentPlacement = useMemo(() => {
        // TODO: Get actual placement from agent API
        return {
            blockName: "Current Block",
            leadName: "Current Lead",
        };
    }, []);

    const handleCancel = () => {
        navigate(supportBlock.manageTeam(blockId!));
    };

    const handleSubmit = async () => {
        if (selectedBlockId && selectedLeadId) {
            try {
                const targetBlock = blocks.find(
                    (b) => String(b.id) === selectedBlockId
                );
                if (targetBlock) {
                    await updateBlockMutation.mutateAsync({
                        id: targetBlock.id,
                        payload: {
                            name: targetBlock.name,
                            description: targetBlock.description,
                            is_active: targetBlock.isActive ? 1 : 0,
                        },
                    });
                }
                addToast({
                    type: "success",
                    title: t("manageTeam.editAgent.successMessage"),
                });
                navigate(supportBlock.manageTeam(blockId!));
            } catch (err) {
                addToast({
                    type: "error",
                    title: t("common.error", "Error updating agent"),
                });
            }
        }
    };

    const isFormValid = selectedBlockId && selectedLeadId;

    return (
        <PageWrapper
            pageHeaderProps={{
                title: t("manageTeam.editAgent.pageTitleWithName", {
                    name: agentName,
                }),
                subtitle: t("manageTeam.editAgent.pageSubtitle"),
                backHref: supportBlock.manageTeam(blockId!),
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
                            {agentName}
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
                        {blocks.map((block) => (
                            <option key={block.id} value={String(block.id)}>
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
                        {availableLeads.map((lead: SupportBlockMember) => (
                            <option key={lead.id} value={String(lead.id)}>
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
                            {t("supportBlock.status.available")}
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
                            {t("supportBlock.status.busy")}
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
