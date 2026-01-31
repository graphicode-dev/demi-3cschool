import { useTranslation } from "react-i18next";
import { Lead } from "../types";
import { Crown, MoreHorizontal } from "lucide-react";
import ActionsDropdown, {
    DropdownAction,
} from "@/design-system/components/ActionsDropdown";

interface LeadCardProps {
    lead: Lead;
    onEdit: () => void;
    onChangeBlock: () => void;
    onConvert: () => void;
    onRemove: () => void;
}

export default function LeadCard({
    lead,
    onEdit,
    onChangeBlock,
    onConvert,
    onRemove,
}: LeadCardProps) {
    const { t } = useTranslation("ticketsManagement");

    const statusColors = {
        available: "text-success-500",
        busy: "text-warning-500",
        offline: "text-gray-400",
    };

    const getInitials = (name: string) => {
        return name
            .split(" ")
            .map((n) => n[0])
            .join("")
            .toUpperCase()
            .slice(0, 2);
    };

    return (
        <div className="relative flex flex-col gap-3 p-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl min-w-[200px]">
            {/* Header */}
            <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                    <div className="relative">
                        <div className="w-10 h-10 rounded-full bg-brand-100 dark:bg-brand-900/30 flex items-center justify-center text-brand-600 dark:text-brand-400 font-medium text-sm">
                            {getInitials(lead.name)}
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
                        <div className="flex items-center gap-1.5">
                            <span className="font-semibold text-gray-900 dark:text-white text-sm">
                                {lead.name}
                            </span>
                            <Crown className="w-4 h-4 text-warning-500" />
                        </div>
                        <span
                            className={`text-xs ${statusColors[lead.status]}`}
                        >
                            {t(`teamStructure.status.${lead.status}`)}
                        </span>
                    </div>
                </div>
                <ActionsDropdown
                    itemId={lead.id}
                    actions={
                        [
                            {
                                id: "edit",
                                label: t("manageTeam.actions.edit"),
                                onClick: () => onEdit(),
                            },
                            {
                                id: "changeBlock",
                                label: t("manageTeam.actions.changeBlock"),
                                onClick: () => onChangeBlock(),
                            },
                            {
                                id: "convertToAgent",
                                label: t("manageTeam.actions.convertToAgent"),
                                onClick: () => onConvert(),
                            },
                            {
                                id: "remove",
                                label: t("manageTeam.actions.remove"),
                                onClick: () => onRemove(),
                                className:
                                    "text-error-600 dark:text-error-400 hover:bg-gray-100 dark:hover:bg-gray-700",
                            },
                        ] as DropdownAction[]
                    }
                    triggerIcon={
                        <MoreHorizontal className="w-4 h-4 text-gray-400" />
                    }
                    triggerClassName="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
                />
            </div>

            {/* Assigned Block */}
            <div className="pt-2 border-t border-gray-100 dark:border-gray-700">
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                    {t("manageTeam.leadCard.assignedBlock")}
                </p>
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                    {lead.assignedBlock}
                </p>
            </div>
        </div>
    );
}
