/**
 * Instructor Summary Cards Component
 *
 * Displays summary statistics for instructor management
 */

import type { BaseComponentProps } from "@/design-system";
import type { InstructorSummary } from "../types/instructor.types";
import { Calendar, Clock, Star, Users } from "lucide-react";

interface InstructorSummaryCardsProps extends BaseComponentProps {
    summary: InstructorSummary;
    loading?: boolean;
}

export function InstructorSummaryCards({
    loading = false,
}: InstructorSummaryCardsProps) {
    const cards = [
        {
            number: "6",
            title: "Total Students",
            subtitle: "Across all groups",
            icon: Users,
            bgColor: "bg-green-50",
            iconColor: "text-green-600",
            borderColor: "border-green-200",
        },
        {
            number: "5",
            title: "Total Sessions",
            subtitle: "This week",
            icon: Calendar,
            bgColor: "bg-brand-50",
            iconColor: "text-brand-600",
            borderColor: "border-brand-200",
        },
        {
            number: "12.5",
            title: "Teaching Hours",
            subtitle: "Hours per week",
            icon: Clock,
            bgColor: "bg-purple-50",
            iconColor: "text-purple-600",
            borderColor: "border-purple-200",
        },
        {
            number: "4.8",
            title: "Average Rating",
            subtitle: "Out of 5.0",
            icon: Star,
            bgColor: "bg-yellow-50",
            iconColor: "text-yellow-600",
            borderColor: "border-yellow-200",
        },
    ];

    if (loading) {
        return (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {[...Array(4)].map((_, index) => (
                    <div
                        key={index}
                        className="bg-white dark:bg-gray-800 rounded-lg p-6 animate-pulse"
                    >
                        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-2"></div>
                        <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
                    </div>
                ))}
            </div>
        );
    }

    return (
        <div className="w-full py-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {cards.map((card, index) => {
                    const Icon = card.icon;
                    return (
                        <div
                            key={index}
                            className="bg-white rounded-lg p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
                        >
                            <div className="flex items-start gap-4">
                                <div
                                    className={`${card.bgColor} p-3 rounded-lg shrink-0`}
                                >
                                    <Icon
                                        className={`${card.iconColor} w-5 h-5`}
                                        strokeWidth={2.5}
                                    />
                                </div>
                                <div className="flex-1">
                                    <div className="text-2xl font-bold text-gray-900 mb-1">
                                        {card.number}
                                    </div>
                                    <h3 className="text-sm font-semibold text-gray-900">
                                        {card.title}
                                    </h3>
                                    <p className="text-xs text-gray-500 mt-1">
                                        {card.subtitle}
                                    </p>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

export default InstructorSummaryCards;
