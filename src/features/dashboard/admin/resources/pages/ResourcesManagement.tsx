/**
 * ResourcesManagement Page
 *
 * Main page for managing resource folders with filters.
 */

import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Filter, FolderPlus } from "lucide-react";
import PageWrapper from "@/design-system/components/PageWrapper";
import { EmptyState } from "@/design-system/components/EmptyState";
import { LoadingState } from "@/design-system/components/LoadingState";
import { FolderCard } from "../components/FolderCard";
import { useFoldersList } from "../api";
import { MOCK_GRADES, MOCK_TERMS } from "../mocks";
import type { ResourceFolder } from "../types";

export function ResourcesManagement() {
    const { t } = useTranslation("resources");
    const navigate = useNavigate();
    const [selectedGrade, setSelectedGrade] = useState<string>("");
    const [selectedTerm, setSelectedTerm] = useState<string>("");

    const { data: folders = [], isLoading } = useFoldersList({
        gradeId: selectedGrade || undefined,
        termId: selectedTerm || undefined,
    });

    // Group folders by grade and term
    const groupedFolders = useMemo(() => {
        const groups: Record<
            string,
            { grade: string; term: string; folders: ResourceFolder[] }
        > = {};

        folders.forEach((folder) => {
            const key = `${folder.grade.id}-${folder.term.id}`;
            if (!groups[key]) {
                groups[key] = {
                    grade: folder.grade.name,
                    term: folder.term.name,
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
                        >
                            <option value="">{t("allGrades")}</option>
                            {MOCK_GRADES.map((grade) => (
                                <option key={grade.id} value={grade.id}>
                                    {grade.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Term Filter */}
                    <div>
                        <select
                            value={selectedTerm}
                            onChange={(e) => setSelectedTerm(e.target.value)}
                            className="w-full px-4 py-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-brand-500"
                        >
                            <option value="">{t("allTerms")}</option>
                            {MOCK_TERMS.map((term) => (
                                <option key={term.id} value={term.id}>
                                    {term.name}
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
                </div>
            )}
        </PageWrapper>
    );
}

export default ResourcesManagement;
