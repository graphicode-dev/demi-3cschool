/**
 * EditLeadPage Component
 *
 * Page for updating a lead's status (available, busy, offline).
 */

import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate, useParams } from "react-router-dom";
import { User } from "lucide-react";
import {
    PageWrapper,
    useToast,
    LoadingState,
    ErrorState,
} from "@/design-system";
import { supportBlock } from "../../navigation/paths";
import {
    useSupportBlock,
    useSupportAgentsByBlock,
    useUpdateAgentStatus,
} from "../../api";
import type { AgentStatus } from "../../types";

export function EditLeadPage() {
    const { t } = useTranslation("ticketsManagement");
    const navigate = useNavigate();
    const { blockId, id } = useParams<{ blockId: string; id: string }>();
    const { addToast } = useToast();

    const { data: blockData } = useSupportBlock(blockId);
    const {
        data: agentsData,
        isLoading,
        error,
    } = useSupportAgentsByBlock(blockId);
    const updateStatusMutation = useUpdateAgentStatus();

    // Find the lead from agents list
    const leadData = agentsData?.items?.find(
        (agent) => String(agent.id) === id && agent.isLead
    );

    const [status, setStatus] = useState<AgentStatus>("available");

    useEffect(() => {
        if (leadData) {
            setStatus(leadData.status);
        }
    }, [leadData]);

    const handleCancel = () => {
        navigate(supportBlock.manageTeam(blockId!));
    };

    const handleSubmit = async () => {
        if (!id) return;

        try {
            await updateStatusMutation.mutateAsync({
                agentId: id,
                payload: {
                    status,
                },
            });
            addToast({
                type: "success",
                title: t(
                    "manageTeam.editLead.success",
                    "Status updated successfully"
                ),
            });
            navigate(supportBlock.manageTeam(blockId!));
        } catch (err) {
            addToast({
                type: "error",
                title: t("common.error", "Error updating status"),
            });
        }
    };

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
            />
        );
    }

    if (!leadData) {
        return (
            <ErrorState
                title={t("manageTeam.editLead.notFound", "Lead not found")}
                message={t(
                    "manageTeam.editLead.notFoundMessage",
                    "The lead you are looking for does not exist."
                )}
            />
        );
    }

    return (
        <PageWrapper
            pageHeaderProps={{
                title: t("manageTeam.editLead.pageTitleWithName", {
                    name: leadData.user.name,
                    defaultValue: `Edit Lead - ${leadData.user.name}`,
                }),
                subtitle: t(
                    "manageTeam.editLead.pageSubtitle",
                    "Update lead status"
                ),
                backHref: supportBlock.manageTeam(blockId!),
                backButton: true,
            }}
        >
            <div className="max-w-xl space-y-6">
                {/* User Information */}
                <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-900 dark:text-white">
                        {t("manageTeam.editLead.userInformation", "Lead")}
                    </label>
                    <div className="flex items-center gap-3 px-4 py-3 border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-900">
                        <div className="w-10 h-10 rounded-full bg-brand-100 dark:bg-brand-900/30 flex items-center justify-center">
                            <User className="w-5 h-5 text-brand-600 dark:text-brand-400" />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-gray-900 dark:text-white">
                                {leadData.user.name}
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                                {leadData.user.email}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Assigned Block (Read-only) */}
                <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-900 dark:text-white">
                        {t(
                            "manageTeam.editLead.assignedBlock",
                            "Assigned Block"
                        )}
                    </label>
                    <div className="w-full px-4 py-3 border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white">
                        {blockData?.name || leadData.supportBlock?.name || "-"}
                    </div>
                </div>

                {/* Status */}
                <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-900 dark:text-white">
                        {t("manageTeam.editLead.status", "Status")}
                    </label>
                    <div className="flex rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
                        <button
                            type="button"
                            onClick={() => setStatus("available")}
                            className={`flex-1 py-3 text-sm font-medium transition-colors ${
                                status === "available"
                                    ? "bg-success-50 dark:bg-success-500/15 text-success-600 dark:text-success-400"
                                    : "bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700"
                            } border-r border-gray-200 dark:border-gray-700`}
                        >
                            {t("supportBlock.status.available", "Available")}
                        </button>
                        <button
                            type="button"
                            onClick={() => setStatus("busy")}
                            className={`flex-1 py-3 text-sm font-medium transition-colors ${
                                status === "busy"
                                    ? "bg-warning-50 dark:bg-warning-500/15 text-warning-600 dark:text-warning-400"
                                    : "bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700"
                            } border-r border-gray-200 dark:border-gray-700`}
                        >
                            {t("supportBlock.status.busy", "Busy")}
                        </button>
                        <button
                            type="button"
                            onClick={() => setStatus("offline")}
                            className={`flex-1 py-3 text-sm font-medium transition-colors ${
                                status === "offline"
                                    ? "bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-200"
                                    : "bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700"
                            }`}
                        >
                            {t("supportBlock.status.offline", "Offline")}
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
                        {t("manageTeam.editLead.cancel", "Cancel")}
                    </button>
                    <button
                        type="button"
                        onClick={handleSubmit}
                        disabled={updateStatusMutation.isPending}
                        className="flex-1 px-4 py-3 rounded-lg font-medium transition-colors bg-brand-500 hover:bg-brand-600 text-white disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {updateStatusMutation.isPending
                            ? t("common.saving", "Saving...")
                            : t("manageTeam.editLead.submit", "Update Status")}
                    </button>
                </div>
            </div>
        </PageWrapper>
    );
}

export default EditLeadPage;
