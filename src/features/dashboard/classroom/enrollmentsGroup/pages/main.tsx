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
import { useToast } from "@/design-system/hooks/useToast";
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
    AvailableSlot,
    AvailableGroup,
    EnrolledGroup,
} from "../types";

type TabType = "online" | "offline";

/**
 * Helper to convert API AvailableSlot to UI EnrollmentGroup
 */
const mapApiGroupToEnrollmentGroup = (
    apiGroup: AvailableSlot,
    isEnrolled: boolean = false
): EnrollmentGroup => {
    return {
        id: apiGroup.id,
        sessionType: apiGroup.type,
        day: apiGroup.day,
        startTime: apiGroup.startTime ? formatTime(apiGroup.startTime) : "",
        endTime: apiGroup.endTime ? formatTime(apiGroup.endTime) : "",
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
        startTime: schedule?.startTime ? formatTime(schedule.startTime) : "",
        endTime: schedule?.endTime ? formatTime(schedule.endTime) : "",
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
    const { addToast } = useToast();

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
    const [showMoreDetails, setShowMoreDetails] = useState(false);

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
    const enrolledOnlineEnrollment = onlineData?.enrollment;
    const enrolledOfflineEnrollment = offlineData?.enrollment;
    const availableOnlineSlots = onlineData?.slots ?? [];
    const availableOfflineSlots = offlineData?.slots ?? [];

    // Determine if offline is unlocked (user must be enrolled in online first)
    const offlineUnlocked = isEnrolledOnline;

    // Get unique locations for filter
    const locations = useMemo(() => {
        const uniqueLocations = new Set([] as string[]);
        return Array.from(uniqueLocations);
    }, []);

    // Filter groups
    const filteredOnlineGroups = useMemo(() => {
        return availableOnlineSlots.filter((group) => {
            if (selectedDay !== "all") {
                if (group.day !== selectedDay) return false;
            }
            return true;
        });
    }, [availableOnlineSlots, selectedDay]);

    const filteredOfflineGroups = useMemo(() => {
        return availableOfflineSlots.filter((group) => {
            if (selectedDay !== "all") {
                if (group.day !== selectedDay) return false;
            }
            return true;
        });
    }, [availableOfflineSlots, selectedDay]);

    const groupedOnlineByDay = useMemo(() => {
        return filteredOnlineGroups.reduce(
            (acc, slot) => {
                (acc[slot.day] ||= []).push(slot);
                return acc;
            },
            {} as Record<DayOfWeek, AvailableSlot[]>
        );
    }, [filteredOnlineGroups]);

    const groupedOfflineByDay = useMemo(() => {
        return filteredOfflineGroups.reduce(
            (acc, slot) => {
                (acc[slot.day] ||= []).push(slot);
                return acc;
            },
            {} as Record<DayOfWeek, AvailableSlot[]>
        );
    }, [filteredOfflineGroups]);

    const dayOrder: DayOfWeek[] = useMemo(() => ["friday", "saturday"], []);

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
        if (!selectedCurriculumId) return;

        try {
            await enrollMutation.mutateAsync({
                groupId: selectedGroup.id,
                programId: selectedCurriculumId,
            });

            addToast({
                type: "success",
                message: t("toasts.enroll_success"),
            });

            setIsModalOpen(false);
            setSelectedGroup(null);
            // Refetch data after enrollment
            if (selectedGroup.sessionType === "online") {
                refetchOnline();
            } else {
                refetchOffline();
            }
        } catch (error) {
            addToast({
                type: "error",
                message: t("toasts.enroll_error"),
            });
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

    const renderEnrollmentDetails = (
        enrollment?: {
            id: number;
            enrolledAt: string;
            status: string;
            createdAt: string;
            updatedAt: string;
        },
        group?: AvailableGroup
    ) => {
        if (!enrollment && !group) return null;

        const schedule = group?.schedules?.[0];
        const dayOfWeek = schedule?.dayOfWeek;
        const timeRange = schedule?.startTime
            ? `${formatTime(schedule.startTime)} - ${formatTime(schedule.endTime)}`
            : undefined;

        return (
            <div className="space-y-4 rounded-2xl border-2 border-success-300 dark:border-success-500/40">
                <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-700 p-5">
                    <h3 className="text-base font-bold text-gray-900 dark:text-white">
                        {t("yourGroup")}
                    </h3>

                    <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="p-5 rounded-2xl bg-brand-50 dark:bg-brand-500/10 border border-brand-200 dark:border-brand-500/30">
                            <div className="text-xs font-semibold text-brand-700 dark:text-brand-300">
                                {t("labels.group")}
                            </div>
                            <div className="mt-1 text-lg font-extrabold text-gray-900 dark:text-white">
                                {group?.name ?? t("placeholders.na")}
                            </div>
                        </div>

                        <div className="p-5 rounded-2xl bg-gray-50 dark:bg-gray-800/40 border border-gray-200 dark:border-gray-700">
                            <div className="text-xs font-semibold text-gray-600 dark:text-gray-300">
                                {t("labels.when")}
                            </div>
                            <div className="mt-1 text-lg font-extrabold text-gray-900 dark:text-white capitalize">
                                {dayOfWeek
                                    ? t(`days.${dayOfWeek}`)
                                    : t("placeholders.na")}
                            </div>
                            <div className="mt-1 text-sm font-semibold text-gray-700 dark:text-gray-300">
                                {timeRange ?? t("placeholders.na")}
                            </div>
                        </div>

                        <div className="p-5 rounded-2xl bg-gray-50 dark:bg-gray-800/40 border border-gray-200 dark:border-gray-700">
                            <div className="text-xs font-semibold text-gray-600 dark:text-gray-300">
                                {t("labels.type")}
                            </div>
                            <div className="mt-1 text-lg font-extrabold text-gray-900 dark:text-white capitalize">
                                {group?.locationType ?? t("placeholders.na")}
                            </div>
                        </div>

                        <div className="p-5 rounded-2xl bg-gray-50 dark:bg-gray-800/40 border border-gray-200 dark:border-gray-700">
                            <div className="text-xs font-semibold text-gray-600 dark:text-gray-300">
                                {t("labels.program_and_level")}
                            </div>
                            <div className="mt-1 text-sm font-semibold text-gray-900 dark:text-white">
                                {group?.programsCurriculum?.caption ??
                                    group?.programsCurriculum?.name ??
                                    t("placeholders.na")}
                            </div>
                            <div className="mt-1 text-sm font-semibold text-gray-700 dark:text-gray-300">
                                {group?.level?.title ?? t("placeholders.na")}
                            </div>
                        </div>
                    </div>

                    <div className="mt-4 flex items-center justify-end">
                        <button
                            type="button"
                            onClick={() => setShowMoreDetails((v) => !v)}
                            className="text-sm font-semibold text-brand-600 dark:text-brand-400 hover:text-brand-700 dark:hover:text-brand-300"
                        >
                            {showMoreDetails
                                ? t("actions.hide_details")
                                : t("actions.more_details")}
                        </button>
                    </div>
                </div>

                {showMoreDetails && (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                        <div className="lg:col-span-1 bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-700 p-5">
                            <div className="flex items-center justify-between gap-3">
                                <h3 className="text-base font-bold text-gray-900 dark:text-white">
                                    {t("details.enrollment.title")}
                                </h3>
                                {enrollment?.status && (
                                    <span className="px-3 py-1 rounded-full text-xs font-semibold bg-success-50 dark:bg-success-500/10 text-success-700 dark:text-success-400 border border-success-200 dark:border-success-500/30">
                                        {enrollment.status}
                                    </span>
                                )}
                            </div>

                            <div className="mt-4 space-y-3">
                                <div className="flex items-center justify-between gap-3">
                                    <span className="text-sm text-gray-500 dark:text-gray-400">
                                        {t("details.enrollment.id")}
                                    </span>
                                    <span className="text-sm font-semibold text-gray-900 dark:text-white">
                                        {enrollment?.id ?? t("placeholders.na")}
                                    </span>
                                </div>
                                <div className="flex items-center justify-between gap-3">
                                    <span className="text-sm text-gray-500 dark:text-gray-400">
                                        {t("details.enrollment.enrolled_at")}
                                    </span>
                                    <span className="text-sm font-semibold text-gray-900 dark:text-white">
                                        {enrollment?.enrolledAt ??
                                            t("placeholders.na")}
                                    </span>
                                </div>
                                <div className="flex items-center justify-between gap-3">
                                    <span className="text-sm text-gray-500 dark:text-gray-400">
                                        {t("details.enrollment.created_at")}
                                    </span>
                                    <span className="text-sm font-semibold text-gray-900 dark:text-white">
                                        {enrollment?.createdAt ??
                                            t("placeholders.na")}
                                    </span>
                                </div>
                                <div className="flex items-center justify-between gap-3">
                                    <span className="text-sm text-gray-500 dark:text-gray-400">
                                        {t("details.enrollment.updated_at")}
                                    </span>
                                    <span className="text-sm font-semibold text-gray-900 dark:text-white">
                                        {enrollment?.updatedAt ??
                                            t("placeholders.na")}
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div className="lg:col-span-2 bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-700 p-5">
                            <h3 className="text-base font-bold text-gray-900 dark:text-white">
                                {t("details.group.title")}
                            </h3>

                            <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="p-4 rounded-xl bg-gray-50 dark:bg-gray-800/40 border border-gray-200 dark:border-gray-700">
                                    <div className="text-xs text-gray-500 dark:text-gray-400">
                                        {t("details.group.capacity")}
                                    </div>
                                    <div className="mt-1 text-sm font-semibold text-gray-900 dark:text-white">
                                        {group?.maxCapacity ??
                                            t("placeholders.na")}
                                    </div>
                                </div>

                                <div className="p-4 rounded-xl bg-gray-50 dark:bg-gray-800/40 border border-gray-200 dark:border-gray-700">
                                    <div className="text-xs text-gray-500 dark:text-gray-400">
                                        {t("details.group.grade")}
                                    </div>
                                    <div className="mt-1 text-sm font-semibold text-gray-900 dark:text-white">
                                        {group?.grade?.name ??
                                            t("placeholders.na")}
                                    </div>
                                </div>
                            </div>

                            <div className="mt-4 p-4 rounded-xl bg-gray-50 dark:bg-gray-800/40 border border-gray-200 dark:border-gray-700">
                                <div className="flex items-center justify-between gap-3">
                                    <div className="text-xs text-gray-500 dark:text-gray-400">
                                        {t("details.group.schedule")}
                                    </div>
                                    <div className="text-xs text-gray-500 dark:text-gray-400">
                                        {t("details.group.group_id")}:{" "}
                                        {group?.id ?? t("placeholders.na")}
                                    </div>
                                </div>
                                <div className="mt-3 space-y-2">
                                    {(group?.schedules ?? []).map((s) => (
                                        <div
                                            key={s.id}
                                            className="flex items-center justify-between gap-3 px-3 py-2 rounded-lg bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700"
                                        >
                                            <div className="text-sm font-semibold text-gray-900 dark:text-white capitalize">
                                                {t(`days.${s.dayOfWeek}`)}
                                            </div>
                                            <div className="text-sm text-gray-700 dark:text-gray-300">
                                                {formatTime(s.startTime)} -{" "}
                                                {formatTime(s.endTime)}
                                            </div>
                                        </div>
                                    ))}

                                    {(group?.schedules?.length ?? 0) === 0 && (
                                        <div className="text-sm text-gray-500 dark:text-gray-400">
                                            {t("details.group.no_schedule")}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        );
    };

    // Render enrolled view for online
    const renderEnrolledOnlineView = () => (
        <div className="space-y-6">
            {/* Success Message */}
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                {t("successOnline")} 🎉
            </h2>

            {/* {enrolledOnlineGroup && (
                <EnrolledGroupCard
                    group={mapApiGroupToEnrolledGroup(enrolledOnlineGroup)}
                />
            )} */}

            {renderEnrollmentDetails(
                enrolledOnlineEnrollment,
                enrolledOnlineGroup
            )}

            {/* Offline Unlock Banner */}
            {!isEnrolledOffline && (
                <div className="flex items-center gap-3 p-4 bg-warning-50 dark:bg-warning-500/10 border border-warning-200 dark:border-warning-500/30 rounded-xl">
                    <div className="w-8 h-8 bg-warning-100 dark:bg-warning-500/20 rounded-lg flex items-center justify-center">
                        <MapPin className="size-4 text-warning-500" />
                    </div>
                    <p className="text-sm text-gray-700 dark:text-gray-300">
                        {t("offlineUnlockBanner", { count: 8 })}
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

            {enrolledOfflineGroup && (
                <EnrolledGroupCard
                    group={mapApiGroupToEnrolledGroup(enrolledOfflineGroup)}
                />
            )}

            {renderEnrollmentDetails(
                enrolledOfflineEnrollment,
                enrolledOfflineGroup
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
            {isLoading ? (
                renderLoading()
            ) : activeTab === "online" ? (
                <div className="space-y-6">
                    {dayOrder.map((day) => {
                        const daySlots = groupedOnlineByDay[day] ?? [];
                        if (daySlots.length === 0) return null;

                        return (
                            <div key={day} className="space-y-3">
                                <h3 className="text-base font-semibold text-gray-900 dark:text-white capitalize">
                                    {t(`days.${day}`)}
                                </h3>
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                                    {daySlots.map((slot) => (
                                        <GroupCard
                                            key={slot.id}
                                            group={mapApiGroupToEnrollmentGroup(
                                                slot
                                            )}
                                            onEnroll={handleEnroll}
                                        />
                                    ))}
                                </div>
                            </div>
                        );
                    })}

                    {filteredOnlineGroups.length === 0 && (
                        <div className="text-center py-8 text-gray-500">
                            {t("noGroupsAvailable")}
                        </div>
                    )}
                </div>
            ) : offlineUnlocked ? (
                <div className="space-y-6">
                    {dayOrder.map((day) => {
                        const daySlots = groupedOfflineByDay[day] ?? [];
                        if (daySlots.length === 0) return null;

                        return (
                            <div key={day} className="space-y-3">
                                <h3 className="text-base font-semibold text-gray-900 dark:text-white capitalize">
                                    {t(`days.${day}`)}
                                </h3>
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                                    {daySlots.map((slot) => (
                                        <GroupCard
                                            key={slot.id}
                                            group={mapApiGroupToEnrollmentGroup(
                                                slot
                                            )}
                                            onEnroll={handleEnroll}
                                            onViewMap={handleViewMap}
                                        />
                                    ))}
                                </div>
                            </div>
                        );
                    })}

                    {filteredOfflineGroups.length === 0 && (
                        <div className="text-center py-8 text-gray-500">
                            {t("noGroupsAvailable")}
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
                title: t("title"),
                subtitle: t("description"),
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
                        {t("onlineSessions")}
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
                        {t("offlineSessions")}
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
