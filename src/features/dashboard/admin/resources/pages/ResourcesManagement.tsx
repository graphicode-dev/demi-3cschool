/**
 * ResourcesManagement Page
 *
 * Main page for managing resource folders with filters.
 */

import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Filter, FolderPlus } from "lucide-react";
import PageWrapper from "@/design-system/components/PageWrapper";
import { EmptyState } from "@/design-system/components/EmptyState";
import { LoadingState } from "@/design-system/components/LoadingState";
import { FolderCard } from "../components/FolderCard";
import { useFoldersList } from "../api";
import { useGrades } from "@/features/dashboard/admin/systemManagements/api";
import { useProgramsCurriculumList } from "@/features/dashboard/admin/programs/api";
import type { ResourceFolder } from "../types";

export function ResourcesManagement() {
    const { t } = useTranslation("adminResources");
    const navigate = useNavigate();
    const [selectedGrade, setSelectedGrade] = useState<string>("");
    const [selectedProgram, setSelectedProgram] = useState<string>("");
    const [page, setPage] = useState<number>(1);

    const { data: gradesData, isLoading: isGradesLoading } = useGrades();
    const { data: programs = [], isLoading: isProgramsLoading } =
        useProgramsCurriculumList();

    const gradeId = selectedGrade ? Number(selectedGrade) : undefined;
    const programId = selectedProgram ? Number(selectedProgram) : undefined;

    const { data: foldersPage, isLoading } = useFoldersList({
        page,
        gradeId,
        programId,
    });

    const folders = foldersPage?.items ?? [];
    const currentPage = foldersPage?.currentPage ?? page;
    const lastPage = foldersPage?.lastPage ?? 1;

    useEffect(() => {
        setPage(1);
    }, [selectedGrade, selectedProgram]);

    // Group folders by grade and term
    const groupedFolders = useMemo(() => {
        const groups: Record<
            string,
            { grade: string; term: string; folders: ResourceFolder[] }
        > = {};

        folders.forEach((folder: ResourceFolder) => {
            const key = `${folder.grade.id}-${folder.programsCurriculum.id}`;
            if (!groups[key]) {
                groups[key] = {
                    grade: folder.grade.name,
                    term: folder.programsCurriculum.caption,
                    folders: [],
                };
            }
            groups[key].folders.push(folder);
        });

        return Object.values(groups);
    }, [folders]);

    const handleCreateFolder = () => {
        navigate("/admin/resources/folder/create");
    };

    return (
        <PageWrapper
            pageHeaderProps={{
                title: t("title"),
                subtitle: t("description"),
                actions: (
                    <button
                        onClick={handleCreateFolder}
                        className="flex items-center gap-2 px-4 py-2.5 bg-brand-500 text-white rounded-lg hover:bg-brand-600 transition-colors text-sm font-medium"
                    >
                        <FolderPlus className="size-4" />
                        {t("createNewFolder")}
                    </button>
                ),
            }}
        >
            {/* Filters Card */}
            <div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-6 mb-6">
                <div className="flex items-center gap-2 mb-4">
                    <Filter className="size-5 text-brand-500" />
                    <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                        {t("filters")}
                    </h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Grade Filter */}
                    <div>
                        <select
                            value={selectedGrade}
                            onChange={(e) => setSelectedGrade(e.target.value)}
                            className="w-full px-4 py-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-brand-500"
                            disabled={isGradesLoading}
                        >
                            <option value="">{t("allGrades")}</option>
                            {(gradesData?.items ?? []).map((grade) => (
                                <option key={grade.id} value={String(grade.id)}>
                                    {grade.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Term Filter */}
                    <div>
                        <select
                            value={selectedProgram}
                            onChange={(e) => setSelectedProgram(e.target.value)}
                            className="w-full px-4 py-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-brand-500"
                            disabled={isProgramsLoading}
                        >
                            <option value="">{t("allTerms")}</option>
                            {programs.map((program) => (
                                <option
                                    key={program.id}
                                    value={String(program.id)}
                                >
                                    {program.caption}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>
            </div>

            {/* Content */}
            {isLoading ? (
                <LoadingState />
            ) : folders.length === 0 ? (
                <EmptyState
                    title={t("noFolders")}
                    message={t("noFoldersDescription")}
                />
            ) : (
                <div className="space-y-8">
                    {groupedFolders.map((group, groupIndex) => (
                        <div key={groupIndex}>
                            {/* Group Header */}
                            <div className="mb-4">
                                <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                                    {group.grade}
                                </h3>
                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                    {group.term}
                                </p>
                            </div>

                            {/* Folders Grid */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                {group.folders.map((folder, index) => (
                                    <FolderCard
                                        key={folder.id}
                                        folder={folder}
                                        index={index}
                                    />
                                ))}
                            </div>
                        </div>
                    ))}

                    {/* Pagination */}
                    <div className="flex items-center justify-between gap-4 pt-2">
                        <button
                            type="button"
                            onClick={() => setPage((p) => Math.max(1, p - 1))}
                            disabled={currentPage <= 1}
                            className="px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm font-medium text-gray-700 dark:text-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {t("pagination.prev")}
                        </button>

                        <div className="text-sm text-gray-600 dark:text-gray-400">
                            {t("pagination.page", {
                                current: currentPage,
                                total: lastPage,
                            })}
                        </div>

                        <button
                            type="button"
                            onClick={() =>
                                setPage((p) => Math.min(lastPage, p + 1))
                            }
                            disabled={currentPage >= lastPage}
                            className="px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm font-medium text-gray-700 dark:text-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {t("pagination.next")}
                        </button>
                    </div>
                </div>
            )}
        </PageWrapper>
    );
}

export default ResourcesManagement;
