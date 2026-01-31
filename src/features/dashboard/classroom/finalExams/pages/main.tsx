import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { ExamCard } from "../components";
import { MOCK_FINAL_EXAMS } from "../mocks";
import { finalExamsPaths } from "../navigation";
import PageWrapper from "@/design-system/components/PageWrapper";

export function FinalExamsPage() {
    const { t } = useTranslation("finalExams");
    const navigate = useNavigate();

    const handleStartExam = (examId: number) => {
        navigate(finalExamsPaths.take(examId));
    };

    const handleViewResults = (examId: number) => {
        navigate(finalExamsPaths.result(examId));
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
