import { useState } from "react";
import { useTranslation } from "react-i18next";
import PageWrapper from "@/design-system/components/PageWrapper";
import { TermStepper } from "../../components";
import { PhysicalSessionCard, SummerCampBanner } from "../components";
import { MOCK_PHYSICAL_SESSIONS_SUMMER } from "../mocks";

function PhysicalSessionsPage() {
    const { t } = useTranslation("physicalSessions");

    // Mock data - replace with API call
    const data = MOCK_PHYSICAL_SESSIONS_SUMMER;

    const [selectedTermId, setSelectedTermId] = useState<number>(
        data.currentTermId
    );

    const filteredSessions = data.sessions.filter(
        (session) => session.term.id === selectedTermId
    );

    const isSummerTerm = selectedTermId === 3;
    const completedCount = filteredSessions.filter(
        (s) => s.status === "completed"
    ).length;

    return (
        <PageWrapper>
            <div className="flex flex-col gap-6 max-w-5xl mx-auto px-4 py-4">
                {/* Header */}
                <div className="flex flex-col gap-1">
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                        {t("title")}
                    </h1>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                        {t("description")}
                    </p>
                </div>

                {/* Term Stepper */}
                <TermStepper
                    terms={data.terms}
                    selectedTermId={selectedTermId}
                    onTermSelect={setSelectedTermId}
                    translationNamespace="physicalSessions"
                />

                {/* Summer Camp Banner - Only for summer term */}
                {isSummerTerm && (
                    <SummerCampBanner
                        totalSessions={filteredSessions.length}
                        completedSessions={completedCount}
                    />
                )}

                {/* Section Title */}
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                    {t("atTheCenter")}
                </h2>

                {/* Sessions Grid/List */}
                <div
                    className={`
                        ${isSummerTerm ? "flex flex-wrap gap-6" : "flex flex-col gap-4"}
                    `}
                >
                    {filteredSessions.map((session) => (
                        <PhysicalSessionCard
                            key={session.id}
                            session={session}
                            variant={isSummerTerm ? "compact" : "full"}
                        />
                    ))}
                </div>
            </div>
        </PageWrapper>
    );
}

export default PhysicalSessionsPage;
