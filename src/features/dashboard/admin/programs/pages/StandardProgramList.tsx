import { useTranslation } from "react-i18next";
import { useProgramsCurriculumList, useUpdateProgramCurriculum } from "../api";
import { PageWrapper, EmptyState, ErrorState } from "@/design-system";
import { ProgramCurriculumCard } from "../components/ProgramCurriculumCard";
import { SkeletonList } from "@/design-system/hooks/useSkeleton";
import type { ProgramCurriculum } from "../types";

export default function StandardProgramList() {
    const { t } = useTranslation("programs");
    const { data, isLoading, isError, error, refetch } =
        useProgramsCurriculumList();
    const updateMutation = useUpdateProgramCurriculum();

    const handleToggleStatus = async (program: ProgramCurriculum) => {
        const newStatus = program.isActive ? 0 : 1;
        await updateMutation.mutateAsync({
            id: program.id,
            data: { is_active: newStatus },
        });
    };

    if (isError) {
        return (
            <ErrorState
                title={t("programs.error.title", "Error loading programs")}
                message={
                    error?.message ||
                    t("programs.error.message", "Failed to load programs")
                }
                onRetry={refetch}
            />
        );
    }

    const programs = data ?? [];

    if (!isLoading && programs.length === 0) {
        return (
            <EmptyState
                title={t("programs.empty.title", "No programs found")}
                message={t(
                    "programs.empty.message",
                    "There are no programs curriculum available."
                )}
            />
        );
    }

    return (
        <PageWrapper
            isLoading={isLoading}
            pageHeaderProps={{
                title: t("programs.standardProgram.title", "Programs"),
                subtitle: t(
                    "programs.standardProgram.description",
                    "Manage programs curriculum"
                ),
                backButton: true,
            }}
        >
            <SkeletonList
                data={programs}
                type="program-card"
                className="space-y-4"
                renderItem={(program) => (
                    <ProgramCurriculumCard
                        key={program.id}
                        program={program}
                        isToggling={
                            updateMutation.isPending &&
                            updateMutation.variables?.id === program.id
                        }
                        onToggle={() => handleToggleStatus(program)}
                    />
                )}
            />
        </PageWrapper>
    );
}
