/**
 * ConvertLeadToAgentPage Component
 *
 * Page for converting a lead to a support agent.
 */

import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate, useParams } from "react-router-dom";
import { Info } from "lucide-react";
import { PageWrapper, useToast } from "@/design-system";
import { supportBlock } from "../../navigation/paths";
import { useSupportBlocks, useUpdateSupportBlock } from "../../api";
export function ConvertLeadToAgentPage() {
    const { t } = useTranslation("ticketsManagement");
    const navigate = useNavigate();
    const { blockId, id } = useParams<{ blockId: string; id: string }>();
    const { addToast } = useToast();

    const { data: blocksData } = useSupportBlocks();
    const blocks = blocksData?.items ?? [];
    const updateBlockMutation = useUpdateSupportBlock();

    // Find the lead from all blocks (leads are members with isLead=true)
    const leadData = blocks
        .flatMap((block) =>
            block.members
                .filter((member) => member.isLead)
                .map((member) => ({
                    ...member,
                    blockId: block.id,
                    blockName: block.name,
                }))
        )
        .find((lead) => String(lead.id) === id);

    // Get all leads except the current one
    const availableLeads = blocks
        .flatMap((block) =>
            block.members
                .filter((member) => member.isLead)
                .map((member) => ({
                    ...member,
                    blockId: block.id,
                    blockName: block.name,
                }))
        )
        .filter((lead) => String(lead.id) !== id);

    const [selectedBlockId, setSelectedBlockId] = useState("");
    const [selectedLeadId, setSelectedLeadId] = useState("");

    const handleCancel = () => {
        navigate(supportBlock.manageTeam(blockId!));
    };

    const handleSubmit = async () => {
        if (!leadData || !selectedBlockId || !selectedLeadId) return;

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
                title: t("manageTeam.convertLead.submit"),
            });
            navigate(supportBlock.manageTeam(blockId!));
        } catch (err) {
            addToast({
                type: "error",
                title: t("common.error", "Error converting lead"),
            });
        }
    };

    const isFormValid = leadData && selectedBlockId && selectedLeadId;

    if (!leadData) {
        return null;
    }

    return (
        <PageWrapper
            pageHeaderProps={{
                title: t("manageTeam.convertLead.pageTitle"),
                subtitle: t("manageTeam.convertLead.pageSubtitle"),
                backHref: supportBlock.manageTeam(blockId!),
                backButton: true,
            }}
        >
            <div className="space-y-6">
                {/* Warning Banner */}
                <div className="p-4 bg-brand-50 dark:bg-brand-500/15 border border-brand-200 dark:border-brand-500/30 rounded-lg">
                    <div className="flex items-start gap-3">
                        <Info className="w-5 h-5 text-brand-600 dark:text-brand-400 shrink-0 mt-0.5" />
                        <p
                            className="text-sm text-brand-700 dark:text-brand-400"
                            dangerouslySetInnerHTML={{
                                __html: t(
                                    "manageTeam.convertLead.warningMessage",
                                    {
                                        name: leadData.name,
                                    }
                                ),
                            }}
                        />
                    </div>
                </div>

                {/* Select Block */}
                <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-900 dark:text-white">
                        {t("manageTeam.convertLead.selectBlock")}
                    </label>
                    <select
                        value={selectedBlockId}
                        onChange={(e) => setSelectedBlockId(e.target.value)}
                        className="w-full px-4 py-3 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 appearance-none"
                    >
                        <option value="">
                            {t("manageTeam.addLead.blockPlaceholder")}
                        </option>
                        {blocks.map((block) => (
                            <option key={block.id} value={String(block.id)}>
                                {block.name}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Assign to Lead */}
                <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-900 dark:text-white">
                        {t("manageTeam.convertLead.assignToLead")}
                    </label>
                    <select
                        value={selectedLeadId}
                        onChange={(e) => setSelectedLeadId(e.target.value)}
                        className="w-full px-4 py-3 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 appearance-none"
                    >
                        <option value="">
                            {t("manageTeam.convertLead.leadPlaceholder")}
                        </option>
                        {availableLeads.map((l) => (
                            <option key={l.id} value={String(l.id)}>
                                {l.name}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-3 pt-4">
                    <button
                        type="button"
                        onClick={handleCancel}
                        className="flex-1 px-4 py-3 border border-gray-200 dark:border-gray-700 rounded-lg text-gray-700 dark:text-gray-300 font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                    >
                        {t("manageTeam.convertLead.cancel")}
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
                        {t("manageTeam.convertLead.submit")}
                    </button>
                </div>
            </div>
        </PageWrapper>
    );
}

export default ConvertLeadToAgentPage;
