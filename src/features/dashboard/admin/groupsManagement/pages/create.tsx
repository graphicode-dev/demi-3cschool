import { useState, useMemo, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate, useParams } from "react-router-dom";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Form } from "@/design-system/components/form";
import {
    StepIndicator,
    FormSection,
    GroupSummary,
    SimilarGroupsModal,
} from "../components";
import {
    useCreateGroup,
    useGroupRecommendations,
    type GroupRecommendPayload,
    type GroupRecommendation,
} from "../api";
import PageWrapper from "@/design-system/components/PageWrapper";
import { useMutationHandler } from "@/shared/api";
import { useGroupScheduleSlots } from "../../settings/slots/api/slots.queries";

const groupFormSchema = z.object({
    groupName: z.string().min(1, "Group name is required").max(255),
    days: z.string().min(1, "Day is required"),
    startTime: z.string().min(1, "Start time is required"),
    endTime: z.string().min(1, "End time is required"),
    capacity: z.string().min(1, "Capacity is required"),
    locationType: z.enum(["online", "offline"]),
    trainerId: z.string().optional(),
});

type GroupFormData = z.infer<typeof groupFormSchema>;

const STEPS = [
    {
        id: "basic",
        labelKey: "groups.form.steps.basic",
        label: "Basic Information",
    },
    {
        id: "capacity",
        labelKey: "groups.form.steps.capacity",
        label: "Capacity & Location",
    },
    {
        id: "schedule",
        labelKey: "groups.form.steps.schedule",
        label: "Schedule",
    },
    {
        id: "confirmation",
        labelKey: "groups.form.steps.confirmation",
        label: "Confirmation",
    },
];

const transformRecommendationToRecommendedGroup = (
    recommendation: GroupRecommendation
) => ({
    id: recommendation.group.id,
    name: recommendation.group.name,
    studentsCount: 0,
    level: recommendation.group.level?.title || "-",
    grade: recommendation.group.grade?.name || "-",
    status: recommendation.group.isActive ? "Active" : "Inactive",
    days: recommendation.group.schedules
        .map((s) => s.dayOfWeek.charAt(0).toUpperCase() + s.dayOfWeek.slice(1))
        .join(", "),
    times: recommendation.group.schedules[0]
        ? `${recommendation.group.schedules[0].startTime.slice(0, 5)} - ${recommendation.group.schedules[0].endTime.slice(0, 5)}`
        : "-",
});

const LOCATION_TYPES = [
    { value: "online", label: "Online" },
    { value: "offline", label: "Offline" },
];

const DAYS_OPTIONS = [
    { value: "friday", label: "Friday" },
    { value: "saturday", label: "Saturday" },
];

export default function RegularGroupCreate() {
    const { t } = useTranslation("groupsManagement");
    const navigate = useNavigate();
    const { gradeId, levelId } = useParams<{
        gradeId: string;
        levelId: string;
    }>();
    const [currentStep, setCurrentStep] = useState(0);
    const [isSimilarGroupsModalOpen, setIsSimilarGroupsModalOpen] =
        useState(false);

    // Build base path from URL params
    const basePath = `/admin/groups/grades/${gradeId}/levels/${levelId}`;

    const { mutateAsync, isPending } = useCreateGroup();
    const { execute } = useMutationHandler();

    const {
        control,
        handleSubmit,
        formState: { errors },
        trigger,
        watch,
        setValue,
        register,
        getValues,
        setError,
    } = useForm<GroupFormData>({
        resolver: zodResolver(groupFormSchema),
        mode: "onChange",
        shouldUnregister: false,
        defaultValues: {
            groupName: "",
            days: "",
            startTime: "",
            endTime: "",
            capacity: "10",
            locationType: "online",
            trainerId: "",
        },
    });

    // Only register fields that are NOT controlled by Controller
    useEffect(() => {
        register("days");
        register("capacity");
        register("locationType");
        register("trainerId");
    }, [register]);

    const stepFields: Record<number, (keyof GroupFormData)[]> = useMemo(
        () => ({
            0: ["groupName"],
            1: ["capacity", "locationType"],
            2: ["days", "startTime", "endTime"],
            3: [], // Confirmation step has no new fields
        }),
        []
    );

    const selectedDay = watch("days");
    const selectedStartTime = watch("startTime");
    const selectedEndTime = watch("endTime");
    const selectedLocationType = watch("locationType");

    const scheduleSlotsParams = useMemo(() => {
        if (!selectedDay) return null;
        return {
            day: selectedDay,
            type: selectedLocationType,
        };
    }, [selectedDay, selectedLocationType]);

    const { data: scheduleSlotsData, isLoading: isSlotsLoading } =
        useGroupScheduleSlots(scheduleSlotsParams);

    useEffect(() => {
        setValue("startTime", "");
        setValue("endTime", "");
    }, [selectedDay, selectedLocationType, setValue]);

    // Use getValues for accessing form values without reactivity warnings
    const formValues = getValues();

    const getLabel = (
        options: { value: string; label: string }[],
        value: string
    ) => {
        const found = options.find((opt) => opt.value === value);
        return found?.label || "";
    };

    // Recommendation payload using levelId from URL
    const recommendationPayload: GroupRecommendPayload | null = useMemo(() => {
        if (levelId && formValues.capacity) {
            return {
                course_id: "", // Not needed when we have levelId
                level_id: levelId,
                capacity: parseInt(formValues.capacity, 10),
                limit: 10,
            };
        }
        return null;
    }, [levelId, formValues.capacity]);

    const { data: recommendationsData } = useGroupRecommendations(
        recommendationPayload
    );

    const recommendedGroups = useMemo(
        () =>
            recommendationsData?.recommendations.map(
                transformRecommendationToRecommendedGroup
            ) ?? [],
        [recommendationsData]
    );

    const summaryData = useMemo(() => {
        return {
            groupName: formValues.groupName,
            grade: `Grade ${gradeId}`,
            level: `Level ${levelId}`,
            days: formValues.days
                ? [getLabel(DAYS_OPTIONS, formValues.days)]
                : [],
            startTime: formValues.startTime,
            endTime: formValues.endTime,
            capacity: parseInt(formValues.capacity, 10) || 0,
            locationType:
                formValues.locationType === "online" ? "Online" : "Offline",
        };
    }, [formValues, levelId, gradeId]);

    const handleNext = async () => {
        const fields = stepFields[currentStep];
        const isValid = await trigger(fields);

        if (isValid && currentStep < STEPS.length - 1) {
            setCurrentStep((prev) => prev + 1);
        }
    };

    const handleBack = () => {
        if (currentStep > 0) {
            setCurrentStep((prev) => prev - 1);
        } else {
            navigate(`${basePath}/group`);
        }
    };

    const handleViewSimilarGroupDetails = (id: string) => {
        navigate(`${basePath}/group/view/${id}`);
        setIsSimilarGroupsModalOpen(false);
    };

    const onSubmit = (data: GroupFormData) => {
        const normalizeTimeToHHmm = (value: string) => value.slice(0, 5);

        const payload = {
            level_id: parseInt(levelId || "0", 10),
            name: data.groupName,
            grade_id: parseInt(gradeId || "0", 10),
            maxCapacity: parseInt(data.capacity, 10),
            location_type: data.locationType as "online" | "offline",
            groupSchedules: [
                {
                    day_of_week: data.days as any,
                    startTime: normalizeTimeToHHmm(data.startTime),
                    endTime: normalizeTimeToHHmm(data.endTime),
                },
            ],
            ...(data.locationType === "offline" && data.trainerId
                ? { trainer_id: parseInt(data.trainerId, 10) }
                : {}),
        };

        execute(() => mutateAsync(payload), {
            successMessage: t(
                "groups.messages.createSuccess",
                "Group created successfully"
            ),
            onSuccess: () => navigate(`${basePath}/group`),
            setError,
            fieldMapping: {
                name: "groupName",
                "groupSchedules.0.day_of_week": "days",
            },
        });
    };

    const handleConfirm = async () => {
        if (isPending) return;

        const ok = await trigger();
        if (!ok) return;
        // Trigger form submission programmatically
        handleSubmit(onSubmit)();
    };

    const renderStepContent = () => {
        switch (currentStep) {
            case 0:
                return (
                    <FormSection
                        title={t(
                            "groups.form.sections.basicInfo",
                            "Basic Information"
                        )}
                    >
                        <Form.Input
                            name="groupName"
                            type={{
                                type: "text",
                                placeholder: t(
                                    "groups.form.fields.groupName.placeholder",
                                    "e.g., Python Beginners A"
                                ),
                            }}
                            label={{
                                text: t(
                                    "groups.form.fields.groupName.label",
                                    "Group Name"
                                ),
                                required: true,
                            }}
                            style={{ size: "md" }}
                            layout={{ className: "w-full" }}
                        />
                    </FormSection>
                );

            case 1:
                return (
                    <FormSection
                        title={t(
                            "groups.form.sections.capacityLocation",
                            "Capacity & Location"
                        )}
                    >
                        <div className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <Form.Input
                                    name="capacity"
                                    type={{
                                        type: "number",
                                        placeholder: t(
                                            "groups.form.fields.capacity.placeholder",
                                            "Enter maximum capacity"
                                        ),
                                        min: 1,
                                        max: 100,
                                    }}
                                    label={{
                                        text: t(
                                            "groups.form.fields.capacity.label",
                                            "Maximum Capacity"
                                        ),
                                        required: true,
                                    }}
                                    style={{ size: "md" }}
                                />

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        {t(
                                            "groups.form.fields.locationType.label",
                                            "Location Type"
                                        )}
                                        <span className="text-red-500 ml-1">
                                            *
                                        </span>
                                    </label>
                                    <Controller
                                        name="locationType"
                                        control={control}
                                        render={({ field }) => (
                                            <select
                                                {...field}
                                                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-brand-500 focus:border-transparent"
                                            >
                                                {LOCATION_TYPES.map((option) => (
                                                    <option
                                                        key={option.value}
                                                        value={option.value}
                                                    >
                                                        {option.label}
                                                    </option>
                                                ))}
                                            </select>
                                        )}
                                    />
                                    {errors.locationType && (
                                        <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                                            {errors.locationType.message}
                                        </p>
                                    )}
                                </div>
                            </div>

                            {watch("locationType") === "offline" && (
                                <Form.Input
                                    name="trainerId"
                                    type={{
                                        type: "text",
                                        placeholder: t(
                                            "groups.form.fields.trainerId.placeholder",
                                            "Enter trainer ID"
                                        ),
                                    }}
                                    label={{
                                        text: t(
                                            "groups.form.fields.trainerId.label",
                                            "Trainer ID"
                                        ),
                                        required: false,
                                    }}
                                    style={{ size: "md" }}
                                />
                            )}
                        </div>
                    </FormSection>
                );

            case 2:
                return (
                    <FormSection
                        title={t("groups.form.sections.schedule", "Schedule")}
                    >
                        <div className="space-y-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    {t("groups.form.fields.days.label", "Days")}
                                    <span className="text-red-500 ml-1">*</span>
                                </label>
                                <Controller
                                    name="days"
                                    control={control}
                                    render={({ field }) => (
                                        <select
                                            {...field}
                                            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-brand-500 focus:border-transparent"
                                        >
                                            <option value="">
                                                {t(
                                                    "groups.form.fields.days.placeholder",
                                                    "Select Days"
                                                )}
                                            </option>
                                            {DAYS_OPTIONS.map((day) => (
                                                <option
                                                    key={day.value}
                                                    value={day.value}
                                                >
                                                    {day.label}
                                                </option>
                                            ))}
                                        </select>
                                    )}
                                />
                                {errors.days && (
                                    <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                                        {errors.days.message}
                                    </p>
                                )}
                            </div>

                            {selectedDay ? (
                                <div className="space-y-3">
                                    {isSlotsLoading ? (
                                        <p className="text-sm text-gray-500 dark:text-gray-400">
                                            {t(
                                                "groups.form.fields.slots.loading",
                                                "Loading available slots..."
                                            )}
                                        </p>
                                    ) : (scheduleSlotsData?.length ?? 0) === 0 ? (
                                        <p className="text-sm text-gray-500 dark:text-gray-400">
                                            {t(
                                                "groups.form.fields.slots.empty",
                                                "No slots available"
                                            )}
                                        </p>
                                    ) : (
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                            {scheduleSlotsData!.map((slot) => {
                                                const isSelected =
                                                    selectedStartTime ===
                                                        slot.startTime &&
                                                    selectedEndTime ===
                                                        slot.endTime;
                                                return (
                                                    <button
                                                        key={`${slot.startTime}-${slot.endTime}`}
                                                        type="button"
                                                        onClick={() => {
                                                            setValue(
                                                                "startTime",
                                                                slot.startTime
                                                            );
                                                            setValue(
                                                                "endTime",
                                                                slot.endTime
                                                            );
                                                        }}
                                                        className={`px-4 py-3 rounded-lg border text-sm transition-colors text-left ${
                                                            isSelected
                                                                ? "border-brand-500 bg-brand-50 dark:bg-brand-900/20 text-brand-700 dark:text-brand-300"
                                                                : "border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 hover:bg-gray-50 dark:hover:bg-gray-700"
                                                        }`}
                                                    >
                                                        {slot.startTime} - {slot.endTime}
                                                    </button>
                                                );
                                            })}
                                        </div>
                                    )}

                                    {(errors.startTime || errors.endTime) && (
                                        <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                                            {t(
                                                "groups.form.fields.slots.required",
                                                "Please select a time slot"
                                            )}
                                        </p>
                                    )}
                                </div>
                            ) : null}
                        </div>
                    </FormSection>
                );

            case 3:
                return (
                    <GroupSummary
                        data={summaryData}
                        onSimilarGroupsClick={() =>
                            setIsSimilarGroupsModalOpen(true)
                        }
                    />
                );

            default:
                return null;
        }
    };

    const isLastStep = currentStep === STEPS.length - 1;

    return (
        <PageWrapper
            pageHeaderProps={{
                title: t("groups.form.create.title", "Create New Group"),
                subtitle: t(
                    "groups.form.create.subtitle",
                    "Set up a new group for students"
                ),
                backButton: true,
            }}
        >
            <StepIndicator
                steps={STEPS}
                currentStep={currentStep}
                onStepClick={setCurrentStep}
            />

            <div>
                <Form
                    control={control}
                    errors={errors}
                    onSubmit={handleSubmit(onSubmit)}
                >
                    {renderStepContent()}

                    <div className="flex justify-between items-center mt-6">
                        <button
                            type="button"
                            onClick={handleBack}
                            disabled={isPending}
                            className="inline-flex items-center gap-2 px-6 py-3 text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <svg
                                className="w-5 h-5 rtl:rotate-180"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M15 19l-7-7 7-7"
                                />
                            </svg>
                            {t("common.back", "Back")}
                        </button>

                        {isLastStep ? (
                            <div className="flex items-center gap-4">
                                <button
                                    type="button"
                                    onClick={() => setCurrentStep(0)}
                                    disabled={isPending}
                                    className="inline-flex items-center gap-2 px-6 py-3 text-brand-500 border border-brand-500 rounded-lg hover:bg-brand-50 dark:hover:bg-brand-900/20 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    <svg
                                        className="w-5 h-5"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth="2"
                                            d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                                        />
                                    </svg>
                                    {t(
                                        "groups.form.actions.edit",
                                        "Edit Group"
                                    )}
                                </button>
                                <button
                                    type="button"
                                    onClick={handleConfirm}
                                    disabled={isPending}
                                    className="inline-flex items-center gap-2 px-6 py-3 bg-brand-500 text-white rounded-lg hover:bg-brand-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {isPending ? (
                                        <>
                                            <svg
                                                className="animate-spin h-5 w-5"
                                                xmlns="http://www.w3.org/2000/svg"
                                                fill="none"
                                                viewBox="0 0 24 24"
                                            >
                                                <circle
                                                    className="opacity-25"
                                                    cx="12"
                                                    cy="12"
                                                    r="10"
                                                    stroke="currentColor"
                                                    strokeWidth="4"
                                                ></circle>
                                                <path
                                                    className="opacity-75"
                                                    fill="currentColor"
                                                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                                ></path>
                                            </svg>
                                            Creating...
                                        </>
                                    ) : (
                                        t(
                                            "groups.form.actions.confirm",
                                            "Confirm Group"
                                        )
                                    )}
                                </button>
                            </div>
                        ) : (
                            <button
                                type="button"
                                onClick={handleNext}
                                className="inline-flex items-center gap-2 px-6 py-3 bg-brand-500 text-white rounded-lg hover:bg-brand-600 transition-colors"
                            >
                                {t("common.next", "Next")}
                                <svg
                                    className="w-5 h-5 rtl:rotate-180"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M9 5l7 7-7 7"
                                    />
                                </svg>
                            </button>
                        )}
                    </div>
                </Form>
            </div>

            <SimilarGroupsModal
                isOpen={isSimilarGroupsModalOpen}
                onClose={() => setIsSimilarGroupsModalOpen(false)}
                groups={recommendedGroups}
                matchCount={recommendationsData?.totalFound}
                onViewDetails={handleViewSimilarGroupDetails}
            />
        </PageWrapper>
    );
}
