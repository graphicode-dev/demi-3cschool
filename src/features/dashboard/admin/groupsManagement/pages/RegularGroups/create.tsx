import { useState, useMemo, useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Form } from "@/design-system/components/form";
import {
    StepIndicator,
    FormSection,
    GroupSummary,
    SimilarGroupsModal,
} from "../../components";
import { groupsPaths } from "../../navigation/paths";
import {
    useCreateGroup,
    useGroupRecommendations,
    type GroupRecommendPayload,
    type GroupRecommendation,
} from "../../api";
import { ProgramsCurriculum } from "@/features/dashboard/admin/learning/types";
import { useCoursesList } from "@/features/dashboard/admin/learning/pages/courses";
import { useLevelsByCourse } from "@/features/dashboard/admin/learning/pages/levels";
import PageWrapper from "@/design-system/components/PageWrapper";
import { useMutationHandler } from "@/shared/api";

const groupFormSchema = z
    .object({
        groupName: z.string().min(1, "Group name is required").max(255),
        programId: z.string().optional(), // Only used for fetching courses, not sent to API
        courseId: z.string().min(1, "Course is required"),
        levelId: z.string().min(1, "Level is required"),
        days: z.string().min(1, "Day is required"),
        startTime: z.string().min(1, "Start time is required"),
        endTime: z.string().min(1, "End time is required"),
        ageGroupId: z.string().min(1, "Age group is required"),
        capacity: z.string().min(1, "Capacity is required"),
        courseTitle: z.string().optional(),
        levelTitle: z.string().optional(),
    })
    .refine(
        (data) => {
            // If courseId is selected, programId should have been selected to enable it
            // But we don't want to block submission if courseId is valid
            return true; // Always pass validation, programId is just for UI logic
        },
        {
            message: "Program must be selected to choose a course",
            path: ["programId"],
        }
    );

type GroupFormData = z.infer<typeof groupFormSchema>;

const STEPS = [
    {
        id: "basic",
        labelKey: "groups.form.steps.basic",
        label: "Basic Information",
    },
    {
        id: "program",
        labelKey: "groups.form.steps.program",
        label: "Program & Course",
    },
    {
        id: "schedule",
        labelKey: "groups.form.steps.schedule",
        label: "Schedule",
    },
    {
        id: "ageGroup",
        labelKey: "groups.form.steps.ageGroup",
        label: "Age Group",
    },
    {
        id: "capacity",
        labelKey: "groups.form.steps.capacity",
        label: "Capacity",
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
    level: recommendation.group.level.title,
    course: recommendation.group.course.title,
    status: recommendation.group.isActive ? "Active" : "Inactive",
    days: recommendation.group.schedules
        .map((s) => s.dayOfWeek.charAt(0).toUpperCase() + s.dayOfWeek.slice(1))
        .join(", "),
    times: recommendation.group.schedules[0]
        ? `${recommendation.group.schedules[0].startTime.slice(0, 5)} - ${recommendation.group.schedules[0].endTime.slice(0, 5)}`
        : "-",
});

const MOCK_PROGRAMS = [
    { value: "standard", label: "Standard Learning" },
    { value: "professional", label: "Professional Learning" },
];

const MOCK_AGE_GROUPS = [
    { value: "1", label: "6-8 years" },
    { value: "2", label: "9-12 years" },
    { value: "3", label: "13-16 years" },
    { value: "4", label: "17+ years" },
];

const DAYS_OPTIONS = [
    { value: "sunday", label: "Sunday" },
    { value: "monday", label: "Monday" },
    { value: "tuesday", label: "Tuesday" },
    { value: "wednesday", label: "Wednesday" },
    { value: "thursday", label: "Thursday" },
    { value: "friday", label: "Friday" },
    { value: "saturday", label: "Saturday" },
];

export default function RegularGroupCreate() {
    const { t } = useTranslation("groupsManagement");
    const navigate = useNavigate();
    const [currentStep, setCurrentStep] = useState(0);
    const [isSimilarGroupsModalOpen, setIsSimilarGroupsModalOpen] =
        useState(false);

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
            programId: "",
            courseId: "",
            levelId: "",
            days: "",
            startTime: "",
            endTime: "",
            ageGroupId: "",
            capacity: "10",
            courseTitle: "",
            levelTitle: "",
        },
    });

    // Only register fields that are NOT controlled by Controller
    useEffect(() => {
        register("days");
        register("ageGroupId");
        register("capacity");
    }, [register]);

    const stepFields: Record<number, (keyof GroupFormData)[]> = useMemo(
        () => ({
            0: ["groupName"],
            1: ["programId", "courseId", "levelId"],
            2: ["days", "startTime", "endTime"],
            3: ["ageGroupId"],
            4: ["capacity"],
            5: [], // Confirmation step has no new fields
        }),
        []
    );

    // Use getValues for accessing form values without reactivity warnings
    const formValues = getValues();
    const programId = watch("programId");
    const courseId = watch("courseId");

    const prevProgramId = useRef<string | undefined>(programId);
    const prevCourseId = useRef<string | undefined>(courseId);

    useEffect(() => {
        // ignore empty transient values during unmount / rerender
        if (!programId) return;

        if (prevProgramId.current !== programId) {
            setValue("courseId", "", {
                shouldDirty: true,
                shouldValidate: true,
            });
            setValue("levelId", "", {
                shouldDirty: true,
                shouldValidate: true,
            });
            prevProgramId.current = programId;
        }
    }, [programId, setValue]);

    useEffect(() => {
        if (!courseId) return;

        if (prevCourseId.current !== courseId) {
            setValue("levelId", "", {
                shouldDirty: true,
                shouldValidate: true,
            });
            prevCourseId.current = courseId;
        }
    }, [courseId, setValue]);

    // Use stable values that won't disappear
    const selectedProgramId: ProgramsCurriculum | undefined =
        programId && (programId === "standard" || programId === "professional")
            ? (programId as ProgramsCurriculum)
            : undefined;

    const {
        data: coursesData,
        isLoading: isLoadingCourses,
        error: coursesError,
    } = useCoursesList(
        selectedProgramId
            ? { programs_curriculum: selectedProgramId }
            : undefined,
        {
            enabled: !!selectedProgramId,
        }
    );

    const courses = useMemo(() => {
        if (!coursesData) {
            return [];
        }
        // If it's a paginated response with items
        if ("items" in coursesData && Array.isArray(coursesData.items)) {
            return coursesData.items;
        }
        // If the response is directly an array
        if (Array.isArray(coursesData)) {
            return coursesData;
        }
        return [];
    }, [coursesData]);

    const selectedCourseId = courseId || formValues.courseId;

    const {
        data: levelsData,
        isLoading: isLoadingLevels,
        error: levelsError,
    } = useLevelsByCourse({
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

    const recommendationPayload: GroupRecommendPayload | null = useMemo(() => {
        if (formValues.courseId && formValues.levelId && formValues.capacity) {
            return {
                course_id: formValues.courseId,
                level_id: formValues.levelId,
                group_type: "regular",
                capacity: parseInt(formValues.capacity, 10),
                limit: 10,
            };
        }
        return null;
    }, [formValues]);

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

    const getLabel = (
        options: { value: string; label: string }[],
        value: string
    ) => {
        const found = options.find((opt) => opt.value === value);
        return found?.label || "";
    };

    const courseOptions = useMemo(() => {
        if (!Array.isArray(courses)) {
            return [];
        }
        const options = courses.map(
            (course: { id: string; title: string }) => ({
                value: String(course.id),
                label: course.title,
            })
        );
        return options;
    }, [courses, coursesData]);

    const levelOptions = useMemo(() => {
        if (!Array.isArray(levels)) {
            return [];
        }
        const options = levels.map((level: { id: string; title: string }) => ({
            value: String(level.id),
            label: level.title,
        }));
        return options;
    }, [levels, levelsData]);

    const summaryData = useMemo(() => {
        const courseLabel =
            formValues.courseTitle ||
            getLabel(courseOptions, formValues.courseId);
        const levelLabel =
            formValues.levelTitle || getLabel(levelOptions, formValues.levelId);

        return {
            groupName: formValues.groupName,
            program: "Standard Learning",
            course: courseLabel,
            level: levelLabel,
            days: formValues.days
                ? [getLabel(DAYS_OPTIONS, formValues.days)]
                : [],
            startTime: formValues.startTime,
            endTime: formValues.endTime,
            ageGroup: getLabel(MOCK_AGE_GROUPS, formValues.ageGroupId),
            capacity: parseInt(formValues.capacity, 10) || 0,
            locationType: "Online",
            groupType: "General",
        };
    }, [formValues, courseOptions, levelOptions]);

    const handleNext = async () => {
        const fields = stepFields[currentStep];
        const isValid = await trigger(fields);

        if (isValid && currentStep < STEPS.length - 1) {
            console.log("=== Form Values Changed ===");
            console.log("watch() values:", formValues);
            setCurrentStep((prev) => prev + 1);
        }
    };

    const handleBack = () => {
        if (currentStep > 0) {
            setCurrentStep((prev) => prev - 1);
        } else {
            navigate(groupsPaths.regularList());
        }
    };

    const onSubmit = (data: GroupFormData) => {
        const payload = {
            course_id: data.courseId,
            level_id: data.levelId,
            name: data.groupName,
            maxCapacity: parseInt(data.capacity, 10),
            groupType: "regular" as const,
            min_age: parseInt(data.ageGroupId, 10),
            max_age: parseInt(data.ageGroupId, 10) + 2,
            groupSchedules: [
                {
                    day_of_week: data.days as any,
                    startTime: data.startTime,
                    endTime: data.endTime,
                },
            ],
        };

        execute(() => mutateAsync(payload), {
            successMessage: t(
                "groups.messages.createSuccess",
                "Group created successfully"
            ),
            onSuccess: () => navigate(groupsPaths.regularList()),
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
                            "groups.form.sections.programCourse",
                            "Program & Course"
                        )}
                    >
                        <div className="space-y-6">
                            {/* Program Dropdown - Using Controller */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    {t(
                                        "groups.form.fields.program.label",
                                        "Program"
                                    )}
                                    <span className="text-red-500 ml-1">*</span>
                                </label>
                                <Controller
                                    name="programId"
                                    control={control}
                                    render={({ field }) => (
                                        <select
                                            {...field}
                                            value={field.value || ""}
                                            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-brand-500 focus:border-transparent"
                                            onChange={(e) => {
                                                console.log(e.target.value);
                                                field.onChange(e.target.value);
                                            }}
                                        >
                                            <option value="">
                                                {t(
                                                    "groups.form.fields.program.placeholder",
                                                    "Select Program"
                                                )}
                                            </option>
                                            {MOCK_PROGRAMS.map((program) => (
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
                                {errors.programId && (
                                    <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                                        {errors.programId.message}
                                    </p>
                                )}
                            </div>

                            {/* Course Dropdown - Using Controller */}
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
                                            value={field.value || ""}
                                            disabled={
                                                !formValues.programId ||
                                                courseOptions.length === 0
                                            }
                                            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-brand-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
                                            onChange={(e) => {
                                                const id = e.target.value;
                                                field.onChange(id);

                                                const label =
                                                    courseOptions.find(
                                                        (o) => o.value === id
                                                    )?.label ?? "";
                                                setValue("courseTitle", label, {
                                                    shouldDirty: true,
                                                });
                                            }}
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

                            {/* Level Dropdown - Using Controller */}
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
                                            value={field.value || ""}
                                            disabled={
                                                !formValues.courseId ||
                                                levelOptions.length === 0
                                            }
                                            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-brand-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
                                            onChange={(e) => {
                                                const id = e.target.value;
                                                field.onChange(id);

                                                const label =
                                                    levelOptions.find(
                                                        (o) => o.value === id
                                                    )?.label ?? "";
                                                setValue("levelTitle", label, {
                                                    shouldDirty: true,
                                                });
                                            }}
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
                );

            case 2:
                return (
                    <FormSection
                        title={t("groups.form.sections.schedule", "Schedule")}
                    >
                        <div className="space-y-6">
                            {/* Days Dropdown - Using Controller */}
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

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <Form.Input
                                    name="startTime"
                                    type={{
                                        type: "text",
                                        placeholder: t(
                                            "groups.form.fields.startTime.placeholder",
                                            "e.g., 10:00 AM"
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
                                        type: "text",
                                        placeholder: t(
                                            "groups.form.fields.endTime.placeholder",
                                            "e.g., 12:00 PM"
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
                );

            case 3:
                return (
                    <FormSection
                        title={t("groups.form.sections.ageGroup", "Age Group")}
                    >
                        {/* Age Group Dropdown - Using Controller */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                {t(
                                    "groups.form.fields.ageGroup.label",
                                    "Age Group"
                                )}
                                <span className="text-red-500 ml-1">*</span>
                            </label>
                            <Controller
                                name="ageGroupId"
                                control={control}
                                render={({ field }) => (
                                    <select
                                        {...field}
                                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-brand-500 focus:border-transparent"
                                    >
                                        <option value="">
                                            {t(
                                                "groups.form.fields.ageGroup.placeholder",
                                                "Select Age Group"
                                            )}
                                        </option>
                                        {MOCK_AGE_GROUPS.map((ageGroup) => (
                                            <option
                                                key={ageGroup.value}
                                                value={ageGroup.value}
                                            >
                                                {ageGroup.label}
                                            </option>
                                        ))}
                                    </select>
                                )}
                            />
                            {errors.ageGroupId && (
                                <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                                    {errors.ageGroupId.message}
                                </p>
                            )}
                        </div>
                    </FormSection>
                );

            case 4:
                return (
                    <FormSection
                        title={t("groups.form.sections.capacity", "Capacity")}
                    >
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
                    </FormSection>
                );

            case 5:
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
            />
        </PageWrapper>
    );
}
