/**
 * ResourcesManagement Page
 *
 * Main page for managing resource folders with filters.
 */

import { useEffect, useMemo, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Filter, FolderPlus, ChevronDown } from "lucide-react";
import { PageWrapper, EmptyState, LoadingState } from "@/design-system";
import { FolderCard } from "../components/FolderCard";
import { useFoldersList } from "../api";
import { useGrades } from "@/features/dashboard/admin/systemManagements/api";
import { useProgramsCurriculumList } from "@/features/dashboard/admin/programs/api";
import type { ResourceFolder } from "../types";

// Collapsible Section Component
function CollapsibleSection({
    title,
    count,
    children,
    defaultExpanded = true,
    variant = "grade",
}: {
    title: string;
    count?: number;
    children: React.ReactNode;
    defaultExpanded?: boolean;
    variant?: "grade" | "term";
}) {
    const [isExpanded, setIsExpanded] = useState(defaultExpanded);
    const contentRef = useRef<HTMLDivElement>(null);
    const [contentHeight, setContentHeight] = useState<number | undefined>(
        undefined
    );

    useEffect(() => {
        if (contentRef.current) {
            setContentHeight(contentRef.current.scrollHeight);
        }
    }, [children]);

    const isGrade = variant === "grade";

    return (
        <div className={isGrade ? "" : ""}>
            <button
                type="button"
                onClick={() => setIsExpanded((prev) => !prev)}
                className={`w-full flex items-center justify-between gap-3 ${
                    isGrade
                        ? "py-3 px-4 bg-gray-100 dark:bg-gray-800 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-700"
                        : "py-2 hover:opacity-80"
                } transition-all`}
            >
                <div className="flex items-center gap-2">
                    <ChevronDown
                        className={`size-4 ${
                            isGrade
                                ? "text-gray-600 dark:text-gray-400"
                                : "text-brand-500"
                        } transition-transform duration-300 ease-in-out ${
                            isExpanded ? "rotate-180" : "rotate-0"
                        }`}
                    />
                    {isGrade ? (
                        <h2 className="text-lg font-bold text-gray-900 dark:text-white">
                            {title}
                        </h2>
                    ) : (
                        <p className="text-sm font-medium text-brand-500">
                            {title}
                        </p>
                    )}
                </div>
                {count !== undefined && (
                    <span
                        className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                            isGrade
                                ? "bg-brand-100 text-brand-600 dark:bg-brand-500/20 dark:text-brand-400"
                                : "bg-gray-200 text-gray-600 dark:bg-gray-700 dark:text-gray-400"
                        }`}
                    >
                        {count}
                    </span>
                )}
            </button>

            <div
                className="overflow-hidden transition-all duration-300 ease-in-out"
                style={{
                    maxHeight: isExpanded ? contentHeight : 0,
                    opacity: isExpanded ? 1 : 0,
                }}
            >
                <div ref={contentRef} className={isGrade ? "pt-4" : "pt-3"}>
                    {children}
                </div>
            </div>
        </div>
    );
}

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

    // Group folders by grade, then by term under each grade
    const groupedByGrade = useMemo(() => {
        const gradeGroups: Record<
            string,
            {
                gradeId: number;
                gradeName: string;
                terms: Record<
                    string,
                    {
                        termId: number;
                        termName: string;
                        folders: ResourceFolder[];
                    }
                >;
            }
        > = {};

        folders.forEach((folder: ResourceFolder) => {
            const gradeKey = String(folder.grade.id);
            const termKey = String(folder.programsCurriculum.id);

            if (!gradeGroups[gradeKey]) {
                gradeGroups[gradeKey] = {
                    gradeId: folder.grade.id,
                    gradeName: folder.grade.name,
                    terms: {},
                };
            }

            if (!gradeGroups[gradeKey].terms[termKey]) {
                gradeGroups[gradeKey].terms[termKey] = {
                    termId: folder.programsCurriculum.id,
                    termName: folder.programsCurriculum.caption,
                    folders: [],
                };
            }

            gradeGroups[gradeKey].terms[termKey].folders.push(folder);
        });

        // Convert to array and sort
        return Object.values(gradeGroups).map((grade) => ({
            ...grade,
            terms: Object.values(grade.terms),
        }));
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
                <div className="space-y-6">
                    {groupedByGrade.map((gradeGroup) => {
                        const totalFolders = gradeGroup.terms.reduce(
                            (acc, term) => acc + term.folders.length,
                            0
                        );
                        return (
                            <CollapsibleSection
                                key={gradeGroup.gradeId}
                                title={gradeGroup.gradeName}
                                count={totalFolders}
                                variant="grade"
                            >
                                {/* Terms under this grade */}
                                <div className="space-y-4 ps-4">
                                    {gradeGroup.terms.map((term) => (
                                        <CollapsibleSection
                                            key={term.termId}
                                            title={term.termName}
                                            count={term.folders.length}
                                            variant="term"
                                        >
                                            {/* Folders Grid */}
                                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                                {term.folders.map(
                                                    (folder, index) => (
                                                        <FolderCard
                                                            key={folder.id}
                                                            folder={folder}
                                                            index={index}
                                                        />
                                                    )
                                                )}
                                            </div>
                                        </CollapsibleSection>
                                    ))}
                                </div>
                            </CollapsibleSection>
                        );
                    })}

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
