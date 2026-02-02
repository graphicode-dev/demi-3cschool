/**
 * Programs Page
 *
 * Displays a list of programs curriculum with toggle buttons for status.
 */

import { ProgramsCurriculumList } from "../components";
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
            <ProgramsCurriculumList />
        </PageWrapper>
    );
}

export default ProgramsPage;
