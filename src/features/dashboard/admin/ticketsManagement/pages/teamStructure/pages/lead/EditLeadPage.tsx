/**
 * EditLeadPage Component
 *
 * Page for editing an existing lead's information and assignment.
 */

import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate, useParams } from "react-router-dom";
import { User } from "lucide-react";
import PageWrapper from "@/design-system/components/PageWrapper";
import { useToast } from "@/design-system/hooks/useToast";
import { teamStructure } from "../../navigation/paths";
import { getMockLead, mockBlocks } from "../../mockData";
import type { Lead, AgentStatus } from "../../types";
import { paths } from "@/router";

export function EditLeadPage() {
    const { t } = useTranslation("ticketsManagement");
    const navigate = useNavigate();
    const { id } = useParams<{ id: string }>();
    const { addToast } = useToast();

    const [lead, setLead] = useState<Lead | null>(null);
    const [selectedBlockId, setSelectedBlockId] = useState("");
    const [status, setStatus] = useState<AgentStatus>("available");

    useEffect(() => {
        if (id) {
            const foundLead: Lead | undefined = getMockLead(id);
            if (foundLead) {
                setLead(foundLead);
                setSelectedBlockId(foundLead.assignedBlockId);
                setStatus(foundLead.status);
            }
        }
    }, [id]);

    const handleCancel = () => {
        navigate(teamStructure.manageTeam());
    };

    const handleSubmit = () => {
        if (!lead || !selectedBlockId) return;

        addToast({ type: "success", title: t("manageTeam.editLead.submit") });
        navigate(teamStructure.manageTeam());
    };

    const isFormValid = lead && selectedBlockId;

    if (!lead) {
        return null;
    }

    return (
        <PageWrapper
            pageHeaderProps={{
                title: t("manageTeam.editLead.pageTitleWithName", {
                    name: lead.name,
                }),
                subtitle: t("manageTeam.editLead.pageSubtitle"),
                backHref: paths.dashboard.admin.ticketsManagement.manageTeam(),
                backButton: true,
            }}
        >
            <div className="space-y-6">
                {/* User Information */}
                <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-900 dark:text-white">
                        {t("manageTeam.editLead.userInformation")}
                    </label>
                    <div className="flex items-center gap-3 px-4 py-3 border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-900">
                        <div className="w-8 h-8 rounded-full bg-brand-100 dark:bg-brand-900/30 flex items-center justify-center">
                            <User className="w-4 h-4 text-brand-600 dark:text-brand-400" />
                        </div>
                        <span className="text-sm text-gray-900 dark:text-white">
                            {lead.name}
                        </span>
                    </div>
                </div>

                {/* Assigned Block */}
                <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-900 dark:text-white">
                        {t("manageTeam.editLead.assignedBlock")}
                    </label>
                    <select
                        value={selectedBlockId}
                        onChange={(e) => setSelectedBlockId(e.target.value)}
                        className="w-full px-4 py-3 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 appearance-none"
                    >
                        {mockBlocks.map((block) => (
                            <option key={block.id} value={block.id}>
                                {block.name}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Status */}
                <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-900 dark:text-white">
                        {t("manageTeam.editLead.status")}
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
                        {t("manageTeam.editLead.cancel")}
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
                        {t("manageTeam.editLead.submit")}
                    </button>
                </div>
            </div>
        </PageWrapper>
    );
}

export default EditLeadPage;
