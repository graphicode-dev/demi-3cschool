import { useTranslation } from "react-i18next";
import { PageWrapper } from "@/design-system";
import { TermStepper } from "../../components";
import { PhysicalSessionCard, SummerCampBanner } from "../components";
import { useOfflineSessions } from "../api/physicalSessions.queries";
import { useCurriculumTerms } from "../../components/TermStepper";

function PhysicalSessionsPage() {
    const { t } = useTranslation("physicalSessions");

    const { selectedTermId, setSelectedTermId, terms } = useCurriculumTerms();
    const { data: offlineSessions } = useOfflineSessions(selectedTermId);

    const isSummerTerm = selectedTermId === 3;

    return (
        <PageWrapper
            pageHeaderProps={{
                title: t("title"),
                subtitle: t("description"),
            }}
        >
            {/* Term Stepper */}
            <TermStepper
                terms={terms}
                selectedTermId={selectedTermId}
                onSelectTerm={setSelectedTermId}
            />

            {/* Summer Camp Banner - Only for summer term */}
            {isSummerTerm && (
                <SummerCampBanner
                    totalSessions={offlineSessions?.length || 0}
                    completedSessions={0}
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
                {/* {offlineSessions?.map((session) => (
                    <PhysicalSessionCard
                        key={session.id}
                        session={session}
                        variant={isSummerTerm ? "compact" : "full"}
                    />
                ))} */}
            </div>
        </PageWrapper>
    );
}

export default PhysicalSessionsPage;
