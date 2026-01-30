/**
 * AddLeadPage Component
 *
 * Page for adding a new lead to a support block.
 */

import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { Search, User } from "lucide-react";
import PageWrapper from "@/design-system/components/PageWrapper";
import { useToast } from "@/design-system/hooks/useToast";
import { teamStructure } from "../../navigation/paths";
import { mockUsers, mockBlocks } from "../../mockData";
import type { User as UserType, AgentStatus } from "../../types";
import { paths } from "@/router";

export function AddLeadPage() {
    const { t } = useTranslation("ticketsManagement");
    const navigate = useNavigate();
    const { addToast } = useToast();

    const [searchQuery, setSearchQuery] = useState("");
    const [selectedUser, setSelectedUser] = useState<UserType | null>(null);
    const [selectedBlockId, setSelectedBlockId] = useState("");
    const [status, setStatus] = useState<AgentStatus>("available");
    const [showUserDropdown, setShowUserDropdown] = useState(false);

    const filteredUsers = searchQuery
        ? mockUsers.filter(
              (user) =>
                  user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                  user.email.toLowerCase().includes(searchQuery.toLowerCase())
          )
        : [];

    const handleSelectUser = (user: UserType) => {
        setSelectedUser(user);
        setSearchQuery(user.name);
        setShowUserDropdown(false);
    };

    const handleCancel = () => {
        navigate(teamStructure.manageTeam());
    };

    const handleSubmit = () => {
        if (!selectedUser || !selectedBlockId) return;

        addToast({ type: "success", title: t("manageTeam.addLead.pageTitle") });
        navigate(teamStructure.manageTeam());
    };

    const isFormValid = selectedUser && selectedBlockId;

    return (
        <PageWrapper
            pageHeaderProps={{
                title: t("manageTeam.addLead.pageTitle"),
                subtitle: t("manageTeam.addLead.pageSubtitle"),
                backHref: paths.dashboard.ticketsManagement.manageTeam(),
                backButton: true,
            }}
        >
            <div className="space-y-6">
                {/* Select User */}
                <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-900 dark:text-white">
                        {t("manageTeam.addLead.selectUser")}
                    </label>
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                            type="text"
                            placeholder={t(
                                "manageTeam.addLead.searchPlaceholder"
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
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                        {t("manageTeam.addLead.searchHint")}
                    </p>
                </div>

                {/* Assigned Block */}
                <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-900 dark:text-white">
                        {t("manageTeam.addLead.assignedBlock")}
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

                {/* Initial Status */}
                <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-900 dark:text-white">
                        {t("manageTeam.addLead.initialStatus")}
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
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                        {t("manageTeam.addLead.statusHint")}
                    </p>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-3 pt-4">
                    <button
                        type="button"
                        onClick={handleCancel}
                        className="flex-1 px-4 py-3 border border-gray-200 dark:border-gray-700 rounded-lg text-gray-700 dark:text-gray-300 font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                    >
                        {t("manageTeam.addLead.cancel")}
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
                        {t("manageTeam.addLead.submit")}
                    </button>
                </div>
            </div>
        </PageWrapper>
    );
}

export default AddLeadPage;
