import {
    Users,
    Clock,
    MapPin,
    Edit,
    Trash2,
    BookOpen,
    CheckSquare2,
    FileText,
    Calendar,
    Video,
    Lock,
    UserPlus,
    GraduationCap,
    Layers,
} from "lucide-react";
import { LearningCard } from "../components/LearningCard";
import { StudentListItem } from "../components/StudentListItem";
import { Link, useNavigate, useParams } from "react-router-dom";
import { paths } from "@/router";
import { gradesPaths } from "@/features/dashboard/admin/learning/navigation/paths";
import { groupsPaths } from "../navigation/paths";
import { useGroup } from "../api";
import {
    useGetGroupStudentsQuery,
    useRemoveStudentMutation,
} from "../api/assignStudent";
import { ErrorState, LoadingState } from "@/design-system";
import { useTranslation } from "react-i18next";
import { useMutationHandler } from "@/shared/api";
import { ContentTabType } from "@/features/dashboard/admin/learning/pages/lessons/components/content-manager/LessonContentManager";

export default function RegularGroupViewPage() {
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
    const { execute } = useMutationHandler();
    const {
        data: students = [],
        isLoading: studentsLoading,
        error: studentsError,
        refetch: refetchStudents,
    } = useGetGroupStudentsQuery(groupId!);

    const { data: groupData } = useGroup(groupId);

    const handleGroupEdit = () => {
        navigate(
            paths.dashboard.groupsManagement.regularEdit(
                gradeId,
                levelId,
                groupId
            )
        );
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
        `${gradesPaths.lessons(gradeId!, levelId!)}?tab=${tab}`;

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
                                        {t(
                                            "groups.view.maxStudents",
                                            "Max {{count}} Students",
                                            { count: groupData?.maxCapacity }
                                        )}
                                    </span>
                                </div>
                                {groupData?.schedules?.[0] && (
                                    <div className="flex items-center gap-2">
                                        <Clock className="w-5 h-5" />
                                        <span className="text-base">
                                            {groupData.schedules[0].startTime?.slice(
                                                0,
                                                5
                                            )}{" "}
                                            -{" "}
                                            {groupData.schedules[0].endTime?.slice(
                                                0,
                                                5
                                            )}
                                        </span>
                                    </div>
                                )}
                                {groupData?.schedules?.[0] && (
                                    <div className="flex items-center gap-2">
                                        <Calendar className="w-5 h-5" />
                                        <span className="text-base capitalize">
                                            {groupData.schedules[0].dayOfWeek}
                                        </span>
                                    </div>
                                )}
                                <div className="flex items-center gap-2 bg-brand-500/10 px-3 py-1 rounded-full">
                                    <MapPin className="w-4 h-4 text-brand-400" />
                                    <span className="text-brand-400 text-base capitalize">
                                        {groupData?.locationType}
                                    </span>
                                </div>
                                {groupData?.isActive !== undefined && (
                                    <div
                                        className={`flex items-center gap-2 px-3 py-1 rounded-full ${groupData.isActive ? "bg-green-500/10" : "bg-red-500/10"}`}
                                    >
                                        <span
                                            className={`text-base ${groupData.isActive ? "text-green-400" : "text-red-400"}`}
                                        >
                                            {groupData.isActive
                                                ? t(
                                                      "groups.view.active",
                                                      "Active"
                                                  )
                                                : t(
                                                      "groups.view.inactive",
                                                      "Inactive"
                                                  )}
                                        </span>
                                    </div>
                                )}
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <button
                                onClick={handleGroupEdit}
                                className="bg-linear-to-r from-brand-500 to-brand-400 text-white px-4 py-2 rounded-xl flex items-center gap-2 shadow-lg hover:shadow-xl transition-shadow"
                            >
                                <Edit className="w-4 h-4" />
                                {t("groups.view.editGroup", "Edit Group")}
                            </button>
                            <button className="bg-white text-gray-700 px-4 py-2 rounded-xl flex items-center gap-2 border border-gray-200 hover:bg-gray-50 transition-colors">
                                <Trash2 className="w-4 h-4" />
                                {t("groups.view.deleteGroup", "Delete Group")}
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
                        {t("groups.view.groupInformation", "Group Information")}
                    </h3>
                    <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 mb-6">
                        <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
                            {/* Grade */}
                            <div className="flex items-start gap-3">
                                <div className="shrink-0">
                                    <div className="flex items-center justify-center h-8 w-8 rounded-lg bg-brand-100 dark:bg-brand-900">
                                        <GraduationCap
                                            size={18}
                                            className="text-brand-600 dark:text-brand-300"
                                        />
                                    </div>
                                </div>
                                <div className="min-w-0">
                                    <p className="text-xs text-gray-500 dark:text-gray-400 font-medium uppercase tracking-wide">
                                        {t("groups.view.grade", "Grade")}
                                    </p>
                                    <p className="text-sm font-semibold text-gray-900 dark:text-white mt-1">
                                        {groupData?.grade?.name || "-"}
                                    </p>
                                </div>
                            </div>

                            {/* Level */}
                            <div className="flex items-start gap-3">
                                <div className="shrink-0">
                                    <div className="flex items-center justify-center h-8 w-8 rounded-lg bg-brand-100 dark:bg-brand-900">
                                        <Layers
                                            size={18}
                                            className="text-brand-600 dark:text-brand-300"
                                        />
                                    </div>
                                </div>
                                <div className="min-w-0">
                                    <p className="text-xs text-gray-500 dark:text-gray-400 font-medium uppercase tracking-wide">
                                        {t("groups.view.level", "Level")}
                                    </p>
                                    <p className="text-sm font-semibold text-gray-900 dark:text-white mt-1">
                                        {groupData?.level?.title || "-"}
                                    </p>
                                </div>
                            </div>

                            {/* Program/Curriculum */}
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
                                        {t("groups.view.program", "Program")}
                                    </p>
                                    <p className="text-sm font-semibold text-gray-900 dark:text-white mt-1">
                                        {groupData?.programsCurriculum
                                            ?.caption || "-"}
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
                                        {t("groups.view.capacity", "Capacity")}
                                    </p>
                                    <p className="text-sm font-semibold text-gray-900 dark:text-white mt-1">
                                        {groupData?.maxCapacity || "-"}
                                    </p>
                                </div>
                            </div>

                            {/* Location Type */}
                            <div className="flex items-start gap-3">
                                <div className="shrink-0">
                                    <div className="flex items-center justify-center h-8 w-8 rounded-lg bg-brand-100 dark:bg-brand-900">
                                        <MapPin
                                            size={18}
                                            className="text-brand-600 dark:text-brand-300"
                                        />
                                    </div>
                                </div>
                                <div className="min-w-0">
                                    <p className="text-xs text-gray-500 dark:text-gray-400 font-medium uppercase tracking-wide">
                                        {t(
                                            "groups.view.locationType",
                                            "Location Type"
                                        )}
                                    </p>
                                    <p className="text-sm font-semibold text-gray-900 dark:text-white mt-1 capitalize">
                                        {groupData?.locationType || "-"}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Learning Progress Section */}
                <div className="mb-6">
                    <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                        {t("groups.view.learningProgress", "Learning Progress")}
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <LearningCard
                            icon={CheckSquare2}
                            title={t("groups.view.quizzes", "Quizzes")}
                            description={t(
                                "groups.view.quizzesDesc",
                                "Test your knowledge with online quizzes"
                            )}
                            linkText={t(
                                "groups.view.viewQuizzes",
                                "View Quizzes"
                            )}
                            to={lessonPath("quizzes")}
                            linkColor="text-brand-600"
                        />
                        <LearningCard
                            icon={FileText}
                            title={t("groups.view.assignments", "Assignments")}
                            description={t(
                                "groups.view.assignmentsDesc",
                                "Complete assignments set by group"
                            )}
                            linkText={t(
                                "groups.view.viewAssignments",
                                "View Assignments"
                            )}
                            to={lessonPath("assignments")}
                            linkColor="text-brand-600"
                        />
                        <LearningCard
                            icon={BookOpen}
                            title={t("groups.view.materials", "Materials")}
                            description={t(
                                "groups.view.materialsDesc",
                                "Access learning materials & resources"
                            )}
                            linkText={t(
                                "groups.view.viewMaterials",
                                "View Materials"
                            )}
                            to={lessonPath("materials")}
                            linkColor="text-brand-600"
                        />

                        <LearningCard
                            icon={Calendar}
                            title={t("groups.view.sessions", "Sessions")}
                            description={t(
                                "groups.view.sessionsDesc",
                                "Manage scheduled sessions for this group"
                            )}
                            linkText={t(
                                "groups.view.manageSessions",
                                "Manage Sessions"
                            )}
                            linkColor="text-brand-600"
                            to={paths.dashboard.groupsManagement.regularSessions(
                                gradeId,
                                levelId,
                                groupId
                            )}
                        />
                        <LearningCard
                            icon={Users}
                            title={t("groups.view.attendances", "Attendances")}
                            description={t(
                                "groups.view.attendancesDesc",
                                "Manage attendance for the group"
                            )}
                            linkText={t(
                                "groups.view.manageAttendances",
                                "Manage Attendances"
                            )}
                            linkColor="text-brand-600"
                            to={paths.dashboard.groupsManagement.regularAttendance(
                                gradeId,
                                levelId,
                                groupId
                            )}
                        />
                        <LearningCard
                            icon={Lock}
                            title={t(
                                "groups.view.finalLevelQuiz",
                                "Final Level Quiz"
                            )}
                            description={t(
                                "groups.view.finalLevelQuizDesc",
                                "Unlock the next level"
                            )}
                            linkText={t(
                                "groups.view.viewFinalQuiz",
                                "View Final Quiz"
                            )}
                            linkColor="text-brand-600"
                            to={groupsPaths.regularFinalQuiz(
                                gradeId,
                                levelId,
                                groupId
                            )}
                        />

                        <LearningCard
                            icon={Video}
                            title={t("groups.view.videos", "Videos")}
                            description={t(
                                "groups.view.videosDesc",
                                "Watch learning resources"
                            )}
                            linkText={t(
                                "groups.view.viewVideos",
                                "View Videos"
                            )}
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
                                {t(
                                    "groups.view.enrolledStudents",
                                    "Enrolled Students"
                                )}{" "}
                                ({students.length})
                            </h3>
                            <Link
                                to={paths.dashboard.groupsManagement.regularAssign(
                                    gradeId,
                                    levelId,
                                    groupId
                                )}
                                className="inline-flex items-center gap-2 px-4 py-2 bg-brand-500 text-white text-sm font-semibold rounded-lg hover:bg-brand-600 transition-colors"
                            >
                                <UserPlus size={16} />
                                {t(
                                    "groups.view.assignStudent",
                                    "Assign Student"
                                )}
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

                    {/* Trainer/Instructor Card */}
                    <div className="pt-6 space-y-6">
                        <h3 className="text-2xl font-semibold text-gray-900 dark:text-white">
                            {t("groups.view.trainer", "Trainer")}
                        </h3>

                        <div className="bg-brand-50 dark:bg-brand-900/20 rounded-lg border border-brand-200 dark:border-brand-800 p-6 flex flex-col items-center text-center">
                            {groupData?.primaryTeacher?.name ? (
                                <>
                                    <div className="flex items-center justify-center w-16 h-16 rounded-full bg-brand-500 text-white text-lg font-bold mb-4 shrink-0">
                                        {groupData.primaryTeacher.name
                                            .split(" ")
                                            .map((n: string) => n[0])
                                            .join("")
                                            .toUpperCase()}
                                    </div>
                                    <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
                                        {groupData.primaryTeacher.name}
                                    </h4>
                                    <p className="text-base text-gray-600 dark:text-gray-400 mb-6">
                                        {t("groups.view.trainer", "Trainer")}
                                    </p>
                                </>
                            ) : (
                                <>
                                    <div className="flex items-center justify-center w-16 h-16 rounded-full bg-gray-300 dark:bg-gray-600 text-gray-500 dark:text-gray-400 text-lg font-bold mb-4 shrink-0">
                                        ?
                                    </div>
                                    <h4 className="text-lg font-semibold text-gray-500 dark:text-gray-400 mb-1">
                                        {t(
                                            "groups.view.noTrainerAssigned",
                                            "No Trainer Assigned"
                                        )}
                                    </h4>
                                    <p className="text-base text-gray-400 dark:text-gray-500 mb-6">
                                        {t(
                                            "groups.view.assignTrainerPrompt",
                                            "Assign a trainer to this group"
                                        )}
                                    </p>
                                </>
                            )}
                            <Link
                                to={paths.dashboard.groupsManagement.regularInstructor(
                                    gradeId,
                                    levelId,
                                    groupId
                                )}
                                className="px-4 py-2 bg-brand-500 text-white text-sm font-semibold rounded-lg hover:bg-brand-600 transition-colors"
                            >
                                {groupData?.primaryTeacher?.name
                                    ? t(
                                          "groups.view.manageTrainer",
                                          "Manage Trainer"
                                      )
                                    : t(
                                          "groups.view.assignTrainer",
                                          "Assign Trainer"
                                      )}
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
