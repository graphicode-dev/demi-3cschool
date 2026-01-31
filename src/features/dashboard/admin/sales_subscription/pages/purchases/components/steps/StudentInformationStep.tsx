/**
 * Step 1: Student Information Step
 *
 * Search and select a student for the invoice.
 * Displays student details after selection.
 */

import { memo, useMemo, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { DropdownInput } from "@/design-system/components/form";
import { useInvoiceWizardStore, selectStudent } from "../../stores";
import { Student } from "../../types/store.types";
import {
    useStudentsList,
    Student as ApiStudent,
    PaginatedStudentData,
} from "@/features/dashboard/admin/systemManagements/api";

interface StudentInfoCardProps {
    student: Student;
}

const StudentInfoCard = memo(function StudentInfoCard({
    student,
}: StudentInfoCardProps) {
    const { t } = useTranslation("salesSubscription");

    return (
        <div className="rounded-xl border-2 border-brand-400 bg-brand-50/30 dark:bg-brand-950/20 p-5 mt-4">
            <h4 className="text-sm font-semibold text-foreground mb-4">
                {t(
                    "sales_subscription:purchases.wizard.steps.student.studentInfo",
                    "Student Information"
                )}
            </h4>
            <div className="grid grid-cols-2 gap-x-8 gap-y-4">
                <div>
                    <p className="text-xs text-muted-foreground mb-1">
                        {t(
                            "sales_subscription:purchases.wizard.steps.student.name",
                            "Name"
                        )}
                    </p>
                    <p className="text-sm font-medium text-foreground">
                        {student.name}
                    </p>
                </div>
                <div>
                    <p className="text-xs text-muted-foreground mb-1">
                        {t(
                            "sales_subscription:purchases.wizard.steps.student.studentId",
                            "Student ID"
                        )}
                    </p>
                    <p className="text-sm font-medium text-foreground">
                        {student.studentId}
                    </p>
                </div>
                <div>
                    <p className="text-xs text-muted-foreground mb-1">
                        {t(
                            "sales_subscription:purchases.wizard.steps.student.grade",
                            "Grade"
                        )}
                    </p>
                    <p className="text-sm font-medium text-foreground">
                        {student.grade}
                    </p>
                </div>
                <div>
                    <p className="text-xs text-muted-foreground mb-1">
                        {t(
                            "sales_subscription:purchases.wizard.steps.student.parentContact",
                            "Parent Contact"
                        )}
                    </p>
                    <p className="text-sm font-medium text-foreground">
                        {student.parentContact}
                    </p>
                </div>
            </div>
        </div>
    );
});

export const StudentInformationStep = memo(function StudentInformationStep() {
    const { t } = useTranslation("salesSubscription");

    const selectedStudent = useInvoiceWizardStore(selectStudent);
    const setStudent = useInvoiceWizardStore((state) => state.setStudent);

    // Fetch students from API
    const { data: studentsData, isLoading } = useStudentsList();

    // Extract students array from response (handles both paginated and non-paginated)
    const students = useMemo(() => {
        if (!studentsData) return [];
        if (Array.isArray(studentsData)) return studentsData;
        return (studentsData as PaginatedStudentData).items || [];
    }, [studentsData]);

    const dropdownOptions = useMemo(
        () =>
            students.map((s: ApiStudent) => ({
                value: String(s.id),
                label: s.name,
            })),
        [students]
    );

    const handleSelect = useCallback(
        (value: string) => {
            const apiStudent = students.find(
                (s: ApiStudent) => String(s.id) === value
            );
            if (apiStudent) {
                // Map API student to store Student type
                const student: Student = {
                    id: String(apiStudent.id),
                    name: apiStudent.name,
                    studentId: String(apiStudent.id),
                    grade: apiStudent.role?.caption || "Student",
                    parentContact: apiStudent.email,
                };
                setStudent(student);
            } else {
                setStudent(null);
            }
        },
        [students, setStudent]
    );

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-xl font-semibold">
                    {t(
                        "purchases.wizard.steps.student.title",
                        "Select Student"
                    )}
                </h2>
            </div>

            <div className="space-y-4">
                <div>
                    <label className="text-sm font-medium mb-2 block">
                        {t(
                            "purchases.wizard.steps.student.searchLabel",
                            "Search Student"
                        )}{" "}
                        <span className="text-destructive">*</span>
                    </label>
                    <DropdownInput
                        options={dropdownOptions}
                        value={selectedStudent?.id || ""}
                        onChange={handleSelect}
                        placeholder={t(
                            "purchases.wizard.steps.student.placeholder",
                            "Search or select a student"
                        )}
                        disabled={isLoading}
                    />
                </div>

                {selectedStudent && (
                    <StudentInfoCard student={selectedStudent} />
                )}
            </div>
        </div>
    );
});

export default StudentInformationStep;
