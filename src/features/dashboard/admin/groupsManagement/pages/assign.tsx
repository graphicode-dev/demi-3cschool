import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate, useParams } from "react-router-dom";
import { Search, Filter } from "lucide-react";
import { ErrorState, LoadingState } from "@/design-system";
import { StudentSelectCard } from "../components";
import {
    useAssignStudentMutation,
    useGetGroupStudentsQuery,
} from "../api/assignStudent";
import PageWrapper from "@/design-system/components/PageWrapper";
import { useMutationHandler } from "@/shared/api";

const MOCK_COURSES = [
    { value: "", label: "All Courses" },
    { value: "python", label: "Python Programming" },
    { value: "scratch", label: "Scratch" },
    { value: "web", label: "Web Development" },
    { value: "game", label: "Game Development" },
];

const MOCK_DAYS = [
    { value: "", label: "All Days" },
    { value: "sunday", label: "Sunday" },
    { value: "monday", label: "Monday" },
    { value: "tuesday", label: "Tuesday" },
    { value: "wednesday", label: "Wednesday" },
    { value: "thursday", label: "Thursday" },
    { value: "friday", label: "Friday" },
    { value: "saturday", label: "Saturday" },
];

const MOCK_TIME_SLOTS = [
    { value: "", label: "All Time Slot" },
    { value: "morning", label: "10:00 AM - 12:00 PM" },
    { value: "afternoon", label: "2:00 PM - 4:00 PM" },
    { value: "evening", label: "4:00 PM - 6:00 PM" },
];

function AssignStudentPage() {
    const { t } = useTranslation("groupsManagement");
    const navigate = useNavigate();
    const { id: groupId } = useParams<{ id: string }>();
    const { execute } = useMutationHandler();

    const [searchQuery, setSearchQuery] = useState("");
    const [courseFilter, setCourseFilter] = useState("");
    const [dayFilter, setDayFilter] = useState("");
    const [timeSlotFilter, setTimeSlotFilter] = useState("");

    const {
        data: students = [],
        isLoading: studentsLoading,
        error: studentsError,
        refetch: refetchStudents,
    } = useGetGroupStudentsQuery(groupId!);

    const { mutateAsync: assignStudent, isPending: isAssigning } =
        useAssignStudentMutation();

    const handleSelectStudent = (studentId: string) => {
        execute(
            () =>
                assignStudent({
                    groupId: groupId!,
                    data: {
                        student_id: studentId,
                    },
                }),
            {
                successMessage: t(
                    "success.assigned",
                    "Student assigned successfully"
                ),
                onSuccess: () => navigate(-1),
            }
        );
    };

    if (studentsError)
        return (
            <ErrorState
                message={
                    studentsError.message ||
                    t("errors.fetchFailed", "Failed to load data")
                }
                onRetry={refetchStudents}
            />
        );
    if (studentsLoading) return <LoadingState />;

    return (
        <PageWrapper
            pageHeaderProps={{
                title: t(
                    "groups.assignStudent.title",
                    "Assign Student to Group"
                ),
                subtitle: t(
                    "groups.assignStudent.subtitle",
                    "Select a student to assign to this group"
                ),
                backButton: true,
            }}
        >
            {/* Search & Filters */}
            <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 space-y-4">
                {/* Search Input */}
                <div className="relative max-w-md">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                        type="text"
                        aria-label={t(
                            "groups.assignStudent.searchPlaceholder",
                            "Search students by name..."
                        )}
                        placeholder={t(
                            "groups.assignStudent.searchPlaceholder",
                            "Search students by name..."
                        )}
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        disabled={isAssigning}
                        className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg text-sm text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500 transition-colors disabled:opacity-50"
                    />
                </div>

                {/* Filter Dropdowns */}
                <div className="flex items-center gap-3">
                    <Filter className="w-5 h-5 text-gray-400" />

                    {/* Course Filter */}
                    <select
                        value={courseFilter}
                        onChange={(e) => setCourseFilter(e.target.value)}
                        disabled={isAssigning}
                        aria-label={t(
                            "groups.assignStudent.allCourses",
                            "All Courses"
                        )}
                        className="px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg text-sm text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500 transition-colors disabled:opacity-50"
                    >
                        {MOCK_COURSES.map((option) => (
                            <option key={option.value} value={option.value}>
                                {option.label}
                            </option>
                        ))}
                    </select>

                    {/* Day Filter */}
                    <select
                        value={dayFilter}
                        onChange={(e) => setDayFilter(e.target.value)}
                        disabled={isAssigning}
                        aria-label={t(
                            "groups.assignStudent.allDays",
                            "All Days"
                        )}
                        className="px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg text-sm text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500 transition-colors disabled:opacity-50"
                    >
                        {MOCK_DAYS.map((option) => (
                            <option key={option.value} value={option.value}>
                                {option.label}
                            </option>
                        ))}
                    </select>

                    {/* Time Slot Filter */}
                    <select
                        value={timeSlotFilter}
                        onChange={(e) => setTimeSlotFilter(e.target.value)}
                        disabled={isAssigning}
                        aria-label={t(
                            "groups.assignStudent.allTimeSlots",
                            "All Time Slot"
                        )}
                        className="px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg text-sm text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500 transition-colors disabled:opacity-50"
                    >
                        {MOCK_TIME_SLOTS.map((option) => (
                            <option key={option.value} value={option.value}>
                                {option.label}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            {/* Student List */}
            <div className="space-y-3">
                {students.length > 0 ? (
                    students.map((student) => (
                        <StudentSelectCard
                            key={student.id}
                            student={student}
                            onSelect={handleSelectStudent}
                        />
                    ))
                ) : (
                    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-12">
                        <div className="flex flex-col items-center justify-center text-center">
                            <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mb-4">
                                <Search className="w-8 h-8 text-gray-400" />
                            </div>
                            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-1">
                                {t(
                                    "groups.assignStudent.noResults",
                                    "No students found"
                                )}
                            </h3>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                {t(
                                    "groups.assignStudent.noResultsDescription",
                                    "Try adjusting your search or filter criteria"
                                )}
                            </p>
                        </div>
                    </div>
                )}
            </div>
        </PageWrapper>
    );
}

export default AssignStudentPage;
