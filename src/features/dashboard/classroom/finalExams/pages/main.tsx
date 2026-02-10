import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { ExamCard } from "../components";
import { useMyFinalExams } from "../api";
import { finalExamsPaths } from "../navigation";
import { PageWrapper, LoadingState, ErrorState } from "@/design-system";

export function FinalExamsPage() {
    const { t } = useTranslation("finalExams");
    const navigate = useNavigate();

    const { data: exams, isLoading, error, refetch } = useMyFinalExams();

    const handleStartExam = (examId: number) => {
        navigate(finalExamsPaths.take(examId));
    };

    const handleViewResults = (examId: number) => {
        navigate(finalExamsPaths.result(examId));
    };

    if (isLoading) {
        return <LoadingState />;
    }

    if (error) {
        return (
            <ErrorState
                title={t("failedToLoad")}
                message={(error as Error)?.message || t("unknownError")}
                onRetry={() => refetch()}
            />
        );
    }

    return (
        <PageWrapper
            pageHeaderProps={{
                title: t("title"),
                subtitle: t("description"),
            }}
        >
            {/* Exams Grid */}
            {exams && exams.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {exams.map((exam) => (
                        <ExamCard
                            key={exam.id}
                            exam={exam}
                            onStartExam={handleStartExam}
                            onViewResults={handleViewResults}
                        />
                    ))}
                </div>
            ) : (
                <div className="text-center py-12">
                    <p className="text-gray-500 dark:text-gray-400">
                        {t("noExamsAvailable")}
                    </p>
                </div>
            )}
        </PageWrapper>
    );
}

export default FinalExamsPage;
