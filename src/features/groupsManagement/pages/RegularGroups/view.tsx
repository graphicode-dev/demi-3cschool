import {
    Users,
    Clock,
    User,
    MapPin,
    Edit,
    Trash2,
    Users2,
    Code,
    BookOpen,
    CheckSquare2,
    FileText,
    Calendar,
    Video,
    Lock,
    UserPlus,
} from "lucide-react";
import { LearningCard } from "../../components/LearningCard";
import { StudentListItem } from "../../components/StudentListItem";
import { MOCK_INSTRUCTOR } from "../../mockData";
import { Link, useNavigate, useParams } from "react-router-dom";
import { paths } from "@/router";
import { useGroup } from "../../api";
import {
    useGetGroupStudentsQuery,
    useRemoveStudentMutation,
} from "../../api/assignStudent";
import { ConfirmDialog, ErrorState, LoadingState } from "@/design-system";
import { useTranslation } from "react-i18next";
import { useState } from "react";
import { useMutationHandler } from "@/shared/api";
import { ContentTabType } from "@/features/learning/pages/lessons/components/content-manager/LessonContentManager";

export default function RegularGroupViewPage() {
    const { t } = useTranslation("groupsManagement");
    const navigate = useNavigate();
    const { id: groupId } = useParams<{ id: string }>();
    const { execute } = useMutationHandler();
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);
    const {
        data: students = [],
        isLoading: studentsLoading,
        error: studentsError,
        refetch: refetchStudents,
    } = useGetGroupStudentsQuery(groupId!);

    const { data: groupData } = useGroup(groupId);
    const levelId = groupData?.level.id as string;

    const handleGroupEdit = () => {
        navigate(paths.dashboard.groupsManagement.regularEdit(groupId));
    };

    const { mutateAsync: removeStudent, isPending: isRemovingStudent } =
        useRemoveStudentMutation();

    const handleRemoveStudent = (studentId: string) => {
        execute(
            () =>
                removeStudent({
                    groupId: groupId!,
                    studentId,
                }),
            {
                successMessage: t(
                    "toast.success.studentRemoved",
                    "Student removed successfully"
                ),
            }
        );
    };

    const lessonPath = (tab: ContentTabType) =>
        `${paths.dashboard.learning.standardLessonsView(levelId!)}?tab=${tab}`;

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
        <div className="bg-gray-50 dark:bg-gray-800 min-h-screen">
            {/* Header */}
            <div className="bg-black text-white px-8 pb-4 rounded-b-2xl">
                <div className="pt-5">
                    <div className="flex items-start justify-between">
                        <div className="flex-1">
                            <h1 className="text-3xl font-bold text-white mb-3">
                                {groupData?.name}
                            </h1>
                            <div className="flex items-center gap-6 text-gray-300">
                                <div className="flex items-center gap-2">
                                    <Users className="w-5 h-5" />
                                    <span className="text-base">
                                        {/* {groupData?.studentsCount} Students */}
                                    </span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Clock className="w-5 h-5" />
                                    <span className="text-base">
                                        09:00 - 11:30
                                    </span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <User className="w-5 h-5" />
                                    <span className="text-base">
                                        {/* {groupData?.instructorsCount}{" "} */}
                                        Instructors
                                    </span>
                                </div>
                                <div className="flex items-center gap-2 bg-brand-500/10 px-3 py-1 rounded-full">
                                    <MapPin className="w-4 h-4 text-brand-400" />
                                    <span className="text-brand-400 text-base">
                                        {groupData?.locationType}
                                    </span>
                                </div>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <button
                                onClick={handleGroupEdit}
                                className="bg-linear-to-r from-brand-500 to-brand-400 text-white px-4 py-2 rounded-xl flex items-center gap-2 shadow-lg hover:shadow-xl transition-shadow"
                            >
                                <Edit className="w-4 h-4" />
                                Edit Group
                            </button>
                            <button className="bg-white text-gray-700 px-4 py-2 rounded-xl flex items-center gap-2 border border-gray-200 hover:bg-gray-50 transition-colors">
                                <Trash2 className="w-4 h-4" />
                                Delete Group
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="px-6 py-6 max-w-8xl mx-auto">
                {/* Group Information */}
                <div>
                    <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6">
                        Group Information
                    </h3>
                    <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 mb-6">
                        <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
                            {/* Group Type */}
                            <div className="flex items-start gap-3">
                                <div className="shrink-0">
                                    <div className="flex items-center justify-center h-8 w-8 rounded-lg bg-brand-100 dark:bg-brand-900">
                                        <Users
                                            size={18}
                                            className="text-brand-600 dark:text-brand-300"
                                        />
                                    </div>
                                </div>
                                <div className="min-w-0">
                                    <p className="text-xs text-gray-500 dark:text-gray-400 font-medium uppercase tracking-wide">
                                        Group Type
                                    </p>
                                    <p className="text-sm font-semibold text-gray-900 dark:text-white mt-1">
                                        Regular Group
                                    </p>
                                </div>
                            </div>

                            {/* Program */}
                            <div className="flex items-start gap-3">
                                <div className="shrink-0">
                                    <div className="flex items-center justify-center h-8 w-8 rounded-lg bg-brand-100 dark:bg-brand-900">
                                        <BookOpen
                                            size={18}
                                            className="text-brand-600 dark:text-brand-300"
                                        />
                                    </div>
                                </div>
                                <div className="min-w-0">
                                    <p className="text-xs text-gray-500 dark:text-gray-400 font-medium uppercase tracking-wide">
                                        Program
                                    </p>
                                    <p className="text-sm font-semibold text-gray-900 dark:text-white mt-1">
                                        Standard Learning
                                    </p>
                                </div>
                            </div>

                            {/* Course & Level */}
                            <div className="flex items-start gap-3">
                                <div className="shrink-0">
                                    <div className="flex items-center justify-center h-8 w-8 rounded-lg bg-brand-100 dark:bg-brand-900">
                                        <Code
                                            size={18}
                                            className="text-brand-600 dark:text-brand-300"
                                        />
                                    </div>
                                </div>
                                <div className="min-w-0">
                                    <p className="text-xs text-gray-500 dark:text-gray-400 font-medium uppercase tracking-wide">
                                        Course & Level
                                    </p>
                                    <p className="text-sm font-semibold text-gray-900 dark:text-white mt-1">
                                        Python Basics – L2
                                    </p>
                                </div>
                            </div>

                            {/* Age Group */}
                            <div className="flex items-start gap-3">
                                <div className="shrink-0">
                                    <div className="flex items-center justify-center h-8 w-8 rounded-lg bg-brand-100 dark:bg-brand-900">
                                        <Users2
                                            size={18}
                                            className="text-brand-600 dark:text-brand-300"
                                        />
                                    </div>
                                </div>
                                <div className="min-w-0">
                                    <p className="text-xs text-gray-500 dark:text-gray-400 font-medium uppercase tracking-wide">
                                        Age Group
                                    </p>
                                    <p className="text-sm font-semibold text-gray-900 dark:text-white mt-1">
                                        9–12
                                    </p>
                                </div>
                            </div>

                            {/* Capacity */}
                            <div className="flex items-start gap-3">
                                <div className="shrink-0">
                                    <div className="flex items-center justify-center h-8 w-8 rounded-lg bg-brand-100 dark:bg-brand-900">
                                        <Users
                                            size={18}
                                            className="text-brand-600 dark:text-brand-300"
                                        />
                                    </div>
                                </div>
                                <div className="min-w-0">
                                    <p className="text-xs text-gray-500 dark:text-gray-400 font-medium uppercase tracking-wide">
                                        Capacity
                                    </p>
                                    <p className="text-sm font-semibold text-gray-900 dark:text-white mt-1">
                                        {/* {groupData?.enrolledStudents} /{" "} */}
                                        {groupData?.maxCapacity}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Learning Progress Section */}
                <div className="mb-6">
                    <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                        Learning Progress
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <LearningCard
                            icon={CheckSquare2}
                            title="Quizzes"
                            description="Test your knowledge with online quizzes"
                            linkText="View Quizzes"
                            to={lessonPath("quizzes")}
                            linkColor="text-brand-600"
                        />
                        <LearningCard
                            icon={FileText}
                            title="Assignments"
                            description="Complete assignments set by group"
                            linkText="View Assignments"
                            to={lessonPath("assignments")}
                            linkColor="text-brand-600"
                        />
                        <LearningCard
                            icon={BookOpen}
                            title="Materials"
                            description="Access learning materials & resources"
                            linkText="View Materials"
                            to={lessonPath("materials")}
                            linkColor="text-brand-600"
                        />

                        <LearningCard
                            icon={Calendar}
                            title="Sessions"
                            description="Manage scheduled sessions for this group"
                            linkText="Manage Sessions"
                            linkColor="text-brand-600"
                            to={paths.dashboard.groupsManagement.regularSessions(
                                groupId
                            )}
                        />
                        <LearningCard
                            icon={Users}
                            title="Attendances"
                            description="Manage attendance for the group"
                            linkText="Manage Attendances"
                            linkColor="text-brand-600"
                            to={paths.dashboard.groupsManagement.regularAttendance(
                                groupId
                            )}
                        />
                        <LearningCard
                            icon={Lock}
                            title="Final Level Quiz"
                            description="Unlock the next level"
                            linkText="View Final Quiz"
                            linkColor="text-brand-600"
                            to=""
                        />

                        <LearningCard
                            icon={Video}
                            title="Videos"
                            description="Watch learning resources"
                            linkText="View Videos"
                            to={lessonPath("videos")}
                            linkColor="text-brand-600"
                        />
                    </div>
                </div>

                {/* Bottom Section - Students and Instructor */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Enrolled Students */}
                    <div className="lg:col-span-2 overflow-hidden">
                        <div className="flex items-center justify-between py-6 flex-wrap gap-4">
                            <h3 className="text-2xl font-semibold text-gray-900 dark:text-white">
                                Enrolled Students ({students.length})
                            </h3>
                            <Link
                                to={paths.dashboard.groupsManagement.regularAssign(
                                    groupId
                                )}
                                className="inline-flex items-center gap-2 px-4 py-2 bg-brand-500 text-white text-sm font-semibold rounded-lg hover:bg-brand-600 transition-colors"
                            >
                                <UserPlus size={16} />
                                Assign Student
                            </Link>
                        </div>

                        <div className="space-y-5">
                            {students.map((student) => (
                                <StudentListItem
                                    key={student.id}
                                    student={student}
                                    handleRemove={() =>
                                        handleRemoveStudent(student.id)
                                    }
                                    t={t}
                                />
                            ))}
                        </div>
                    </div>

                    {/* Instructor Card */}
                    <div className="pt-6 space-y-6">
                        <h3 className="text-2xl font-semibold text-gray-900 dark:text-white">
                            Instructor
                        </h3>

                        <div className="bg-brand-50 dark:bg-brand-900/20 rounded-lg border border-brand-200 dark:border-brand-800 p-6 flex flex-col items-center text-center">
                            <div className="flex items-center justify-center w-16 h-16 rounded-full bg-brand-500 text-white text-lg font-bold mb-4 shrink-0">
                                {MOCK_INSTRUCTOR.initials}
                            </div>
                            <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
                                {MOCK_INSTRUCTOR.name}
                            </h4>
                            <p className="text-base text-gray-600 dark:text-gray-400 mb-1">
                                {MOCK_INSTRUCTOR.role}
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-500 mb-6">
                                Assigned date {MOCK_INSTRUCTOR.assignedDate}
                            </p>
                            <Link
                                to={paths.dashboard.groupsManagement.regularInstructor(
                                    groupId
                                )}
                                className="px-4 py-2 bg-brand-500 text-white text-sm font-semibold rounded-lg hover:bg-brand-600 transition-colors"
                            >
                                Manage Instructor
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
