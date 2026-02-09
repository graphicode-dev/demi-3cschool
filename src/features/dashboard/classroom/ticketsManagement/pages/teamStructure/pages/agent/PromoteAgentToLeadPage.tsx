/**
 * PromoteAgentToLeadPage Component
 *
 * Page for promoting an agent to lead role.
 */

import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate, useParams } from "react-router-dom";
import { Crown } from "lucide-react";
import { PageWrapper, useToast } from "@/design-system";
import { teamStructure } from "../../navigation/paths";
import { getMockAgent, mockBlocks } from "../../mockData";
import type { Agent } from "../../types";
import { paths } from "@/router";

export function PromoteAgentToLeadPage() {
    const { t } = useTranslation("ticketsManagement");
    const navigate = useNavigate();
    const { id } = useParams<{ id: string }>();
    const { addToast } = useToast();

    const [agent, setAgent] = useState<Agent | null>(null);
    const [selectedBlockId, setSelectedBlockId] = useState("");

    useEffect(() => {
        if (id) {
            const foundAgent: Agent | undefined = getMockAgent(id);
            if (foundAgent) {
                setAgent(foundAgent);
                setSelectedBlockId(
                    foundAgent.blockId || mockBlocks[0]?.id || ""
                );
            }
        }
    }, [id]);

    const handleCancel = () => {
        navigate(teamStructure.manageTeam());
    };

    const handleSubmit = () => {
        if (agent && selectedBlockId) {
            addToast({
                type: "success",
                title: t("manageTeam.promoteAgent.successMessage"),
            });
            navigate(teamStructure.manageTeam());
        }
    };

    const isFormValid = selectedBlockId;

    if (!agent) {
        return null;
    }

    return (
        <PageWrapper
            pageHeaderProps={{
                title: t("manageTeam.promoteAgent.pageTitle"),
                subtitle: t("manageTeam.promoteAgent.pageSubtitleWithName", {
                    name: agent.name,
                }),
                backHref: paths.dashboard.admin.ticketsPaths.teamStructure(),
                backButton: true,
            }}
        >
            <div className="space-y-6">
                {/* Ready for Responsibility Banner */}
                <div className="p-6 bg-success-50 dark:bg-success-500/15 border border-success-200 dark:border-success-500/30 rounded-lg text-center">
                    <div className="w-12 h-12 mx-auto mb-4 bg-success-100 dark:bg-success-500/20 rounded-lg flex items-center justify-center">
                        <Crown className="w-6 h-6 text-success-600 dark:text-success-400" />
                    </div>
                    <h3 className="text-lg font-semibold text-success-700 dark:text-success-400 mb-2">
                        {t("manageTeam.promoteAgent.readyTitle")}
                    </h3>
                    <p
                        className="text-sm text-success-600 dark:text-success-400/80"
                        dangerouslySetInnerHTML={{
                            __html: t("manageTeam.promoteAgent.readyMessage", {
                                name: agent.name,
                            }),
                        }}
                    />
                </div>

                {/* Assigned Lead Block */}
                <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-900 dark:text-white">
                        {t("manageTeam.promoteAgent.assignedLeadBlock")}
                    </label>
                    <select
                        value={selectedBlockId}
                        onChange={(e) => setSelectedBlockId(e.target.value)}
                        className="w-full px-4 py-3 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 appearance-none"
                    >
                        <option value="">
                            {t("manageTeam.addLead.blockPlaceholder")}
                        </option>
                        {mockBlocks.map((block) => (
                            <option key={block.id} value={block.id}>
                                {block.name}
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
                        {t("manageTeam.promoteAgent.cancel")}
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
                        {t("manageTeam.promoteAgent.submit")}
                    </button>
                </div>
            </div>
        </PageWrapper>
    );
}

export default PromoteAgentToLeadPage;
