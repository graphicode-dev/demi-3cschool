/**
 * Programs Page
 *
 * Displays a list of educational programs with their statistics.
 */

import { ProgramCard } from "../components";
import { mockPrograms } from "../mockData";
import PageWrapper from "@/design-system/components/PageWrapper";
import { useTranslation } from "react-i18next";

function ProgramsPage() {
    const { t } = useTranslation();
    return (
        <PageWrapper
            pageHeaderProps={{
                title: t("programs:programs.title"),
                subtitle: t("programs:programs.description"),
            }}
        >
            <div className="space-y-4">
                {mockPrograms.map((program) => (
                    <ProgramCard key={program.id} program={program} />
                ))}
            </div>
        </PageWrapper>
    );
}

export default ProgramsPage;
