/**
 * EnrollmentsGroupPage
 *
 * Main page for enrollment groups with term stepper, online/offline tabs,
 * filter section, and group cards.
 */

import { useState, useMemo, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { Monitor, MapPin, Star, Loader2 } from "lucide-react";
import PageWrapper from "@/design-system/components/PageWrapper";
import {
    GroupCard,
    EnrolledGroupCard,
    ConfirmEnrollmentModal,
    UnlockOfflineSection,
    FilterGroups,
    TermStepper,
    type Term,
    type TermStatus,
} from "../components";
import {
    useOnlineGroupsQuery,
    useOfflineGroupsQuery,
    useEnrollMutation,
} from "../api";
import { useProgramsCurriculumList } from "@/features/dashboard/admin/programs/api";
import type {
    EnrollmentGroup,
    DayOfWeek,
    AvailableGroup,
    EnrolledGroup,
} from "../types";

type TabType = "online" | "offline";

/**
 * Helper to convert API AvailableGroup to UI EnrollmentGroup
 */
const mapApiGroupToEnrollmentGroup = (
    apiGroup: AvailableGroup,
    isEnrolled: boolean = false
): EnrollmentGroup => {
    const schedule = apiGroup.schedules[0];
    return {
        id: apiGroup.id,
        sessionType: apiGroup.locationType,
        day: schedule?.dayOfWeek || "friday",
        startTime: schedule?.startTime ? formatTime(schedule.startTime) : "TBD",
        endTime: schedule?.endTime ? formatTime(schedule.endTime) : "TBD",
        location: apiGroup.location?.name,
        address: apiGroup.location?.address,
        isEnrolled,
    };
};

/**
 * Helper to convert API AvailableGroup to UI EnrolledGroup
 */
const mapApiGroupToEnrolledGroup = (
    apiGroup: AvailableGroup
): EnrolledGroup => {
    const schedule = apiGroup.schedules[0];
    return {
        id: apiGroup.id,
        sessionType: apiGroup.locationType,
        day: schedule?.dayOfWeek || "friday",
        startTime: schedule?.startTime ? formatTime(schedule.startTime) : "TBD",
        endTime: schedule?.endTime ? formatTime(schedule.endTime) : "TBD",
        location: apiGroup.location?.name,
        address: apiGroup.location?.address,
        isEnrolled: true,
        isActive: apiGroup.isActive,
    };
};

/**
 * Format time from "HH:MM:SS" to "H:MM AM/PM"
 */
const formatTime = (time: string): string => {
    const [hours, minutes] = time.split(":");
    const hour = parseInt(hours, 10);
    const ampm = hour >= 12 ? "PM" : "AM";
    const hour12 = hour % 12 || 12;
    return `${hour12}:${minutes} ${ampm}`;
};

export function EnrollmentsGroupPage() {
    const { t } = useTranslation("enrollmentsGroup");

    // Fetch curriculum list for term stepper
    const { data: curriculumData, isLoading: isLoadingCurriculum } =
        useProgramsCurriculumList();

    // State
    const [selectedCurriculumId, setSelectedCurriculumId] = useState<
        number | undefined
    >(undefined);
    const [activeTab, setActiveTab] = useState<TabType>("online");
    const [selectedDay, setSelectedDay] = useState<DayOfWeek | "all">("all");
    const [selectedLocation, setSelectedLocation] = useState<string | "all">(
        "all"
    );
    const [selectedGroup, setSelectedGroup] = useState<EnrollmentGroup | null>(
        null
    );
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Set initial curriculum when data loads
    // API returns array directly
    const curriculums = curriculumData ?? [];

    // Auto-select first active curriculum if none selected
    if (!selectedCurriculumId && curriculums.length > 0) {
        const activeCurriculum = curriculums.find((c) => c.isActive);
        if (activeCurriculum) {
            setSelectedCurriculumId(activeCurriculum.id);
        } else if (curriculums[0]) {
            setSelectedCurriculumId(curriculums[0].id);
        }
    }

    // Build terms from curriculum data
    const terms: Term[] = useMemo(() => {
        if (!curriculums.length) return [];

        return curriculums.map((curriculum) => {
            // Simply lock inactive programs, active ones are available (current)
            const isActive = Boolean(curriculum.isActive);
            const isSelected = curriculum.id === selectedCurriculumId;

            let status: TermStatus;
            if (!isActive) {
                // Inactive programs are always locked
                status = "locked";
            } else if (isSelected) {
                // Selected active program is current
                status = "current";
            } else {
                // Other active programs are available (show as current/clickable)
                status = "current";
            }

            return {
                id: curriculum.id,
                label: curriculum.caption || curriculum.name,
                status,
            };
        });
    }, [curriculums, selectedCurriculumId]);

    // Fetch online groups for selected curriculum
    const {
        data: onlineData,
        isLoading: isLoadingOnline,
        refetch: refetchOnline,
    } = useOnlineGroupsQuery(selectedCurriculumId, {
        enabled: !!selectedCurriculumId,
    });

    // Fetch offline groups for selected curriculum
    const {
        data: offlineData,
        isLoading: isLoadingOffline,
        refetch: refetchOffline,
    } = useOfflineGroupsQuery(selectedCurriculumId, {
        enabled: !!selectedCurriculumId,
    });

    // Enroll mutation
    const enrollMutation = useEnrollMutation();

    // Check enrollment status
    const isEnrolledOnline = onlineData?.enrolled ?? false;
    const isEnrolledOffline = offlineData?.enrolled ?? false;
    const enrolledOnlineGroup = onlineData?.group;
    const enrolledOfflineGroup = offlineData?.group;
    const availableOnlineGroups = onlineData?.available ?? [];
    const availableOfflineGroups = offlineData?.available ?? [];

    // Determine if offline is unlocked (user must be enrolled in online first)
    const offlineUnlocked = isEnrolledOnline;

    // Get unique locations for filter
    const locations = useMemo(() => {
        const uniqueLocations = new Set(
            availableOfflineGroups
                .map((g) => g.location?.name)
                .filter(Boolean) as string[]
        );
        return Array.from(uniqueLocations);
    }, [availableOfflineGroups]);

    // Filter groups
    const filteredOnlineGroups = useMemo(() => {
        return availableOnlineGroups.filter((group) => {
            if (selectedDay !== "all") {
                const hasMatchingSchedule = group.schedules.some(
                    (s) => s.dayOfWeek === selectedDay
                );
                if (!hasMatchingSchedule) return false;
            }
            return true;
        });
    }, [availableOnlineGroups, selectedDay]);

    const filteredOfflineGroups = useMemo(() => {
        return availableOfflineGroups.filter((group) => {
            if (selectedDay !== "all") {
                const hasMatchingSchedule = group.schedules.some(
                    (s) => s.dayOfWeek === selectedDay
                );
                if (!hasMatchingSchedule) return false;
            }
            if (
                selectedLocation !== "all" &&
                group.location?.name !== selectedLocation
            ) {
                return false;
            }
            return true;
        });
    }, [availableOfflineGroups, selectedDay, selectedLocation]);

    // Handlers
    const handleTermSelect = useCallback((termId: number | string) => {
        setSelectedCurriculumId(termId as number);
    }, []);

    const handleEnroll = (group: EnrollmentGroup) => {
        setSelectedGroup(group);
        setIsModalOpen(true);
    };

    const handleConfirmEnrollment = async () => {
        if (!selectedGroup) return;

        try {
            await enrollMutation.mutateAsync(selectedGroup.id);
            setIsModalOpen(false);
            setSelectedGroup(null);
            // Refetch data after enrollment
            if (selectedGroup.sessionType === "online") {
                refetchOnline();
            } else {
                refetchOffline();
            }
        } catch (error) {
            console.error("Enrollment failed:", error);
        }
    };

    const handleViewMap = (group: EnrollmentGroup) => {
        // TODO: Implement map view
        console.log("View map for:", group.location);
    };

    const isLoading =
        isLoadingCurriculum || isLoadingOnline || isLoadingOffline;

    // Render loading state
    const renderLoading = () => (
        <div className="flex items-center justify-center py-12">
            <Loader2 className="size-8 text-brand-500 animate-spin" />
        </div>
    );

    // Render enrolled view for online
    const renderEnrolledOnlineView = () => (
        <div className="space-y-6">
            {/* Success Message */}
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                {t("successOnline", "You have successfully joined this group")}{" "}
                🎉
            </h2>

            {/* Enrolled Card */}
            {enrolledOnlineGroup && (
                <EnrolledGroupCard
                    group={mapApiGroupToEnrolledGroup(enrolledOnlineGroup)}
                />
            )}

            {/* Offline Unlock Banner */}
            {!isEnrolledOffline && (
                <div className="flex items-center gap-3 p-4 bg-warning-50 dark:bg-warning-500/10 border border-warning-200 dark:border-warning-500/30 rounded-xl">
                    <div className="w-8 h-8 bg-warning-100 dark:bg-warning-500/20 rounded-lg flex items-center justify-center">
                        <MapPin className="size-4 text-warning-500" />
                    </div>
                    <p className="text-sm text-gray-700 dark:text-gray-300">
                        {t(
                            "offlineUnlockBanner",
                            "Offline session will unlock after completing 8 online sessions."
                        )}
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
                {t("successOffline", "Your offline session is booked")} 🎉
            </h2>

            {/* Enrolled Card */}
            {enrolledOfflineGroup && (
                <EnrolledGroupCard
                    group={mapApiGroupToEnrolledGroup(enrolledOfflineGroup)}
                />
            )}

            {/* Reminder Banner */}
            <div className="flex items-center gap-3 p-4 bg-warning-50 dark:bg-warning-500/10 border border-warning-200 dark:border-warning-500/30 rounded-xl">
                <div className="w-8 h-8 bg-warning-100 dark:bg-warning-500/20 rounded-lg flex items-center justify-center">
                    <Monitor className="size-4 text-warning-500" />
                </div>
                <p className="text-sm text-gray-700 dark:text-gray-300">
                    {t("offlineReminder", "Don't forget to bring your laptop!")}
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
                    {t(
                        "chooseGroupBanner",
                        "You will choose your group once to begin your journey"
                    )}
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
            {isLoading ? (
                renderLoading()
            ) : activeTab === "online" ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {filteredOnlineGroups.map((group) => (
                        <GroupCard
                            key={group.id}
                            group={mapApiGroupToEnrollmentGroup(group)}
                            onEnroll={handleEnroll}
                        />
                    ))}
                    {filteredOnlineGroups.length === 0 && (
                        <div className="col-span-full text-center py-8 text-gray-500">
                            {t("noGroupsAvailable", "No groups available")}
                        </div>
                    )}
                </div>
            ) : offlineUnlocked ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {filteredOfflineGroups.map((group) => (
                        <GroupCard
                            key={group.id}
                            group={mapApiGroupToEnrollmentGroup(group)}
                            onEnroll={handleEnroll}
                            onViewMap={handleViewMap}
                        />
                    ))}
                    {filteredOfflineGroups.length === 0 && (
                        <div className="col-span-full text-center py-8 text-gray-500">
                            {t("noGroupsAvailable", "No groups available")}
                        </div>
                    )}
                </div>
            ) : (
                <UnlockOfflineSection
                    completedSessions={0}
                    requiredSessions={8}
                />
            )}
        </div>
    );

    return (
        <PageWrapper
            pageHeaderProps={{
                title: t("title", "Enrollments Group"),
                subtitle: t(
                    "description",
                    "Pick the time that works best for you to start learning programming."
                ),
            }}
        >
            <div className="space-y-6">
                {/* Term Stepper */}
                {isLoadingCurriculum ? (
                    <div className="flex justify-center py-6">
                        <Loader2 className="size-6 text-brand-500 animate-spin" />
                    </div>
                ) : (
                    <TermStepper
                        terms={terms}
                        selectedTermId={selectedCurriculumId}
                        onTermSelect={handleTermSelect}
                        isLoading={isLoading}
                        className="py-6"
                    />
                )}

                {/* Tabs */}
                <div className="flex items-center justify-center gap-2">
                    <button
                        onClick={() => setActiveTab("online")}
                        className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold transition-colors ${
                            activeTab === "online"
                                ? "bg-brand-500 text-white"
                                : "bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700"
                        }`}
                    >
                        <Monitor className="size-4" />
                        {t("onlineSessions", "Online Sessions")}
                    </button>
                    <button
                        onClick={() => setActiveTab("offline")}
                        className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold transition-colors ${
                            activeTab === "offline"
                                ? "bg-warning-500 text-white"
                                : "bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700"
                        }`}
                    >
                        <MapPin className="size-4" />
                        {t("offlineSessions", "Offline Sessions")}
                    </button>
                </div>

                {/* Divider */}
                <hr className="border-gray-200 dark:border-gray-700" />

                {/* Content */}
                {activeTab === "online"
                    ? isEnrolledOnline
                        ? renderEnrolledOnlineView()
                        : renderNotEnrolledView()
                    : isEnrolledOffline
                      ? renderEnrolledOfflineView()
                      : renderNotEnrolledView()}
            </div>

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
