import { useTranslation } from "react-i18next";
import { ExamCard } from "../components";
import { MOCK_FINAL_EXAMS } from "../mocks";

export function FinalExamsPage() {
    const { t } = useTranslation("finalExams");

    const handleStartExam = (examId: number) => {
        console.log("Start exam:", examId);
    };

    const handleViewResults = (examId: number) => {
        console.log("View results:", examId);
    };

    return (
        <div className="flex flex-col gap-6 px-4 py-6 max-w-6xl mx-auto">
            {/* Header */}
            <div className="flex flex-col gap-1">
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                    {t("title")}
                </h1>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                    {t("description")}
                </p>
            </div>

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
        </div>
    );
}

export default FinalExamsPage;
