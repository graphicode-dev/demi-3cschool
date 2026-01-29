/**
 * Step 3: Course & Level Step
 *
 * Select course and level from dropdowns.
 */

import { memo, useMemo, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { DropdownInput } from "@/design-system/components/form";
import { useInvoiceWizardStore, selectCourse, selectLevel } from "../../stores";
import { useCoursesList, Course } from "@/features/learning/pages/courses/api";
import { useLevelsByCourse, Level } from "@/features/learning/pages/levels/api";
import {
    Course as StoreCourse,
    Level as StoreLevel,
} from "../../types/store.types";
import { LoadingState } from "@/design-system";

export const CourseLevelStep = memo(function CourseLevelStep() {
    const { t } = useTranslation("salesSubscription");

    const selectedCourse = useInvoiceWizardStore(selectCourse);
    const selectedLevel = useInvoiceWizardStore(selectLevel);
    const setCourse = useInvoiceWizardStore((state) => state.setCourse);
    const setLevel = useInvoiceWizardStore((state) => state.setLevel);

    // Fetch courses from API
    const { data: coursesData, isLoading: isLoadingCourses } = useCoursesList();

    // Fetch levels for selected course
    const { data: levelsData, isLoading: isLoadingLevels } = useLevelsByCourse({
        courseId: selectedCourse?.id || "",
    });

    // Extract courses array (API returns array directly or paginated response)
    const courses = useMemo(() => {
        if (!coursesData) return [];
        // Handle both array and paginated response
        if (Array.isArray(coursesData)) return coursesData;
        return coursesData.items || [];
    }, [coursesData]);

    // Extract levels array (API returns array directly or paginated response)
    const levels = useMemo(() => {
        if (!levelsData) return [];
        // Handle both array and paginated response
        if (Array.isArray(levelsData)) return levelsData;
        return levelsData.items || [];
    }, [levelsData]);

    const courseOptions = useMemo(
        () =>
            courses.map((c: Course) => ({
                value: String(c.id),
                label: c.title,
            })),
        [courses]
    );

    const levelOptions = useMemo(
        () =>
            levels.map((l: Level) => ({
                value: String(l.id),
                label: l.title,
            })),
        [levels]
    );

    const handleCourseSelect = useCallback(
        (value: string) => {
            const apiCourse = courses.find(
                (c: Course) => String(c.id) === value
            );
            if (apiCourse) {
                const course: StoreCourse = {
                    id: String(apiCourse.id),
                    name: apiCourse.title,
                };
                setCourse(course);
                // Clear level when course changes
                setLevel(null);
            } else {
                setCourse(null);
            }
        },
        [courses, setCourse, setLevel]
    );

    const handleLevelSelect = useCallback(
        (value: string) => {
            const apiLevel = levels.find((l: Level) => String(l.id) === value);
            if (apiLevel) {
                const level: StoreLevel = {
                    id: String(apiLevel.id),
                    name: apiLevel.title,
                };
                setLevel(level);
            } else {
                setLevel(null);
            }
        },
        [levels, setLevel]
    );

    if (isLoadingCourses) return <LoadingState />;

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-xl font-semibold">
                    {t(
                        "purchases.wizard.steps.courseLevel.title",
                        "Select Course & Level"
                    )}
                </h2>
            </div>

            <div className="space-y-4">
                <div>
                    <label className="text-sm font-medium mb-2 block">
                        {t(
                            "purchases.wizard.steps.courseLevel.course",
                            "Course"
                        )}{" "}
                        <span className="text-destructive">*</span>
                    </label>
                    <DropdownInput
                        options={courseOptions}
                        value={selectedCourse?.id || ""}
                        onChange={handleCourseSelect}
                        placeholder={t(
                            "purchases.wizard.steps.courseLevel.coursePlaceholder",
                            "Select a course"
                        )}
                    />
                </div>

                <div>
                    <label className="text-sm font-medium mb-2 block">
                        {t("purchases.wizard.steps.courseLevel.level", "Level")}{" "}
                        <span className="text-destructive">*</span>
                    </label>
                    <DropdownInput
                        options={levelOptions}
                        value={selectedLevel?.id || ""}
                        onChange={handleLevelSelect}
                        placeholder={t(
                            "purchases.wizard.steps.courseLevel.levelPlaceholder",
                            "Select a level"
                        )}
                    />
                </div>
            </div>
        </div>
    );
});

export default CourseLevelStep;
