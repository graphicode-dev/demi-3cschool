/**
 * QuickNavigation Component
 *
 * Displays quick navigation cards for different sections.
 */

import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { Users, Ticket, GitBranch, BarChart3 } from "lucide-react";
import { ticketsPaths } from "../../../navigation";

interface QuickNavItem {
    id: string;
    title: string;
    description: string;
    icon: React.ReactNode;
    path: string;
}

interface QuickNavigationProps {
    isLoading?: boolean;
}

export function QuickNavigation({ isLoading }: QuickNavigationProps) {
    const { t } = useTranslation("adminTicketsManagement");
    const navigate = useNavigate();

    const navItems: QuickNavItem[] = [
        {
            id: "support-block",
            title: t("overview.quickNav.supportBlock", "Support Block"),
            description: t(
                "overview.quickNav.supportBlockDesc",
                "View support block structure"
            ),
            icon: <Users className="w-5 h-5" />,
            path: ticketsPaths.supportBlock(),
        },
        {
            id: "tickets",
            title: t("overview.quickNav.tickets", "Tickets"),
            description: t(
                "overview.quickNav.ticketsDesc",
                "Manage support tickets"
            ),
            icon: <Ticket className="w-5 h-5" />,
            path: ticketsPaths.tickets(),
        },
        {
            id: "distribution",
            title: t("overview.quickNav.distribution", "Distribution"),
            description: t(
                "overview.quickNav.distributionDesc",
                "Workload assignment"
            ),
            icon: <GitBranch className="w-5 h-5" />,
            path: ticketsPaths.distribution(),
        },
        {
            id: "performance",
            title: t("overview.quickNav.performance", "Performance"),
            description: t(
                "overview.quickNav.performanceDesc",
                "Analytics & reports"
            ),
            icon: <BarChart3 className="w-5 h-5" />,
            path: ticketsPaths.performance(),
        },
    ];

    if (isLoading) {
        return (
            <div className="space-y-4">
                <div className="h-8 w-40 bg-gray-100 dark:bg-gray-700 rounded animate-pulse" />
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {[1, 2, 3, 4].map((i) => (
                        <div
                            key={i}
                            className="h-24 bg-gray-100 dark:bg-gray-800 rounded-xl animate-pulse"
                        />
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                {t("overview.quickNav.title", "Quick Navigation")}
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {navItems.map((item) => (
                    <button
                        key={item.id}
                        onClick={() => navigate(item.path)}
                        className="flex items-center gap-4 p-4 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md hover:border-gray-300 dark:hover:border-gray-600 transition-all text-left"
                    >
                        <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-gray-100 dark:bg-gray-700">
                            <div className="text-gray-600 dark:text-gray-400">
                                {item.icon}
                            </div>
                        </div>
                        <div className="flex-1">
                            <p className="font-semibold text-gray-900 dark:text-white">
                                {item.title}
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                                {item.description}
                            </p>
                        </div>
                    </button>
                ))}
            </div>
        </div>
    );
}

export default QuickNavigation;
