/**
 * SlotsView Component
 * Main view for displaying time slots with Online/Offline tabs
 */

import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Laptop, MapPin, Loader2 } from "lucide-react";
import { useGroupedSlots } from "../api";
import { DayCard } from "./DayCard";
import type { SessionType } from "../types";

export function SlotsView() {
    const { t } = useTranslation("slots");
    const [activeTab, setActiveTab] = useState<SessionType>("online");

    const { data: slots, isLoading, error } = useGroupedSlots(activeTab);

    // Use mock data if API fails or no data
    const displaySlots = slots && slots.length > 0 ? slots : [];

    const tabs = [
        {
            id: "online" as SessionType,
            label: t("tabs.online"),
            icon: Laptop,
        },
        {
            id: "offline" as SessionType,
            label: t("tabs.offline"),
            icon: MapPin,
        },
    ];

    return (
        <div className="space-y-4">
            {/* Header */}
            <div className="space-y-1">
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                    {t("title")}
                </h1>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                    {t("description")}
                </p>
            </div>

            {/* Session Type Tabs */}
            <div className="bg-white dark:bg-gray-800 rounded-xl p-1.5 shadow-sm border border-gray-200 dark:border-gray-700">
                <div className="flex gap-1.5">
                    {tabs.map((tab) => {
                        const isActive = activeTab === tab.id;
                        const Icon = tab.icon;

                        return (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg font-semibold text-sm transition-all ${
                                    isActive
                                        ? "bg-brand-500 text-white shadow-md shadow-brand-500/20"
                                        : "text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700"
                                }`}
                            >
                                <Icon size={18} />
                                {tab.label}
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Content */}
            {isLoading ? (
                <div className="flex items-center justify-center py-12">
                    <Loader2 className="w-8 h-8 animate-spin text-brand-500" />
                    <span className="ml-3 text-gray-500 dark:text-gray-400">
                        {t("loading")}
                    </span>
                </div>
            ) : error ? (
                <div className="text-center py-12">
                    <p className="text-red-500 dark:text-red-400">
                        {t("error")}
                    </p>
                </div>
            ) : (
                <div className="space-y-4">
                    {displaySlots.map((daySlots, index) => (
                        <DayCard
                            key={daySlots.day || index}
                            daySlots={daySlots}
                            variant={activeTab}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}

export default SlotsView;
