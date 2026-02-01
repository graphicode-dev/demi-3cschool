import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate, useParams } from "react-router-dom";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Form } from "@/design-system/components/form";
import { FormSection } from "../components";
import { groupsPaths } from "../navigation/paths";
import { useGroup, useUpdateGroup } from "../api";
import { useMutationHandler } from "@/shared/api";
import type { Group, GroupUpdatePayload } from "../types/groups.types";
import PageWrapper from "@/design-system/components/PageWrapper";

const editGroupSchema = z.object({
    groupName: z.string().min(1, "Group name is required").max(255),
    levelId: z.string().min(1, "Level is required"),
    gradeId: z.string().min(1, "Grade is required"),
    maxCapacity: z.number().min(1, "Capacity must be at least 1").max(100),
    locationType: z.enum(["online", "offline"]),
    trainerId: z.string().optional(),
    days: z.string().min(1, "Day is required"),
    startTime: z.string().min(1, "Start time is required"),
    endTime: z.string().min(1, "End time is required"),
});

type EditGroupFormData = z.infer<typeof editGroupSchema>;

const DAYS_OPTIONS = [
    { value: "friday", label: "Friday" },
    { value: "saturday", label: "Saturday" },
];

const LOCATION_TYPES = [
    { value: "online", label: "Online" },
    { value: "offline", label: "Offline" },
];

const getDefaultFormData = (group: Group): EditGroupFormData => {
    const firstSchedule = group.schedules[0];

    return {
        groupName: group.name,
        levelId: String(group.level?.id || ""),
        gradeId: String(group.grade?.id || ""),
        maxCapacity: group.maxCapacity,
        locationType: (group.locationType as "online" | "offline") || "online",
        trainerId: group.trainer?.id ? String(group.trainer.id) : "",
        days: firstSchedule?.dayOfWeek || "",
        startTime: firstSchedule?.startTime || "",
        endTime: firstSchedule?.endTime || "",
    };
};

export default function EditGroupPage() {
    const { t } = useTranslation("groupsManagement");
    const navigate = useNavigate();
    const {
        gradeId,
        levelId,
        id: groupId,
    } = useParams<{
        gradeId: string;
        levelId: string;
        id: string;
    }>();
    const { mutateAsync, isPending } = useUpdateGroup();
    const { execute } = useMutationHandler();

    // Fetch group data
    const {
        data: group,
        isLoading: isLoadingGroup,
        error: groupError,
    } = useGroup(groupId, {
        enabled: !!groupId,
    });

    // Form setup
    const {
        control,
        handleSubmit,
        formState: { errors },
        watch,
        setValue,
        reset,
    } = useForm<EditGroupFormData>({
        resolver: zodResolver(editGroupSchema),
        defaultValues: {
            groupName: "",
            levelId: "",
            gradeId: "",
            maxCapacity: 10,
            locationType: "online",
            trainerId: "",
            days: "",
            startTime: "",
            endTime: "",
        },
    });

    // Update form when group data is loaded
    useEffect(() => {
        if (group) {
            const formData = getDefaultFormData(group);
            reset(formData);
        }
    }, [group, reset]);

    const onSubmit = (data: EditGroupFormData) => {
        if (!groupId) return;

        const payload: GroupUpdatePayload = {
            level_id: parseInt(data.levelId, 10),
            name: data.groupName,
            grade_id: parseInt(data.gradeId, 10),
            maxCapacity: data.maxCapacity,
            location_type: data.locationType,
            groupSchedules: [
                {
                    day_of_week: data.days as any,
                    startTime: data.startTime,
                    endTime: data.endTime,
                },
            ],
            ...(data.locationType === "offline" && data.trainerId
                ? { trainer_id: parseInt(data.trainerId, 10) }
                : {}),
        };

        execute(() => mutateAsync({ id: groupId, data: payload }), {
            successMessage: t(
                "groups.messages.updateSuccess",
                "Group updated successfully"
            ),
            onSuccess: () =>
                navigate(groupsPaths.regularView(gradeId, levelId, groupId)),
        });
    };

    // Show loading state while fetching group data
    if (isLoadingGroup) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-500 mx-auto mb-4"></div>
                    <p className="text-gray-600 dark:text-gray-400">
                        Loading group data...
                    </p>
                </div>
            </div>
        );
    }

    // Show error state if group fetch fails
    if (groupError) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-center">
                    <div className="text-red-500 mb-4">
                        <svg
                            className="w-8 h-8 mx-auto"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                        </svg>
                    </div>
                    <p className="text-red-600 dark:text-red-400 mb-4">
                        Failed to load group data
                    </p>
                    <button
                        onClick={() => window.location.reload()}
                        className="px-4 py-2 bg-brand-500 text-white rounded-lg hover:bg-brand-600"
                    >
                        Retry
                    </button>
                </div>
            </div>
        );
    }

    return (
        <PageWrapper
            pageHeaderProps={{
                title: t("groups.edit.title", "Edit Group"),
                subtitle: t(
                    "groups.edit.subtitle",
                    "Update group details and settings"
                ),
                backButton: true,
            }}
        >
            <Form
                control={control}
                errors={errors}
                onSubmit={handleSubmit(onSubmit)}
            >
                <div className="space-y-6">
                    {/* Basic Information */}
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

                    {/* Schedule */}
                    <FormSection
                        title={t("groups.form.sections.schedule", "Schedule")}
                    >
                        <div className="space-y-6">
                            {/* Days Dropdown */}
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
                                                    "Select Day"
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

                            {/* Time inputs */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <Form.Input
                                    name="startTime"
                                    type={{
                                        type: "time",
                                        placeholder: t(
                                            "groups.form.fields.startTime.placeholder",
                                            "Select start time"
                                        ),
                                    }}
                                    label={{
                                        text: t(
                                            "groups.form.fields.startTime.label",
                                            "Start Time"
                                        ),
                                        required: true,
                                    }}
                                    style={{ size: "md" }}
                                />
                                <Form.Input
                                    name="endTime"
                                    type={{
                                        type: "time",
                                        placeholder: t(
                                            "groups.form.fields.endTime.placeholder",
                                            "Select end time"
                                        ),
                                    }}
                                    label={{
                                        text: t(
                                            "groups.form.fields.endTime.label",
                                            "End Time"
                                        ),
                                        required: true,
                                    }}
                                    style={{ size: "md" }}
                                />
                            </div>
                        </div>
                    </FormSection>

                    {/* Capacity & Location */}
                    <FormSection
                        title={t(
                            "groups.form.sections.capacityLocation",
                            "Capacity & Location"
                        )}
                    >
                        <div className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <Form.Input
                                    name="maxCapacity"
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

                                {/* Location Type Dropdown */}
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
                                                {LOCATION_TYPES.map(
                                                    (option) => (
                                                        <option
                                                            key={option.value}
                                                            value={option.value}
                                                        >
                                                            {option.label}
                                                        </option>
                                                    )
                                                )}
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

                            {/* Trainer ID - only shown when offline */}
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

                    {/* Submit Button */}
                    <div className="flex justify-end pt-6">
                        <button
                            type="submit"
                            disabled={isPending}
                            className="inline-flex items-center gap-2 px-6 py-2.5 bg-brand-500 text-white text-sm font-medium rounded-lg hover:bg-brand-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                            {isPending
                                ? t("common.saving", "Saving...")
                                : t("groups.edit.saveChanges", "Save Changes")}
                        </button>
                    </div>
                </div>
            </Form>
        </PageWrapper>
    );
}
