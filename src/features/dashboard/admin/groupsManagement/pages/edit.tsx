import { useState, useCallback, useMemo, useEffect } from "react";
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

import type {
    Group,
    GroupUpdatePayload,
    GroupSchedulePayload,
} from "../types/groups.types";
import { ProgramsCurriculum } from "@/features/dashboard/admin/learning/types";
import { useCoursesList } from "@/features/dashboard/admin/learning/pages/courses";
import { useLevelsByCourse } from "@/features/dashboard/admin/learning/pages/levels";
import PageWrapper from "@/design-system/components/PageWrapper";

const editGroupSchema = z.object({
    groupName: z.string().min(1, "Group name is required").max(255),
    programType: z.enum(["standard", "professional"]),
    courseId: z.string().min(1, "Course is required"),
    levelId: z.string().min(1, "Level is required"),
    ageGroups: z.array(z.string()).min(1, "At least one age group is required"),
    groupType: z.enum(["regular", "semi-private", "private"]),
    locationType: z.enum(["online", "offline", "hybrid"]),
    maxCapacity: z.number().min(1, "Capacity must be at least 1").max(100),
    days: z.array(z.string()).min(1, "At least one day is required"),
    schedules: z.array(
        z.object({
            day: z.string(),
            startTime: z.string().min(1, "Start time is required"),
            endTime: z.string().min(1, "End time is required"),
        })
    ),
});

type EditGroupFormData = z.infer<typeof editGroupSchema>;

const MOCK_COURSES = [
    { value: "1", label: "Web Development" },
    { value: "2", label: "Python Programming" },
    { value: "3", label: "Data Science" },
    { value: "4", label: "Scratch" },
    { value: "5", label: "Game Development" },
];

const MOCK_LEVELS = [
    { value: "1", label: "Level 1 - Beginner" },
    { value: "2", label: "Level 2 - Intermediate" },
    { value: "3", label: "Level 3 - Advanced" },
];

const AGE_GROUP_OPTIONS = [
    { value: "6-8", label: "6-8 Ages" },
    { value: "9-12", label: "9-12 Ages" },
    { value: "13-17", label: "13-17 Ages" },
];

const LOCATION_TYPES = [
    { value: "online", label: "Online" },
    { value: "offline", label: "Offline" },
    { value: "hybrid", label: "Hybrid" },
];

const GROUP_TYPES = [
    { value: "regular", label: "Regular" },
    { value: "semi-private", label: "Semi Private" },
    { value: "private", label: "Private" },
];

const PROGRAM_TYPES = [
    { value: "standard", label: "Standard Learning" },
    { value: "professional", label: "Professional Learning" },
];

const DAY_MAP: Record<string, string> = {
    sun: "sunday",
    mon: "monday",
    tue: "tuesday",
    wed: "wednesday",
    thu: "thursday",
    fri: "friday",
    sat: "saturday",
};

const REVERSE_DAY_MAP: Record<string, string> = {
    sunday: "sun",
    monday: "mon",
    tuesday: "tue",
    wednesday: "wed",
    thursday: "thu",
    friday: "fri",
    saturday: "sat",
};

const DAYS_OPTIONS = [
    { value: "sun", label: "Sun" },
    { value: "mon", label: "Mon" },
    { value: "tue", label: "Tue" },
    { value: "wed", label: "Wed" },
    { value: "thu", label: "Thu" },
    { value: "fri", label: "Fri" },
    { value: "sat", label: "Sat" },
];

const getDefaultFormData = (group: Group): EditGroupFormData => {
    const ageGroup = `${group.ageRule.minAge}-${group.ageRule.maxAge - 2}`;
    const days = group.schedules.map(
        (s) => REVERSE_DAY_MAP[s.dayOfWeek] || s.dayOfWeek
    );

    return {
        groupName: group.name,
        programType: "standard", // Default since not in Group entity
        courseId: String(group.courseId), // Convert to string
        levelId: String(group.levelId), // Convert to string
        ageGroups: [ageGroup],
        groupType:
            group.groupType === "semi_private"
                ? "semi-private"
                : group.groupType,
        locationType: group.locationType || "online",
        maxCapacity: group.maxCapacity,
        days,
        schedules: group.schedules.map((s) => ({
            day: REVERSE_DAY_MAP[s.dayOfWeek] || s.dayOfWeek,
            startTime: s.startTime,
            endTime: s.endTime,
        })),
    };
};

export default function EditGroupPage() {
    const { t } = useTranslation("groupsManagement");
    const navigate = useNavigate();
    const { id: groupId } = useParams<{ id: string }>();
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

    // Get courses based on program type
    const selectedProgramType: ProgramsCurriculum | undefined = group
        ? ("standard" as ProgramsCurriculum)
        : undefined;

    const { data: coursesData, isLoading: isLoadingCourses } = useCoursesList(
        selectedProgramType
            ? { programs_curriculum: selectedProgramType }
            : undefined,
        {
            enabled: !!selectedProgramType,
        }
    );

    const courses = useMemo(() => {
        if (!coursesData) return [];
        if ("items" in coursesData && Array.isArray(coursesData.items)) {
            return coursesData.items;
        }
        if (Array.isArray(coursesData)) {
            return coursesData;
        }
        return [];
    }, [coursesData]);

    // Get levels based on selected course
    const selectedCourseId = group?.courseId || "";

    const { data: levelsData, isLoading: isLoadingLevels } = useLevelsByCourse({
        courseId: selectedCourseId,
    });

    const levels = useMemo(() => {
        if (!levelsData) return [];
        if ("items" in levelsData && Array.isArray(levelsData.items)) {
            return levelsData.items;
        }
        if (Array.isArray(levelsData)) {
            return levelsData;
        }
        return [];
    }, [levelsData]);

    const courseOptions = useMemo(() => {
        return courses.map(
            (course: { id: string | number; title: string }) => ({
                value: String(course.id), // Ensure string value
                label: course.title,
            })
        );
    }, [courses]);

    const levelOptions = useMemo(() => {
        return levels.map((level: { id: string | number; title: string }) => ({
            value: String(level.id), // Ensure string value
            label: level.title,
        }));
    }, [levels]);

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
            programType: "standard",
            courseId: "",
            levelId: "",
            ageGroups: [],
            groupType: "regular",
            locationType: "online",
            maxCapacity: 10,
            days: [],
            schedules: [],
        },
    });

    // Update form when group data is loaded
    useEffect(() => {
        if (group) {
            const formData = getDefaultFormData(group);
            reset(formData);
        }
    }, [group, reset]);

    const selectedDays = watch("days");
    const schedules = watch("schedules");

    const handleDayToggle = useCallback(
        (day: string) => {
            const currentDays = selectedDays || [];
            const currentSchedules = schedules || [];

            if (currentDays.includes(day)) {
                setValue(
                    "days",
                    currentDays.filter((d) => d !== day)
                );
                setValue(
                    "schedules",
                    currentSchedules.filter((s) => s.day !== day)
                );
            } else {
                setValue("days", [...currentDays, day]);
                setValue("schedules", [
                    ...currentSchedules,
                    { day, startTime: "10:00 AM", endTime: "12:00 PM" },
                ]);
            }
        },
        [selectedDays, schedules, setValue]
    );

    const updateScheduleTime = useCallback(
        (day: string, field: "startTime" | "endTime", value: string) => {
            const currentSchedules = schedules || [];
            const updatedSchedules = currentSchedules.map((s) =>
                s.day === day ? { ...s, [field]: value } : s
            );
            setValue("schedules", updatedSchedules);
        },
        [schedules, setValue]
    );

    // Helper function to convert time to H:i format (24-hour)
    const formatTimeForAPI = (timeString: string): string => {
        if (!timeString) return "";

        console.log("Original time:", timeString);

        // If already in H:i format, return as is
        if (/^\d{1,2}:\d{2}$/.test(timeString)) {
            console.log("Already in H:i format:", timeString);
            return timeString;
        }

        // Convert 12-hour format (e.g., "10:00 AM") to 24-hour format (e.g., "10:00")
        const match = timeString.match(/(\d{1,2}):(\d{2})\s*(AM|PM)/i);
        if (match) {
            const [, hours, minutes, period] = match;
            let hour = parseInt(hours);
            const minute = minutes;

            console.log("Parsed time:", {
                hours,
                minutes,
                period,
                hour,
                minute,
            });

            if (period.toUpperCase() === "PM" && hour !== 12) {
                hour = hour + 12;
            } else if (period.toUpperCase() === "AM" && hour === 12) {
                hour = 0;
            }

            const formattedTime = `${hour.toString().padStart(2, "0")}:${minute}`;
            console.log("Formatted time:", formattedTime);
            return formattedTime;
        }

        // Fallback: try to extract just HH:MM from any format
        const timeMatch = timeString.match(/(\d{1,2}):(\d{2})/);
        if (timeMatch) {
            const [, hours, minutes] = timeMatch;
            const hour = parseInt(hours);
            const minute = minutes;
            const formattedTime = `${hour.toString().padStart(2, "0")}:${minute}`;
            console.log("Extracted time:", formattedTime);
            return formattedTime;
        }

        console.log("Could not parse time, returning original");
        return timeString;
    };

    const onSubmit = (data: EditGroupFormData) => {
        if (!groupId) return;

        // Transform form data to API payload
        const ageGroup = data.ageGroups[0];
        const [minAge] = ageGroup.split("-").map(Number);

        const payload: GroupUpdatePayload = {
            name: data.groupName,
            course_id: data.courseId,
            level_id: data.levelId,
            maxCapacity: data.maxCapacity,
            groupType:
                data.groupType === "semi-private"
                    ? "semi_private"
                    : (data.groupType as "regular" | "private"),
            min_age: minAge,
            max_age: minAge + 2,
            groupSchedules: data.schedules.map((schedule) => ({
                day_of_week: DAY_MAP[schedule.day] as any,
                startTime: formatTimeForAPI(schedule.startTime),
                endTime: formatTimeForAPI(schedule.endTime),
            })),
        };

        execute(() => mutateAsync({ id: groupId, data: payload }), {
            successMessage: t(
                "groups.messages.updateSuccess",
                "Group updated successfully"
            ),
            onSuccess: () => navigate(groupsPaths.regularView(groupId)),
        });
    };

    const getDayLabel = useCallback((dayValue: string) => {
        const day = DAYS_OPTIONS.find((d) => d.value === dayValue);
        return day?.label || dayValue;
    }, []);

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

                    {/* Program & Course */}
                    <FormSection
                        title={t(
                            "groups.form.sections.programCourse",
                            "Program & Course"
                        )}
                    >
                        <div className="space-y-6">
                            {/* Program Type */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                                    {t(
                                        "groups.form.fields.programType.label",
                                        "Program Type"
                                    )}{" "}
                                    <span className="text-red-500">*</span>
                                </label>
                                <Controller
                                    name="programType"
                                    control={control}
                                    render={({ field }) => (
                                        <select
                                            {...field}
                                            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-brand-500 focus:border-transparent"
                                        >
                                            {PROGRAM_TYPES.map((program) => (
                                                <option
                                                    key={program.value}
                                                    value={program.value}
                                                >
                                                    {program.label}
                                                </option>
                                            ))}
                                        </select>
                                    )}
                                />
                                {errors.programType && (
                                    <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                                        {errors.programType.message}
                                    </p>
                                )}
                            </div>

                            {/* Course Dropdown */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    {t(
                                        "groups.form.fields.course.label",
                                        "Course"
                                    )}
                                    <span className="text-red-500 ml-1">*</span>
                                </label>
                                <Controller
                                    name="courseId"
                                    control={control}
                                    render={({ field }) => (
                                        <select
                                            {...field}
                                            disabled={
                                                isLoadingCourses ||
                                                courseOptions.length === 0
                                            }
                                            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-brand-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            <option value="">
                                                {t(
                                                    "groups.form.fields.course.placeholder",
                                                    "Select Course"
                                                )}
                                            </option>
                                            {courseOptions.map((course) => (
                                                <option
                                                    key={course.value}
                                                    value={course.value}
                                                >
                                                    {course.label}
                                                </option>
                                            ))}
                                        </select>
                                    )}
                                />
                                {errors.courseId && (
                                    <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                                        {errors.courseId.message}
                                    </p>
                                )}
                            </div>

                            {/* Level Dropdown */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    {t(
                                        "groups.form.fields.level.label",
                                        "Level"
                                    )}
                                    <span className="text-red-500 ml-1">*</span>
                                </label>
                                <Controller
                                    name="levelId"
                                    control={control}
                                    render={({ field }) => (
                                        <select
                                            {...field}
                                            disabled={
                                                isLoadingLevels ||
                                                levelOptions.length === 0
                                            }
                                            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-brand-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            <option value="">
                                                {t(
                                                    "groups.form.fields.level.placeholder",
                                                    "Select Level"
                                                )}
                                            </option>
                                            {levelOptions.map((level) => (
                                                <option
                                                    key={level.value}
                                                    value={level.value}
                                                >
                                                    {level.label}
                                                </option>
                                            ))}
                                        </select>
                                    )}
                                />
                                {errors.levelId && (
                                    <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                                        {errors.levelId.message}
                                    </p>
                                )}
                            </div>
                        </div>
                    </FormSection>

                    {/* Student Details */}
                    <FormSection
                        title={t(
                            "groups.edit.sections.studentDetails",
                            "Student Details"
                        )}
                    >
                        <div className="space-y-6">
                            {/* Age Group */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                                    {t(
                                        "groups.form.fields.ageGroup.label",
                                        "Age Group"
                                    )}{" "}
                                    <span className="text-red-500">*</span>
                                </label>
                                <Controller
                                    name="ageGroups"
                                    control={control}
                                    render={({ field }) => (
                                        <div className="flex items-center gap-6">
                                            {AGE_GROUP_OPTIONS.map((option) => (
                                                <label
                                                    key={option.value}
                                                    className="flex items-center gap-2 cursor-pointer"
                                                >
                                                    <input
                                                        type="checkbox"
                                                        checked={field.value?.includes(
                                                            option.value
                                                        )}
                                                        onChange={(e) => {
                                                            const current =
                                                                field.value ||
                                                                [];
                                                            if (
                                                                e.target.checked
                                                            ) {
                                                                field.onChange([
                                                                    ...current,
                                                                    option.value,
                                                                ]);
                                                            } else {
                                                                field.onChange(
                                                                    current.filter(
                                                                        (v) =>
                                                                            v !==
                                                                            option.value
                                                                    )
                                                                );
                                                            }
                                                        }}
                                                        className="w-4 h-4 text-brand-500 border-gray-300 rounded focus:ring-brand-500"
                                                    />
                                                    <span className="text-sm text-gray-700 dark:text-gray-300">
                                                        {option.label}
                                                    </span>
                                                </label>
                                            ))}
                                        </div>
                                    )}
                                />
                                <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                                    {t(
                                        "groups.edit.fields.ageGroup.hint",
                                        "Select one or more age groups for this class"
                                    )}
                                </p>
                            </div>

                            {/* Group Type */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                                    {t(
                                        "groups.edit.fields.groupType.label",
                                        "Group Type"
                                    )}{" "}
                                    <span className="text-red-500">*</span>
                                </label>
                                <Controller
                                    name="groupType"
                                    control={control}
                                    render={({ field }) => (
                                        <div className="flex items-center gap-6">
                                            <label className="flex items-center gap-2 cursor-pointer">
                                                <input
                                                    type="radio"
                                                    {...field}
                                                    value="regular"
                                                    checked={
                                                        field.value ===
                                                        "regular"
                                                    }
                                                    className="w-4 h-4 text-brand-500 border-gray-300 focus:ring-brand-500"
                                                />
                                                <span className="text-sm text-gray-700 dark:text-gray-300">
                                                    {t(
                                                        "groups.edit.fields.groupType.general",
                                                        "General"
                                                    )}
                                                </span>
                                            </label>
                                            <label className="flex items-center gap-2 cursor-pointer">
                                                <input
                                                    type="radio"
                                                    {...field}
                                                    value="semi-private"
                                                    checked={
                                                        field.value ===
                                                        "semi-private"
                                                    }
                                                    className="w-4 h-4 text-brand-500 border-gray-300 focus:ring-brand-500"
                                                />
                                                <span className="text-sm text-gray-700 dark:text-gray-300">
                                                    {t(
                                                        "groups.edit.fields.groupType.semiPrivate",
                                                        "Semi-Private"
                                                    )}
                                                </span>
                                            </label>
                                            <label className="flex items-center gap-2 cursor-pointer">
                                                <input
                                                    type="radio"
                                                    {...field}
                                                    value="private"
                                                    checked={
                                                        field.value ===
                                                        "private"
                                                    }
                                                    className="w-4 h-4 text-brand-500 border-gray-300 focus:ring-brand-500"
                                                />
                                                <span className="text-sm text-gray-700 dark:text-gray-300">
                                                    {t(
                                                        "groups.edit.fields.groupType.private",
                                                        "Private"
                                                    )}
                                                </span>
                                            </label>
                                        </div>
                                    )}
                                />
                            </div>
                        </div>
                    </FormSection>

                    {/* Location & Capacity */}
                    <FormSection
                        title={t(
                            "groups.edit.sections.locationCapacity",
                            "Location & Capacity"
                        )}
                    >
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <Form.Input
                                    name="locationType"
                                    type={{
                                        type: "dropdown",
                                        placeholder: t(
                                            "groups.edit.fields.locationType.placeholder",
                                            "Select Location Type"
                                        ),
                                        options: LOCATION_TYPES,
                                    }}
                                    label={{
                                        text: t(
                                            "groups.edit.fields.locationType.label",
                                            "Location Type"
                                        ),
                                        required: true,
                                    }}
                                    style={{ size: "md" }}
                                />
                                <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                                    {t(
                                        "groups.edit.fields.locationType.hint",
                                        "All groups are conducted online"
                                    )}
                                </p>
                            </div>
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
                                        "groups.edit.fields.maxCapacity.label",
                                        "Maximum Capacity"
                                    ),
                                    required: true,
                                }}
                                style={{ size: "md" }}
                            />
                        </div>
                    </FormSection>

                    {/* Schedule */}
                    <FormSection
                        title={t("groups.form.sections.schedule", "Schedule")}
                    >
                        <div className="space-y-6">
                            {/* Days Selection */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                                    {t("groups.form.fields.days.label", "Days")}{" "}
                                    <span className="text-red-500">*</span>
                                </label>
                                <div className="flex flex-wrap gap-2">
                                    {DAYS_OPTIONS.map((day) => {
                                        const isSelected =
                                            selectedDays?.includes(day.value);
                                        return (
                                            <button
                                                key={day.value}
                                                type="button"
                                                onClick={() =>
                                                    handleDayToggle(day.value)
                                                }
                                                aria-pressed={isSelected}
                                                aria-label={`${day.label} - ${isSelected ? "selected" : "not selected"}`}
                                                className={`px-4 py-2 text-sm font-medium rounded-lg border transition-colors ${
                                                    isSelected
                                                        ? "bg-brand-500 text-white border-brand-500"
                                                        : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600 hover:border-brand-300"
                                                }`}
                                            >
                                                {day.label}
                                            </button>
                                        );
                                    })}
                                </div>
                                <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                                    {t(
                                        "groups.edit.fields.days.hint",
                                        "Select one or more days per week"
                                    )}
                                </p>
                            </div>

                            {/* Time for Each Day */}
                            {selectedDays && selectedDays.length > 0 && (
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                                        {t(
                                            "groups.edit.fields.timeForEachDay.label",
                                            "Time for Each Day"
                                        )}{" "}
                                        <span className="text-red-500">*</span>
                                    </label>
                                    <div className="space-y-4">
                                        {selectedDays.map((dayValue) => {
                                            const schedule = schedules?.find(
                                                (s) => s.day === dayValue
                                            );
                                            return (
                                                <div
                                                    key={dayValue}
                                                    className="flex items-center gap-4"
                                                >
                                                    <div className="flex items-center gap-2 min-w-[100px]">
                                                        <input
                                                            type="checkbox"
                                                            checked={true}
                                                            readOnly
                                                            className="w-4 h-4 text-brand-500 border-gray-300 rounded focus:ring-brand-500"
                                                        />
                                                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                                            {getDayLabel(
                                                                dayValue
                                                            )}
                                                        </span>
                                                    </div>
                                                    <div className="flex items-center gap-4 flex-1">
                                                        <div className="flex-1">
                                                            <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">
                                                                {t(
                                                                    "groups.form.fields.startTime.label",
                                                                    "Start Time"
                                                                )}
                                                            </label>
                                                            <input
                                                                type="text"
                                                                value={
                                                                    schedule?.startTime ||
                                                                    ""
                                                                }
                                                                onChange={(e) =>
                                                                    updateScheduleTime(
                                                                        dayValue,
                                                                        "startTime",
                                                                        e.target
                                                                            .value
                                                                    )
                                                                }
                                                                placeholder="10:00 AM"
                                                                aria-label={`Start time for ${getDayLabel(dayValue)}`}
                                                                className="w-full px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg text-sm text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500"
                                                            />
                                                        </div>
                                                        <span className="text-gray-400 mt-5">
                                                            —
                                                        </span>
                                                        <div className="flex-1">
                                                            <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">
                                                                {t(
                                                                    "groups.form.fields.endTime.label",
                                                                    "End Time"
                                                                )}
                                                            </label>
                                                            <input
                                                                type="text"
                                                                value={
                                                                    schedule?.endTime ||
                                                                    ""
                                                                }
                                                                onChange={(e) =>
                                                                    updateScheduleTime(
                                                                        dayValue,
                                                                        "endTime",
                                                                        e.target
                                                                            .value
                                                                    )
                                                                }
                                                                placeholder="12:00 PM"
                                                                aria-label={`End time for ${getDayLabel(dayValue)}`}
                                                                className="w-full px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg text-sm text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500"
                                                            />
                                                        </div>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
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
