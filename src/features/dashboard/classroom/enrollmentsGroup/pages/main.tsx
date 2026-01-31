/**
 * EnrollmentsGroupPage
 *
 * Main page for enrollment groups with online/offline tabs.
 */

import { useState, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { Monitor, MapPin, Star } from "lucide-react";
import PageWrapper from "@/design-system/components/PageWrapper";
import {
    GroupCard,
    EnrolledGroupCard,
    ConfirmEnrollmentModal,
    UnlockOfflineSection,
    FilterGroups,
} from "../components";
import {
    MOCK_ONLINE_GROUPS,
    MOCK_OFFLINE_GROUPS,
    MOCK_NOT_ENROLLED_STATE,
} from "../mocks";
import type {
    EnrollmentGroup,
    SessionType,
    DayOfWeek,
    EnrollmentState,
} from "../types";

type TabType = "online" | "offline";

export function EnrollmentsGroupPage() {
    const { t } = useTranslation("enrollmentsGroup");

    // State
    const [activeTab, setActiveTab] = useState<TabType>("online");
    const [selectedDay, setSelectedDay] = useState<DayOfWeek | "all">("all");
    const [selectedLocation, setSelectedLocation] = useState<string | "all">(
        "all"
    );
    const [selectedGroup, setSelectedGroup] = useState<EnrollmentGroup | null>(
        null
    );
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Mock enrollment state - in real app, this would come from API
    const [enrollmentState, setEnrollmentState] = useState<EnrollmentState>(
        MOCK_NOT_ENROLLED_STATE
    );

    // Check if user is enrolled
    const isEnrolledOnline = !!enrollmentState.onlineGroup;
    const isEnrolledOffline = !!enrollmentState.offlineGroup;
    const offlineUnlocked = enrollmentState.offlineUnlocked;

    // Get unique locations for filter
    const locations = useMemo(() => {
        const uniqueLocations = new Set(
            MOCK_OFFLINE_GROUPS.map((g) => g.location).filter(Boolean)
        );
        return Array.from(uniqueLocations) as string[];
    }, []);

    // Filter groups
    const filteredOnlineGroups = useMemo(() => {
        return MOCK_ONLINE_GROUPS.filter((group) => {
            if (selectedDay !== "all" && group.day !== selectedDay)
                return false;
            return true;
        });
    }, [selectedDay]);

    const filteredOfflineGroups = useMemo(() => {
        return MOCK_OFFLINE_GROUPS.filter((group) => {
            if (selectedDay !== "all" && group.day !== selectedDay)
                return false;
            if (
                selectedLocation !== "all" &&
                group.location !== selectedLocation
            )
                return false;
            return true;
        });
    }, [selectedDay, selectedLocation]);

    // Handlers
    const handleEnroll = (group: EnrollmentGroup) => {
        setSelectedGroup(group);
        setIsModalOpen(true);
    };

    const handleConfirmEnrollment = () => {
        if (!selectedGroup) return;

        // Mock enrollment - in real app, this would be an API call
        if (selectedGroup.sessionType === "online") {
            setEnrollmentState((prev) => ({
                ...prev,
                onlineGroup: {
                    ...selectedGroup,
                    isEnrolled: true,
                    isActive: true,
                },
            }));
        } else {
            setEnrollmentState((prev) => ({
                ...prev,
                offlineGroup: {
                    ...selectedGroup,
                    isEnrolled: true,
                    isActive: true,
                },
            }));
        }

        setIsModalOpen(false);
        setSelectedGroup(null);
    };

    const handleViewMap = (group: EnrollmentGroup) => {
        // TODO: Implement map view
        console.log("View map for:", group.location);
    };

    // Render enrolled view for online
    const renderEnrolledOnlineView = () => (
        <div className="space-y-6">
            {/* Success Message */}
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                {t("successOnline")} 🎉
            </h2>

            {/* Enrolled Card */}
            {enrollmentState.onlineGroup && (
                <EnrolledGroupCard group={enrollmentState.onlineGroup} />
            )}

            {/* Offline Unlock Banner */}
            {!offlineUnlocked && (
                <div className="flex items-center gap-3 p-4 bg-warning-50 dark:bg-warning-500/10 border border-warning-200 dark:border-warning-500/30 rounded-xl">
                    <div className="w-8 h-8 bg-warning-100 dark:bg-warning-500/20 rounded-lg flex items-center justify-center">
                        <MapPin className="size-4 text-warning-500" />
                    </div>
                    <p className="text-sm text-gray-700 dark:text-gray-300">
                        {t("offlineUnlockBanner", {
                            count:
                                enrollmentState.requiredOnlineSessions -
                                enrollmentState.onlineSessionsCompleted,
                        })}
                    </p>
                </div>
            )}
        </div>
    );

    // Render enrolled view for offline
    const renderEnrolledOfflineView = () => (
        <div className="space-y-6">
            {/* Success Message */}
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                {t("successOffline")} 🎉
            </h2>

            {/* Enrolled Card */}
            {enrollmentState.offlineGroup && (
                <EnrolledGroupCard group={enrollmentState.offlineGroup} />
            )}

            {/* Reminder Banner */}
            <div className="flex items-center gap-3 p-4 bg-warning-50 dark:bg-warning-500/10 border border-warning-200 dark:border-warning-500/30 rounded-xl">
                <div className="w-8 h-8 bg-warning-100 dark:bg-warning-500/20 rounded-lg flex items-center justify-center">
                    <Monitor className="size-4 text-warning-500" />
                </div>
                <p className="text-sm text-gray-700 dark:text-gray-300">
                    {t("offlineReminder")}
                </p>
            </div>
        </div>
    );

    // Render not enrolled view
    const renderNotEnrolledView = () => (
        <div className="space-y-6">
            {/* Info Banner */}
            <div className="flex items-center gap-2 px-4 py-3 bg-brand-50 dark:bg-brand-500/10 border border-brand-200 dark:border-brand-500/30 rounded-xl">
                <Star className="size-5 text-warning-500" />
                <span className="text-sm text-gray-700 dark:text-gray-300">
                    {t("chooseGroupBanner")}
                </span>
            </div>

            {/* Filter */}
            <FilterGroups
                sessionType={activeTab}
                selectedDay={selectedDay}
                onDayChange={setSelectedDay}
                selectedLocation={selectedLocation}
                onLocationChange={setSelectedLocation}
                locations={locations}
            />

            {/* Groups Grid */}
            {activeTab === "online" ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {filteredOnlineGroups.map((group) => (
                        <GroupCard
                            key={group.id}
                            group={group}
                            onEnroll={handleEnroll}
                        />
                    ))}
                </div>
            ) : offlineUnlocked ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {filteredOfflineGroups.map((group) => (
                        <GroupCard
                            key={group.id}
                            group={group}
                            onEnroll={handleEnroll}
                            onViewMap={handleViewMap}
                        />
                    ))}
                </div>
            ) : (
                <UnlockOfflineSection
                    completedSessions={enrollmentState.onlineSessionsCompleted}
                    requiredSessions={enrollmentState.requiredOnlineSessions}
                />
            )}
        </div>
    );

    return (
        <PageWrapper
            pageHeaderProps={{
                title: t("title"),
                subtitle: t("description"),
            }}
        >
            {/* Tabs */}
            <div className="flex items-center gap-2">
                <button
                    onClick={() => setActiveTab("online")}
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-colors ${
                        activeTab === "online"
                            ? "bg-brand-500 text-white"
                            : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700"
                    }`}
                >
                    <Monitor className="size-4" />
                    {t("onlineSessions")}
                </button>
                <button
                    onClick={() => setActiveTab("offline")}
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-colors ${
                        activeTab === "offline"
                            ? "bg-warning-500 text-white"
                            : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700"
                    }`}
                >
                    <MapPin className="size-4" />
                    {t("offlineSessions")}
                </button>
            </div>

            {/* Content */}
            {activeTab === "online"
                ? isEnrolledOnline
                    ? renderEnrolledOnlineView()
                    : renderNotEnrolledView()
                : isEnrolledOffline
                  ? renderEnrolledOfflineView()
                  : renderNotEnrolledView()}

            {/* Confirmation Modal */}
            {selectedGroup && (
                <ConfirmEnrollmentModal
                    group={selectedGroup}
                    isOpen={isModalOpen}
                    onClose={() => {
                        setIsModalOpen(false);
                        setSelectedGroup(null);
                    }}
                    onConfirm={handleConfirmEnrollment}
                />
            )}
        </PageWrapper>
    );
}

export default EnrollmentsGroupPage;
