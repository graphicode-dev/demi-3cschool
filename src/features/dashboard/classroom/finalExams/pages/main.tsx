import { useTranslation } from "react-i18next";
import { ExamCard } from "../components";
import { MOCK_FINAL_EXAMS } from "../mocks";
import PageWrapper from "@/design-system/components/PageWrapper";

export function FinalExamsPage() {
    const { t } = useTranslation("finalExams");

    const handleStartExam = (examId: number) => {
        console.log("Start exam:", examId);
    };

    const handleViewResults = (examId: number) => {
        console.log("View results:", examId);
    };

    return (
        <PageWrapper
            pageHeaderProps={{
                title: t("title"),
                subtitle: t("description"),
            }}
        >
            {/* Exams Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {MOCK_FINAL_EXAMS.map((exam) => (
                    <ExamCard
                        key={exam.id}
                        exam={exam}
                        onStartExam={handleStartExam}
                        onViewResults={handleViewResults}
                    />
                ))}
            </div>
        </PageWrapper>
    );
}

export default FinalExamsPage;
