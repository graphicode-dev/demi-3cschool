/**
 * Programs Page
 *
 * Displays a list of programs curriculum with toggle buttons for status.
 */

import { PageWrapper } from "@/design-system";
import { useTranslation } from "react-i18next";
import ProgramTypeCard from "../components/ProgramTypeCard";
import { BookOpen, Sun } from "lucide-react";
import { programsPaths } from "../navigation";

function ProgramsPage() {
    const { t } = useTranslation();
    return (
        <PageWrapper
            pageHeaderProps={{
                title: t("programs:programs.title"),
                subtitle: t("programs:programs.description"),
            }}
        >
            <div className="flex items-center gap-10">
                <ProgramTypeCard
                    title={t("programs:programs.standardProgram.title")}
                    description={t(
                        "programs:programs.standardProgram.description"
                    )}
                    href={programsPaths.standardList()}
                    icon={
                        <BookOpen className="w-6 h-6 text-brand-600 dark:text-brand-400" />
                    }
                    iconBg="bg-brand-100 dark:bg-brand-900/30"
                />
                <ProgramTypeCard
                    title={t("programs:programs.summerProgram.title")}
                    description={t(
                        "programs:programs.summerProgram.description"
                    )}
                    href={programsPaths.summerList()}
                    icon={
                        <Sun className="w-6 h-6 text-amber-600 dark:text-amber-400" />
                    }
                    iconBg="bg-amber-100 dark:bg-amber-900/30"
                    disabled
                />
            </div>
        </PageWrapper>
    );
}

export default ProgramsPage;
