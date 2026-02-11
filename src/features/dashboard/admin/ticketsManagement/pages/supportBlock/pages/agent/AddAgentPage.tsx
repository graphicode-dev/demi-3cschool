/**
 * AddAgentPage Component
 *
 * Page for adding a new agent to a block and lead.
 */

import { useState, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate, useParams } from "react-router-dom";
import { Search, User } from "lucide-react";
import { PageWrapper, useToast } from "@/design-system";
import { supportBlock } from "../../navigation/paths";
import {
    useSupportBlock,
    useSupportAgentsByBlock,
    useAddAgent,
} from "../../api";

interface UserOption {
    id: string;
    name: string;
    email: string;
}

export function AddAgentPage() {
    const { t } = useTranslation("adminTicketsManagement");
    const navigate = useNavigate();
    const { addToast } = useToast();
    const { blockId } = useParams<{ blockId: string }>();

    const { data: blockData } = useSupportBlock(blockId);
    const { data: agentsData } = useSupportAgentsByBlock(blockId);
    const addAgentMutation = useAddAgent();

    const [searchQuery, setSearchQuery] = useState("");
    const [selectedUser, setSelectedUser] = useState<UserOption | null>(null);
    const [selectedLeadId, setSelectedLeadId] = useState("");
    const [showUserDropdown, setShowUserDropdown] = useState(false);

    // TODO: Replace with real user search API when available
    const filteredUsers: UserOption[] = [];

    // Get leads for the current block
    const availableLeads = useMemo(() => {
        const agents = agentsData?.items ?? [];
        return agents.filter((agent) => agent.isLead);
    }, [agentsData]);

    const handleSelectUser = (user: UserOption) => {
        setSelectedUser(user);
        setSearchQuery(user.name);
        setShowUserDropdown(false);
    };

    const handleCancel = () => {
        navigate(supportBlock.manageTeam(blockId!));
    };

    const handleSubmit = async () => {
        if (selectedUser && blockId && selectedLeadId) {
            try {
                await addAgentMutation.mutateAsync({
                    user_id: selectedUser.id,
                    support_block_id: blockId,
                    lead_id: selectedLeadId,
                });
                addToast({
                    type: "success",
                    title: t(
                        "manageTeam.addAgent.success",
                        "Agent added successfully"
                    ),
                });
                navigate(supportBlock.manageTeam(blockId));
            } catch (err) {
                addToast({
                    type: "error",
                    title: t("common.error", "Error adding agent"),
                });
            }
        }
    };

    const isFormValid = selectedUser && selectedLeadId;

    return (
        <PageWrapper
            pageHeaderProps={{
                title: t("manageTeam.addAgent.pageTitle"),
                subtitle: t("manageTeam.addAgent.pageSubtitle"),
                backHref: supportBlock.manageTeam(blockId!),
                backButton: true,
            }}
        >
            <div className="space-y-6">
                {/* Select User */}
                <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-900 dark:text-white">
                        {t("manageTeam.addAgent.selectUser")}
                    </label>
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                            type="text"
                            placeholder={t(
                                "manageTeam.addAgent.searchPlaceholder"
                            )}
                            value={searchQuery}
                            onChange={(e) => {
                                setSearchQuery(e.target.value);
                                setShowUserDropdown(true);
                                if (!e.target.value) setSelectedUser(null);
                            }}
                            onFocus={() => setShowUserDropdown(true)}
                            className="w-full pl-10 pr-4 py-3 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
                        />
                        {showUserDropdown && filteredUsers.length > 0 && (
                            <>
                                <div
                                    className="fixed inset-0 z-10"
                                    onClick={() => setShowUserDropdown(false)}
                                />
                                <div className="absolute left-0 right-0 top-full mt-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-20 max-h-60 overflow-y-auto">
                                    {filteredUsers.map((user) => (
                                        <button
                                            key={user.id}
                                            onClick={() =>
                                                handleSelectUser(user)
                                            }
                                            className="w-full px-4 py-3 text-left hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center gap-3"
                                        >
                                            <div className="w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
                                                <User className="w-4 h-4 text-gray-500" />
                                            </div>
                                            <div>
                                                <p className="text-sm font-medium text-gray-900 dark:text-white">
                                                    {user.name}
                                                </p>
                                                <p className="text-xs text-gray-500">
                                                    {user.email}
                                                </p>
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            </>
                        )}
                    </div>
                </div>

                {/* Block (Read-only) */}
                <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-900 dark:text-white">
                        {t("manageTeam.addAgent.block")}
                    </label>
                    <div className="w-full px-4 py-3 border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white">
                        {blockData?.name || "-"}
                    </div>
                </div>

                {/* Assigned Lead */}
                <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-900 dark:text-white">
                        {t("manageTeam.addAgent.assignedLead")}
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
                            <option key={lead.id} value={String(lead.id)}>
                                {lead.user.name}
                            </option>
                        ))}
                    </select>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                        {t("manageTeam.addAgent.leadHint")}
                    </p>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-3 pt-4">
                    <button
                        type="button"
                        onClick={handleCancel}
                        className="flex-1 px-4 py-3 border border-gray-200 dark:border-gray-700 rounded-lg text-gray-700 dark:text-gray-300 font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                    >
                        {t("manageTeam.addAgent.cancel")}
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
                        {t("manageTeam.addAgent.submit")}
                    </button>
                </div>
            </div>
        </PageWrapper>
    );
}

export default AddAgentPage;
