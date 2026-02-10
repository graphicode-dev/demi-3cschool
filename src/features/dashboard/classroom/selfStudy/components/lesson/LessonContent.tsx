import { useTranslation } from "react-i18next";
import type { Lesson, LessonTabType } from "../../types";
import {
    useLessonMaterialsByLesson,
    useLessonAssignmentsByLesson,
    useLessonQuizzesByLesson,
} from "@/features/dashboard/admin/learning/pages/lessons/api";
import {
    AboutTab,
    AssignmentsTab,
    EditorTab,
    LessonQuizTab,
    MaterialsTab,
    ReviewTab,
} from "./tabs content";

interface LessonContentProps {
    lesson: Lesson;
    activeTab: LessonTabType;
}

export function LessonContent({ lesson, activeTab }: LessonContentProps) {
    console.log("Lesson: ", JSON.stringify(lesson, null, 2));

    const { t } = useTranslation("selfStudy");

    // Fetch materials only when materials tab is active
    const { data: materialsData, isLoading: isLoadingMaterials } =
        useLessonMaterialsByLesson(String(lesson.id), undefined, {
            enabled: activeTab === "materials",
        });

    // Fetch assignments only when assignments tab is active
    const { data: assignmentsData, isLoading: isLoadingAssignments } =
        useLessonAssignmentsByLesson(String(lesson.id), undefined, {
            enabled: activeTab === "assignments",
        });

    // Fetch quizzes only when lessonQuiz tab is active
    const { data: quizzesData, isLoading: isLoadingQuizzes } =
        useLessonQuizzesByLesson(String(lesson.id), undefined, {
            enabled: activeTab === "lessonQuiz",
        });

    const materials = materialsData?.items ?? [];
    const assignments = assignmentsData?.items ?? [];
    const quizzes = quizzesData?.items ?? [];

    switch (activeTab) {
        case "about":
            return <AboutTab lesson={lesson} t={t} />;

        case "review":
            return <ReviewTab t={t} sessionId={lesson.sessionId} />;

        case "assignments":
            return (
                <AssignmentsTab
                    lesson={lesson}
                    assignments={assignments}
                    isLoadingAssignments={isLoadingAssignments}
                    t={t}
                />
            );

        case "lessonQuiz":
            return (
                <LessonQuizTab
                    quizzes={quizzes}
                    isLoadingQuizzes={isLoadingQuizzes}
                    t={t}
                />
            );

        case "materials":
            return (
                <MaterialsTab
                    materials={materials}
                    isLoadingMaterials={isLoadingMaterials}
                    t={t}
                />
            );

        case "editor":
            return (
                <div className="h-[450px] overflow-visible">
                    <EditorTab t={t} />
                </div>
            );

        default:
            return <AboutTab lesson={lesson} t={t} />;
    }
}

export default LessonContent;
