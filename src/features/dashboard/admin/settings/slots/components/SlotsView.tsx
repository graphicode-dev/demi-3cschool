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

// Mock data for development - remove when API is ready
const MOCK_SLOTS = [
    {
        day: "Monday",
        dayAbbr: "Mo",
        slots: [
            { id: 1, from: "10:00", to: "12:00" },
            { id: 2, from: "13:00", to: "15:00" },
            { id: 3, from: "16:00", to: "18:00" },
        ],
    },
    {
        day: "Tuesday",
        dayAbbr: "Tu",
        slots: [
            { id: 4, from: "09:00", to: "11:00" },
            { id: 5, from: "14:00", to: "16:00" },
        ],
    },
    {
        day: "Wednesday",
        dayAbbr: "We",
        slots: [
            { id: 6, from: "10:00", to: "12:00" },
            { id: 7, from: "13:00", to: "15:00" },
            { id: 8, from: "15:30", to: "17:30" },
        ],
    },
    {
        day: "Thursday",
        dayAbbr: "Th",
        slots: [
            { id: 9, from: "09:00", to: "11:00" },
            { id: 10, from: "11:30", to: "13:30" },
            { id: 11, from: "14:00", to: "16:00" },
        ],
    },
    {
        day: "Friday",
        dayAbbr: "Fr",
        slots: [
            { id: 12, from: "10:00", to: "12:00" },
            { id: 13, from: "13:00", to: "15:00" },
        ],
    },
    {
        day: "Saturday",
        dayAbbr: "Sa",
        slots: [
            { id: 14, from: "09:00", to: "12:00" },
            { id: 15, from: "14:00", to: "17:00" },
        ],
    },
    {
        day: "Sunday",
        dayAbbr: "Su",
        slots: [{ id: 16, from: "10:00", to: "13:00" }],
    },
];

export function SlotsView() {
    const { t } = useTranslation("slots");
    const [activeTab, setActiveTab] = useState<SessionType>("online");

    const { data: slots, isLoading, error } = useGroupedSlots(activeTab);

    // Use mock data if API fails or no data
    const displaySlots = slots && slots.length > 0 ? slots : MOCK_SLOTS;

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
        <div className="space-y-8">
            {/* Header */}
            <div className="space-y-2">
                <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
                    {t("title")}
                </h1>
                <p className="text-lg text-gray-500 dark:text-gray-400">
                    {t("description")}
                </p>
            </div>

            {/* Session Type Tabs */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-2 shadow-sm border border-gray-200 dark:border-gray-700">
                <div className="flex gap-2">
                    {tabs.map((tab) => {
                        const isActive = activeTab === tab.id;
                        const Icon = tab.icon;

                        return (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`flex-1 flex items-center justify-center gap-3 px-6 py-4 rounded-xl font-bold text-lg transition-all ${
                                    isActive
                                        ? tab.id === "online"
                                            ? "bg-brand-500 text-white shadow-lg shadow-brand-500/20"
                                            : "bg-brand-500 text-white shadow-lg shadow-brand-500/20"
                                        : "text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700"
                                }`}
                            >
                                <Icon size={24} />
                                {tab.label}
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Content */}
            {isLoading ? (
                <div className="flex items-center justify-center py-20">
                    <Loader2 className="w-8 h-8 animate-spin text-brand-500" />
                    <span className="ml-3 text-gray-500 dark:text-gray-400">
                        {t("loading")}
                    </span>
                </div>
            ) : error ? (
                <div className="text-center py-20">
                    <p className="text-red-500 dark:text-red-400">
                        {t("error")}
                    </p>
                </div>
            ) : (
                <div className="space-y-6">
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
