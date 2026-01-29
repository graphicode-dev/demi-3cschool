import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { TermStepper, CourseCard, SessionList } from "../components";
import {
    MOCK_SELF_STUDY_CONTENT,
    MOCK_FIRST_TERM_COURSE,
    USE_MOCK_DATA,
} from "../mocks";
import { selfStudyPaths } from "../navigation";
import PageWrapper from "@/design-system/components/PageWrapper";

function SelfStudyPage() {
    const { t } = useTranslation("selfStudy");
    const navigate = useNavigate();

    // TODO: Replace with actual API call when ready
    const selfStudyContent = USE_MOCK_DATA ? MOCK_SELF_STUDY_CONTENT : null;

    const [selectedTermId, setSelectedTermId] = useState<number>(
        selfStudyContent?.currentTermId ?? 1
    );

    const handleTermSelect = (termId: number) => {
        const term = selfStudyContent?.terms.find((t) => t.id === termId);
        if (
            term &&
            (term.status === "completed" || term.status === "current")
        ) {
            setSelectedTermId(termId);
        }
    };

    const handleStartSession = (sessionId: number) => {
        navigate(selfStudyPaths.lesson(sessionId));
    };

    if (!selfStudyContent) {
        return null;
    }

    // Get course for selected term (mock: first term has different course)
    const selectedCourse =
        selectedTermId === 1 ? MOCK_FIRST_TERM_COURSE : selfStudyContent.course;

    return (
        <PageWrapper>
            <div className="flex flex-col gap-6 max-w-4xl mx-auto px-6 py-6">
                {/* Header */}
                <div className="flex flex-col gap-1">
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                        {t("title")}
                    </h1>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                        {t("description")}
                    </p>
                </div>

                {/* Term Progress Stepper */}
                <TermStepper
                    terms={selfStudyContent.terms}
                    selectedTermId={selectedTermId}
                    onTermSelect={handleTermSelect}
                />

                {/* Course Card */}
                <CourseCard course={selectedCourse} />

                {/* Sessions List */}
                <SessionList
                    sessions={selectedCourse.sessions}
                    onStartSession={handleStartSession}
                />
            </div>
        </PageWrapper>
    );
}

export default SelfStudyPage;
